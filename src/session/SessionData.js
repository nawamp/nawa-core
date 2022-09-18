/*
 * SessionData: a data holder for session
 *
 * This class is solely a data holder for given session. It may do some
 * calculations, like queries of having a given subscription topic, or RPC
 * handler, but it doesn't involve in the protocol logic.
 *
 * We use design to separate logical functions and instances of sessions.
 * If a session is to be closed later, it's easily garbage collected, since
 * in this class we don't make external references.
 */

class SessionData {

    constructor(){
        this.subscriptions = [];
        this.RPCs = [];

        this.established = false;
        this.realm = null;

        this.time_creation = new Date().getTime();

        this.message_id_counter = 0;
    }

}

export default SessionData;
