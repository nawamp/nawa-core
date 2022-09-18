import SessionManager from "./session";

const events = require("events");
const _ = require("lodash");


class NawaAbstract extends events.EventEmitter {

    constructor(){
        super();
        this.session_manager = this._passthru(new SessionManager());
    }

    _passthru(emitter){
        /* Any data (outgoing protocol packets) emitted by a emitter is
         * emitted on this base class. */
        emitter.on("data", (session_id, data)=>{
            this.emit("data", session_id, data);
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
    }

}

export { NawaAbstract };
