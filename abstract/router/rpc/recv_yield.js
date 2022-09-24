import { global_scope_id } from "src/identifiers/IDs";
import messages from "src/messages";
import session_storage from "src/session/memory_storage";
import { rpc_table } from "src/router/table";
import invocation_table from "src/router/rpc/invocation_table";
const _ = require("lodash");
const events = require("events");


export default async function recv_yield({ session, session_id, data }){
    let msg_yield = null;
    try{
        msg_yield = messages.yield.parse(data);
    } catch(e){
        console.error(e);
        return this.session_manager.protocol_violation();
    }

    let invocation_records = await invocation_table.find_requests_with_callee({
        callee_session_id: session_id,
        request_id: msg_yield.request,
    });

    if(invocation_records.length < 1){
        console.warn(
            "Could not find invocation record: ",
            arguments
        );
        return; // Out of spec, ignore it
    }

    let invocation_record = _.first(invocation_records);
    let { caller_session_id } = invocation_record;

    let msg_result = messages.result({
        request: msg_yield.request,
        details: {},
        arguments: _.get(msg_yield, "arguments", []),
        argumentskw: _.get(msg_yield, "argumentskw", {}),
    });

    this.emit("data", caller_session_id, msg_result);

    // delete invocation record

    await invocation_table.remove_request({
        caller_session_id,
        request_id: msg_yield.request,
    });
}
