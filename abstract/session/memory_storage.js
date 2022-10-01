import SessionData from "./SessionData";
import { global_scope_id } from "src/identifiers/IDs";


const session_data = new Map();


async function create(){
    const new_session_id = await global_scope_id();
    session_data.set(new_session_id, new SessionData({
        session_id: new_session_id,
    }));
    return new_session_id;
}


function get(session_id){
    return session_data.get(session_id) || null;
}

function remove(session_id){
    // Returns:
    //  - true if a session is deleted
    //  - false if no session deleted
    return session_data.delete(session_id);
}

function exists(session_id){
    return session_data.has(session_id);
}

export default {
    create,
    remove,
    get,
    exists,
}
