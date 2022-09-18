const _ = require("lodash");

const code = 1;
function hello({ realm, details }){
    return [
        code,
        realm,
        details
    ];
}

function parse(data){
    if(data[0] != code) throw Error("Not a HELLO message.");
    if(!_.isString(data[1])) throw Error("realm is not a string.");

    return {
        realm: data[1],
        details: data[2],
    }
}

hello.code = code;
hello.parse = parse;
export default hello;
