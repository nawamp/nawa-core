import SessionManager from "./session";
import PubsubRouter   from "./router/pubsub";
import RPCRouter      from "./router/rpc";

const events = require("events");
const _ = require("lodash");


class NawaAbstract extends events.EventEmitter {

    /* Emits:
     *  - data (session_id, data)
     *    for transmitting a data packet to given session_id.
     *  - close_session (session_id)
     *    the underlying transport (WebSocket) should close this connection as
     *    indicated by session_id, upon receiving this event.
     */

    constructor(){
        super();

        this.session_manager = this._passthru(new SessionManager());
        this.pubsub_router   = this._passthru(
            new PubsubRouter(this.session_manager));
        this.rpc_router      = this._passthru(
            new RPCRouter(this.session_manager));
    }

    _passthru(emitter){
        /* Any data (outgoing protocol packets) emitted by a emitter is
         * emitted on this base class. */
        emitter.on("data", (session_id, data)=>{
            this.emit("data", session_id, data);
        });
        emitter.on("session_close", (session_id)=>{
            this.emit("session_close", session_id);
        });
        return emitter;
    }

    async create_session(){
        /* Represents a new connection from client. The session is created
         * and session_id assigned. This session_id is used within WAMP
         * protocol spec, and also used to tag the underlying WebSocket
         * connection.
         *
         * As such, a new connection is always assigned a session_id,
         * regardless of whether within that connection a new session is
         * actually established. Therefore, any further calls to SessionManager
         * must include the session_id as its first argument.
         */
        return await this.session_manager.create_session();
    }

    async session_receive(session_id, data){
        if(!_.isArray(data)){
            throw Error(
                "Invalid call to NawaAbstract. " +
                "Data must be a list, as specified by WAMP protocol."
            );
        }
        
        if(this.session_manager.recv(session_id, data)) return;
        if(this.pubsub_router.recv(session_id, data)) return;
        if(this.rpc_router.recv(session_id, data)) return;
        this.session_manager.close_session(session_id);
    }

}

export { NawaAbstract };
