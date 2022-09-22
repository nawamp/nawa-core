import { global_scope_id } from "src/identifiers/IDs";
import messages from "src/messages";
import session_storage from "src/session/memory_storage";
import { rpc_table } from "src/router/table";
const events = require("events");

import recv_register from "./recv_register";
import recv_unregister from "./recv_unregister";


const RPC_MSGHANDLERS = {};
RPC_MSGHANDLERS[messages.REGISTER] = recv_register;
RPC_MSGHANDLERS[messages.UNREGISTER] = recv_unregister;




class RPCRouter extends events.EventEmitter {
    
    constructor(session_manager){
        super();
        this.session_manager = session_manager;
    }

    recv(session_id, data){
        const msgcode = data[0];
        const handler = RPC_MSGHANDLERS[msgcode];
        if(undefined === handler) return false;

        let session = null;
        try{
            session = this.session_manager.assert_session(session_id);
        } catch(e){
            return true; // handled, even if it's meant to no valid session
        }

        handler.call(this, { session, session_id, data });
        return true;
    }

}

export default RPCRouter;
