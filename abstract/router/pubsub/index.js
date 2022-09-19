import { global_scope_id } from "src/identifiers/IDs";
import messages from "src/messages";
import session_storage from "src/session/memory_storage";
import { pubsub_table } from "src/router/table";
const events = require("events");



class PubsubRouter extends events.EventEmitter {

    constructor(session_manager){
        super();
        this.session_manager = session_manager;
    }
    
    recv(session_id, data){
        const msgcode = data[0];
        switch(msgcode){
            case messages.PUBLISH:
                this._recv_publish(session_id, data); break;
            case messages.SUBSCRIBE:
                this._recv_subscribe(session_id, data); break;
            case messages.UNSUBSCRIBE:
                this._recv_unsubscribe(session_id, data); break;
            default:
                return false;
        }
        return true;
    }

    async _find_subscriptions(realm, uri){
        let subscriptions = await pubsub_table.find_by_uri(realm, uri);
        return subscriptions.map(
            (e)=>{ return { subscription: e.id, session_id: e.session_id } });
    }

    async _recv_publish(session_id, data){
        let session = null;
        try{
            session = this.session_manager.assert_session(session_id);
        } catch(e){
            return;
        }
        let msg_publish = null;
        try{
            msg_publish = messages.publish.parse(data);
        } catch(e){
            console.error(e);
            return this.session_manager.protocol_violation();
        }

        // find subscribers
        let subscriptions = await this._find_subscriptions(
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

    async _recv_subscribe(session_id, data){
        let session = null;
        try{
            session = this.session_manager.assert_session(session_id);
        } catch(e){
            return;
        }
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

    async _recv_unsubscribe(session_id, data){
        let session = null;
        try{
            session = this.session_manager.assert_session(session_id);
        } catch(e){
            return;
        }
        let message = null;
        try{
            message = messages.unsubscribe.parse(data);
        } catch(e){
            return this.session_manager.protocol_violation();
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
}

export default PubsubRouter;
