const code = 3;
function abort({ details={}, reason }){
    return [
        code,
        details,
        reason
    ];
}

abort.code = code;
export default abort;
