import { global_scope_id } from "src/identifiers/IDs";
import messages from "src/messages";
import session_storage from "src/session/memory_storage";
import { rpc_table } from "src/router/table";
const events = require("events");

export default async function recv_register({ session, session_id, data }){
    let message = null;
    try{
        message = messages.unregister.parse(data);
    } catch(e){
        console.error(e);
        return this.session_manager.protocol_violation();
    }
    let registration_id = message.registration;
    let removed = await rpc_table.remove_id_from_session(
        registration_id, session_id);
    if(removed){
        this.emit("data", session_id, messages.unregistered({
            request: message.request,
        }));
    } // TODO else
}
