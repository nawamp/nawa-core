import { global_scope_id } from "src/identifiers/IDs";
import messages from "src/messages";
import session_storage from "src/session/memory_storage";
import { rpc_table } from "src/router/table";
const events = require("events");

export default async function recv_register({ session, session_id, data }){
    let message = null;
    try{
        message = messages.register.parse(data);
    } catch(e){
        console.error(e);
        return this.session_manager.protocol_violation();
    }
    let registration_id = await rpc_table.add({
        session_id, realm: session.realm, uri: message.procedure });
    this.emit("data", session_id, messages.registered({
        request: message.request,
        registration: registration_id,
    }));
}
