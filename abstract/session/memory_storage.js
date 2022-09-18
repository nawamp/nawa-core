import SessionData from "./SessionData";
import { global_scope_id } from "src/identifiers/IDs";


const session_data = {};


async function create(){
    const new_session_id = await global_scope_id();
    session_data[new_session_id] = new SessionData({
        session_id: new_session_id,
    });
    return new_session_id;
}


function get(session_id){
    return session_data[session_id] || null;
}

function remove(session_id){
    if(session_data[session_id] === undefined) return;
    delete session_data[session_id];
}


export default {
    create,
    remove,
    get,
}
