import session_storage from "./memory_storage";
import messages from "src/messages";
import { pubsub_table, rpc_table } from "src/router/table";

const events = require("events");




class SessionManager extends events.EventEmitter {
    constructor(){
        super();
    }

    assert_session(session_id){
        let session = session_storage.get(session_id);
        if(!session || !session.established){
            this.session_manager.protocol_violation();
            throw Error("Session not ready.");
        }
        return session;
    }

    async create_session(){
        return await session_storage.create();
    }

    async close_session(session_id, reason){
        session_storage.remove(session_id);
        pubsub_table.remove_session_id(session_id);
        rpc_table.remove_session_id(session_id);

        this.emit("data", session_id, messages.abort({
            reason: reason?reason:"wamp.close.close_realm",
            details: {},
        }));
        this.emit("session_close", session_id);
    }

    async protocol_violation(session_id){
        return await this.close_session(
            session_id,
            "wamp.close.protocol_violation"
        );
    }

    recv(session_id, data){
        const msgcode = data[0];
        switch(msgcode){
            case messages.HELLO:
                this._recv_hello(session_id, data); break;
            case messages.ABORT:
                this._recv_abort(session_id, data); break;
            case messages.GOODBYE:
                this._recv_goodbye(session_id, data); break;
            default:
                return false;
        }
        return true;
    }

    async _recv_hello(session_id, data){
        let parsed = {};
        try{
            parsed = messages.hello.parse(data);
        } catch(e){
            console.error(e);
            return await this.protocol_violation(session_id);
        }

        let session_data = session_storage.get(session_id);
        if(session_data != null && session_data.established){
            return await this.protocol_violation(session_id);
        }

        let realm = parsed.realm;
        // TODO check for details

        session_data.realm = realm;
        session_data.established = true;

        this.emit("data", session_id, messages.welcome({
            session: session_id,
            details: {
                agent: `NAWA/${NAWA_VERSION} (NeoAtlantis WAMP Router)`,
                roles: {
                    broker: {},
                    dealer: {},
                }
            }
        }));
    }

    async _recv_abort(session_id, data){
        console.log("received ABORT.");
        // No response to an ABORT message is expected.
        return await this.close_session(session_id);
    }

    async _recv_goodbye(session_id, data){
        console.log("received GOODBYE.");
        return await this.close_session(session_id);
    }



}


const session_manager = new SessionManager();

export default session_manager; 
