import { global_scope_id } from "src/identifiers/IDs";
import messages from "src/messages";
import session_storage from "src/session/memory_storage";
import session_manager from "src/session";
import { rpc_table } from "src/router/table";
const events = require("events");

import recv_register from "./recv_register";
import recv_unregister from "./recv_unregister";
import recv_call from "./recv_call";
import recv_yield from "./recv_yield";
import recv_invocation_error from "./recv_invocation_error";

const RPC_MSGHANDLERS = {};
RPC_MSGHANDLERS[messages.REGISTER] = recv_register;
RPC_MSGHANDLERS[messages.UNREGISTER] = recv_unregister;
RPC_MSGHANDLERS[messages.CALL] = recv_call;
RPC_MSGHANDLERS[messages.YIELD] = recv_yield;




class RPCRouter extends events.EventEmitter {
    
    constructor(){
        super();
    }

    recv(session_id, data){
        const msgcode = data[0];
        let handler = null;
        if(msgcode == messages.ERROR){
            const errorcode = data[1];
            if(messages.INVOCATION == errorcode){
                // INVOCATION ERROR
                handler = recv_invocation_error;
            } else {
                return false;
            }
        } else {
            handler = RPC_MSGHANDLERS[msgcode];
        }
        if(_.isNil(handler)) return false;

        let session = null;
        try{
            session = session_manager.assert_session(session_id);
        } catch(e){
            return true; // handled, even if it's meant to no valid session
        }

        handler.call(this, { session, session_id, data });
        return true;
    }

}

const router = new RPCRouter();
export default router;
