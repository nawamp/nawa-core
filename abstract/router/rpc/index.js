import messages from "src/messages";
const events = require("events");

class RPCRouter extends events.EventEmitter {
    
    recv(session_id, data){
        const msgcode = data[0];
        switch(msgcode){
            case messages.CALL:
                this._recv_call(session_id, data); break;
            case messages.REGISTER:
                this._recv_register(session_id, data); break;
            case messages.UNREGISTER:
                this._recv_unregister(session_id, data); break;
            case messages.YIELD:
                this._recv_yield(session_id, data); break;
            default:
                return false;
        }
        return true;
    }

}

export default RPCRouter;
