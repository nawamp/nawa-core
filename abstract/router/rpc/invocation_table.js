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
import session_manager from "src/session";
import on_call_failed_at_server from "./on_call_failed_at_server";


class InvocationTable {

    #dataset = [];

    constructor(){
        const self = this;
        // [
        //  {
        //      caller_request_id, callee_request_id,
        //      caller_session_id, callee_session_id,
        //      timestamp
        //  },
        //  ...
        // ]
        setInterval(()=>self.maintenance.call(self), 5000);
    }

    async maintenance(){
        for(let i=0; i<this.#dataset.length; i++){
            let { caller_session_id, callee_session_id } = this.#dataset[i];
            if(
                !_.isNil(caller_session_id) &&
                !session_storage.exists(caller_session_id)
            ){
                this.#dataset[i].caller_session_id = null;
            }
            if(
                !_.isNil(callee_session_id) &&
                !session_storage.exists(callee_session_id)
            ){
                this.#dataset[i].callee_session_id = null;
            }
        }

        // notify callers waiting for leaved callees
        _.forEach(
            _.filter(this.#dataset, (e)=>_.isNil(e.callee_session_id)),
            ({ caller_session_id, caller_request_id }) => {
                on_call_failed_at_server({
                    request_id: caller_request_id,
                    session_id: caller_session_id,
                });
            }
        );

        // remove state records with caller or callee disappeared 
        _.remove(
            this.#dataset,
            (e)=>_.isNil(e.caller_session_id) || _.isNil(e.callee_session_id)
        );

    }

    async add({
        caller_request_id, callee_request_id,
        caller_session_id, callee_session_id
    }){
        this.#dataset.push({
            caller_request_id, caller_session_id,
            callee_request_id, callee_session_id,
            timestamp: new Date().getTime(),
        });
    }

    async find_requests_with_callee({ callee_session_id, callee_request_id }){
        let ret = _.filter(
            this.#dataset,
            (e)=>
                e.callee_session_id == callee_session_id &&
                e.callee_request_id == callee_request_id
        );
        return ret;
    }

    async remove_request({
        caller_request_id,
        callee_request_id,
        caller_session_id,
        callee_session_id
    }){
        console.log("removing", this.#dataset, arguments);
        return _.remove(
            this.#dataset,
            (e)=>
                (
                    (
                        !_.isNil(caller_request_id) &&
                        e.caller_request_id == caller_request_id
                    ) ||
                    (
                        !_.isNil(callee_request_id) &&
                        e.callee_request_id == callee_request_id
                    )
                ) && 
                (
                    (
                        !_.isNil(caller_session_id != null) &&
                        e.caller_session_id == caller_session_id
                    ) ||
                    (
                        !_.isNil(callee_session_id != null) &&
                        e.callee_session_id == callee_session_id
                    )
                )
        ).length;
    }

}

const table = new InvocationTable();

export default table;
