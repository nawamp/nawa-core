import { global_scope_id } from "src/identifiers/IDs";
import messages from "src/messages";
import session_storage from "src/session/memory_storage";
import { pubsub_table } from "src/router/table";
const events = require("events");

import recv_publish from "./recv_publish";
import recv_subscribe from "./recv_subscribe";
import recv_unsubscribe from "./recv_unsubscribe";


const PUBSUB_MSGHANDLERS = {};
PUBSUB_MSGHANDLERS[messages.PUBLISH] = recv_publish;
PUBSUB_MSGHANDLERS[messages.SUBSCRIBE] = recv_subscribe;
PUBSUB_MSGHANDLERS[messages.UNSUBSCRIBE] = recv_unsubscribe;


class PubsubRouter extends events.EventEmitter {

    constructor(session_manager){
        super();
        this.session_manager = session_manager;
    }
    
    recv(session_id, data){
        const msgcode = data[0];
        const handler = PUBSUB_MSGHANDLERS[msgcode];
        if(undefined === handler) return false;

        let session = null;
        try{
            session = this.session_manager.assert_session(session_id);
        } catch(e){
            return false;
        }

        handler.call(this, { session, session_id, data });
        return true;
    }

}

export default PubsubRouter;
