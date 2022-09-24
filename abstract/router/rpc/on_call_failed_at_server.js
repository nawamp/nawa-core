import session_manager from "src/session";
import messages from "src/messages";

export default async function on_call_failed_at_server({
    request_id,
    session_id
}){
    session_manager.emit("data", session_id, messages.error({
        type: messages.CALL,
        request: request_id,
        details: {},
        error: "wamp.error.no_such_procedure",
    }));
}
