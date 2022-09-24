/*
 * RPC Invocation State Table
 *
 * This table holds
 *  (INVOCATION.Request|id, caller_session_id, callee_session_id, timestamp)
 * temporarily. 
 *
 *  - INVOCATION.Request|id, is the request ID of the INVOCATION call to the
 *    callee.
 *  - If the callee returns an ERROR, or the call timed out, we use this table
 *    to inform the caller on that error.
 *  - Removing table items based on session_id should remove items having
 *    either caller_session_id or callee_session_id matching given session_id.
 *    However, if a callee is removed while caller session exists, we should
 *    implement sending error back to caller.
 */


const _ = require("lodash");
import { router_scope_id } from "src/identifiers/IDs";
import session_storage from "src/session/memory_storage";


class InvocationTable {

    #dataset = [];

    constructor(){
        const self = this;
        // [
        //  { request_id, caller_session_id, callee_session_id, timestamp },
        //  ...
        // ]
        setInterval(()=>self.maintenance.call(self), 5000);
    }

    async maintenance(){
        for(let i=0; i<this.#dataset.length; i++){
            if(this.#dataset[i].caller_session_id !== null){
                if(null === session_storage.get(
                    this.#dataset[i].caller_session_id)
                ){
                    this.#dataset[i].caller_session_id = null;
                }
            }
            if(this.#dataset[i].callee_session_id !== null){
                if(null === session_storage.get(
                    this.#dataset[i].callee_session_id)
                ){
                    this.#dataset[i].callee_session_id = null;
                }
            }
        }

        // remove state records with neither caller nor callee connection
        _.remove(
            this.#dataset,
            (e)=>e.caller_session_id == null && e.callee_session_id == null
        );
    }

    async add({ request_id, caller_session_id, callee_session_id }){
        this.#dataset.push({
            request_id, caller_session_id, callee_session_id,
            timestamp: new Date().getTime(),
        });
    }

    async find_requests_with_callee({ callee_session_id, request_id }){
        let ret = _.filter(
            this.#dataset,
            (e)=>
                e.callee_session_id == callee_session_id &&
                e.request_id == request_id
        );
        return ret;
    }

    async remove_request({ caller_session_id, callee_session_id, request_id }){
        console.log("removing", this.#dataset, arguments);
        return _.remove(
            this.#dataset,
            (e)=>
                e.request_id == request_id && 
                (
                    (
                        caller_session_id != null &&
                        e.caller_session_id == caller_session_id
                    ) ||
                    (
                        callee_session_id != null &&
                        e.callee_session_id == callee_session_id
                    )
                )
        ).length;
    }

}

const table = new InvocationTable();

export default table;
