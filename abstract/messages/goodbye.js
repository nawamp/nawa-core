const code = 6;
function goodbye({ details={}, reason }){
    return [
        code,
        details,
        reason
    ];
}

goodbye.code = code;
export default goodbye;
