import { global_scope_id } from "src/identifiers/IDs";
import messages from "src/messages";
import session_storage from "src/session/memory_storage";
import session_manager from "src/session";
import { pubsub_table } from "src/router/table";

export default async function recv_unsubscribe({ session, session_id, data }){
    let message = null;
    try{
        message = messages.unsubscribe.parse(data);
    } catch(e){
        return session_manager.protocol_violation(session_manager);
    }

    let subscription_id = message.subscription;
    let removed = await pubsub_table.remove_id_from_session(
        subscription_id, session_id);
    if(removed){
        this.emit("data", session_id, messages.unsubscribed({
            request: message.request,
        }));
    } // TODO else
}
