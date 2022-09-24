import { global_scope_id } from "src/identifiers/IDs";
import messages from "src/messages";
import session_manager from "src/session";
import session_storage from "src/session/memory_storage";
import { pubsub_table } from "src/router/table";

async function find_subscriptions(realm, uri){
    let subscriptions = await pubsub_table.find_by_uri(realm, uri);
    return subscriptions.map(
        (e)=>{ return { subscription: e.id, session_id: e.session_id } });
}


export default async function recv_publish({ session, session_id, data }){
    let msg_publish = null;
    try{
        msg_publish = messages.publish.parse(data);
    } catch(e){
        console.error(e);
        return session_manager.protocol_violation(session_id);
    }

    // find subscribers
    let subscriptions = await find_subscriptions(
        session.realm, 
        msg_publish.topic
    );

    // return message for publisher
    let publication_id = await global_scope_id(); 
    let msg_published = messages.published({
        publication: publication_id,
        request: msg_publish.request,
    });

    // event message for subscriber
    if(subscriptions.length > 0){
        let msg_event = messages.event({
            subscription: subscriptions[0].subscription,
            publication: publication_id,
            details: {},
            arguments: msg_publish.arguments,
            argumentskw: msg_publish.argumentskw,
        });
        for(let each of subscriptions){
            this.emit("data", each.session_id, msg_event);
        }
    }

    this.emit("data", session_id, msg_published);
}
