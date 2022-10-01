const _ = require("lodash");
import { router_scope_id } from "src/identifiers/IDs";
import TableIndex from "./TableIndex";


class RouterTable {

    #data;

    constructor(table_id){
        this.table_id = table_id;
        this.#data = new Map();
        // { Symbol() => { id, session_id, realm, uri, details }, ...}
        
        this.index_id = new TableIndex();
        this.index_session_id = new TableIndex();
        this.index_uri = new TableIndex();
    }

    #retrieve_list_by_symbols(symbols){
        return _.compact(symbols.map((symbol)=>this.#data.get(symbol)));
    }

    #remove_by_symbol(symbol){
        const record = this.#data.get(symbol);
        if(!record) return false;

        this.index_id.remove(record.id, symbol);
        this.index_session_id.remove(record.session_id, symbol);
        this.index_uri.remove(record.uri, symbol);

        this.#data.delete(symbol);
        return true;
    }

    async add({ session_id, realm, uri }){
        // TODO assertions to avoid parameter error
        // deduplication
        const test_symbols = this.index_session_id.get(session_id);
        const existing_records = _.filter(
            this.#retrieve_list_by_symbols(test_symbols),
            (record)=>record.uri == uri && record.realm == realm
        ); // [{...}, {...}, ...]
        if(existing_records.length > 0){
            return existing_records[0].id;
        }
        // if no duplication
        const symbol = Symbol();
        const id = await router_scope_id(this.table_id, realm, uri, {});
        this.#data.set(symbol, { id, session_id, realm, uri });

        this.index_id.add(id, symbol);
        this.index_session_id.add(session_id, symbol);
        this.index_uri.add(uri, symbol);
        return id;
    }

    async find_by_uri(realm, uri){
        const symbols = this.index_uri.get(uri);
        return _.filter(
            this.#retrieve_list_by_symbols(symbols),
            (record)=>record.realm == realm
        ); // [{...}, {...}, ...]
    }

    async remove_session_id(session_id){
        const symbols = this.index_session_id.get(session_id);
        symbols.forEach((symbol)=>this.#remove_by_symbol(symbol));
        return symbols.length;
    }

    async remove_id_from_session(id, session_id){
        const symbols = this.index_session_id.get(session_id);
        let count = 0;
        symbols.forEach((symbol)=>{
            let record = this.#data.get(symbol);
            if(record.id == id){
                // id and symbol are both unique, therefore "removing id from
                // anything with given session_id" is done by removing the
                // whole record from #data.
                this.#remove_by_symbol(symbol);
                count += 1;
            }
        });
        return count;
    }

}

export default RouterTable;
