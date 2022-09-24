import { global_scope_id } from "src/identifiers/IDs";
import messages from "src/messages";
import session_storage from "src/session/memory_storage";
import { rpc_table } from "src/router/table";
import invocation_table from "src/router/rpc/invocation_table";
const _ = require("lodash");
const events = require("events");


export default async function recv_invocation_error({
    session,
    session_id,
    data,
}){
    let msg_error = null;
    try{
        msg_error = messages.error.parse(data);
    } catch(e){
        console.error(e);
        return this.session_manager.protocol_violation();
    }


}
