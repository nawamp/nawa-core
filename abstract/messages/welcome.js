const _ = require("lodash");

const code = 2;
function welcome({ session, details }){
    return [
        code,
        session,
        details
    ];
}


welcome.code = code;
export default welcome;
