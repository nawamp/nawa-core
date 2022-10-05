/*
 * Index for records in RouterTable
 *
 * For each entry in RouterTable, index of their fields is built so that we
 * can reverse lookup an entry based on its value.
 *
 * For example, a session of `session_id` may register several RPC endpoints.
 * Each endpoint entry will have a record in `rpc_table`. In an index of
 * `session_id`, we record keys of all records having given `session_id`. So
 * if one want's to find all endpoint registrations, it's only needed to look
 * in this index for `session_id`.
 */

class TableIndex {

    #data;

    constructor(){
        this.#data = new Map();
    }

    size(){
        return this.#data.size;
    }

    add(lookup_key, referenced_symbol){
        // `referenced_symbol` is the main key in router table.
        if(!this.#data.has(lookup_key)){
            this.#data.set(lookup_key, new Set());
        }
        const store = this.#data.get(lookup_key);
        store.add(referenced_symbol);
    }

    remove(lookup_key, referenced_symbol){
        if(!this.#data.has(lookup_key)) return false;
        const store = this.#data.get(lookup_key);
        const ret = store.delete(referenced_symbol);
        if(store.size < 1){
            this.#data.delete(lookup_key);
        }
        return ret;
    }

    remove_all(lookup_key){
        return tihs.#data.delete(lookup_key);
    }

    get(lookup_key){
        if(!this.#data.has(lookup_key)) return [];
        return Array.from(this.#data.get(lookup_key));
    }
}

export default TableIndex;
