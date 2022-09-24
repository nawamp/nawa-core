import session_manager from "./session";
import pubsub_router   from "./router/pubsub";
import rpc_router      from "./router/rpc";

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

        this.#connect(session_manager);
        this.#connect(pubsub_router);
        this.#connect(rpc_router);
    }

    #connect(emitter){
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
        return await session_manager.create_session();
    }

    async session_receive(session_id, data){
        if(!_.isArray(data)){
            throw Error(
                "Invalid call to NawaAbstract. " +
                "Data must be a list, as specified by WAMP protocol."
            );
        }
        
        if(session_manager.recv(session_id, data)) return;
        if(pubsub_router.recv(session_id, data)) return;
        if(rpc_router.recv(session_id, data)) return;
        session_manager.close_session(session_id);
    }

}

export { NawaAbstract };
