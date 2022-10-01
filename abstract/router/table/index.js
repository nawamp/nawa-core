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

import RouterTable from "./RouterTable";

const pubsub_table = new RouterTable(1);
const rpc_table = new RouterTable(2);

export { pubsub_table, rpc_table }; 
