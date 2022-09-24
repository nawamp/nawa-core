import { global_scope_id } from "src/identifiers/IDs";
import messages from "src/messages";
import session_storage from "src/session/memory_storage";
import { rpc_table } from "src/router/table";
import invocation_table from "src/router/rpc/invocation_table";
const _ = require("lodash");
const events = require("events");

async function find_procedures(realm, uri){
    let procedures = await rpc_table.find_by_uri(realm, uri);
    return procedures.map(
        (e)=>{ return { procedure: e.id, session_id: e.session_id } });
}

export default async function recv_call({ session, session_id, data }){
    let msg_call = null;
    try{
        msg_call = messages.call.parse(data);
    } catch(e){
        console.error(e);
        return this.session_manager.protocol_violation();
    }


    // find procedures 
    let procedures = await find_procedures(session.realm, msg_call.procedure);

    // if none procedure callable, return error
    if(procedures.length < 1){
        this.emit("data", session_id, messages.error({
            type: messages.CALL,
            request: msg_call.request,
            details: {},
            error: "wamp.error.no_such_procedure",
        }));
        return;
    }

    let procedure = _.first(procedures); // TODO

    let invocation_request_id = session.new_message_id();
    let msg_invocation = messages.invocation({
        request: invocation_request_id,
        registration: procedure.procedure,
        details: {},
        arguments: _.get(msg_call, "arguments", []),
        argumentskw: _.get(msg_call, "argumentskw", {}),
    });

    await invocation_table.add({
        caller_request_id: msg_call.request,
        caller_session_id: session_id,
        callee_session_id: procedure.session_id,
        callee_request_id: invocation_request_id,
    });

    this.emit("data", procedure.session_id, msg_invocation);
}
