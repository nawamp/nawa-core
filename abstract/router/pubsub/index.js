import messages from "src/messages";
import session_storage from "src/session/memory_storage";
import { pubsub_table } from "src/router/table";
const events = require("events");



class PubsubRouter extends events.EventEmitter {

    constructor(session_manager){
        super();
        this.session_manager = session_manager;
    }
    
    recv(session_id, data){
        const msgcode = data[0];
        switch(msgcode){
            case messages.PUBLISH:
                this._recv_publish(session_id, data); break;
            case messages.SUBSCRIBE:
                this._recv_subscribe(session_id, data); break;
            case messages.UNSUBSCRIBE:
                this._recv_unsubscribe(session_id, data); break;
            default:
                return false;
        }
        return true;
    }

    assert_session(session_id){
        let session = session_storage.get(session_id);
        if(!session || !session.established){
            this.session_manager.protocol_violation();
            return null;
        }
        return session;
    }

    async _recv_publish(session_id, data){
    }

    async _recv_subscribe(session_id, data){
        let session = this.assert_session(session_id);
        let subscription_id = await pubsub_table.add({
            session_id, realm: session.realm, uri: data[3]});
        this.emit("data", session_id, messages.subscribed({
            request_id: data[1],
            subscription_id,
        }));
    }

    async _recv_unsubscribe(session_id, data){
    }
}

export default PubsubRouter;
