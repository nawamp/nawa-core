const code = 33;
function subscribed({ request_id, subscription_id }){
    return [
        code,
        request_id,
        subscription_id
    ];
}

subscribed.code = code;
export default subscribed;
