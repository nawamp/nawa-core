import { global_scope_id } from "src/identifiers/IDs";
import messages from "src/messages";
import session_storage from "src/session/memory_storage";
import { pubsub_table } from "src/router/table";

export default async function recv_subscribe({ session, session_id, data }){
    let message = null;
    try{
        message = messages.subscribe.parse(data);
    } catch(e){
        console.error(e);
        return this.session_manager.protocol_violation();
    }
    let subscription_id = await pubsub_table.add({
        session_id, realm: session.realm, uri: message.topic });
    this.emit("data", session_id, messages.subscribed({
        request: message.request,
        subscription: subscription_id,
    }));
}
