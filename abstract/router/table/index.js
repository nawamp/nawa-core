/*
 * Router Table
 * 
 * Data of all subscriptions (Pub/Sub) and registrations (RPC) are hold in two
 * tables. Indexes are built on them for easier look up.
 *
 * Table row contains:
 *  - session_id
 *  - realm
 *  - uri
 *  - id: Subscription|Id or Registration|Id
 *
 * It's also assured that `id` is deterministic for each combination of
 * (table_id, realm, uri, details=={}), so that for each Event message, all
 * receiving parties are having the same Subscription|Id.
 *
 * Note: currently we do not care details, it's always {} in calculating id.
 */

const _ = require("lodash");
import { router_scope_id } from "src/identifiers/IDs";

class RouterTable {

    constructor(table_id){
        this.table_id = table_id;
        this.dataset = {}; // id -> { id, session_id, realm, uri, details }
    }

    async add({ session_id, realm, uri }){
        // TODO assertions to avoid parameter error

        const id = await router_scope_id(this.table_id, realm, uri, {});
        if(this.dataset[id] !== undefined) return;
        this.dataset[id] = { id, session_id, realm, uri };

        return id;
    }

    async find_by_uri(realm, uri){
        return _.filter(
            this.dataset,
            (e)=>e.realm == realm && e.uri == uri
        );
    }

    async remove_session_id(session_id){
        _
            .filter(this.dataset, (e)=>e.session_id == session_id)
            .map((e)=>e.id)
            .forEach((id)=>{ delete this.dataset[id] });
        ;
    }

}

const pubsub_table = new RouterTable(1);
const rpc_table = new RouterTable(2);

export { pubsub_table, rpc_table }; 