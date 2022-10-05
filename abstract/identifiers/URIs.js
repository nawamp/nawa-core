const loose_pattern = /^([^\s\.#]+\.)*([^\s\.#]+)$/;
const strict_pattern = /^([0-9a-z_]+\.)*([0-9a-z_]+)$/;


function loose_test(s){
    return loose_pattern.test(s);
}

function strict_test(s){
    if(!loose_test(s)) return false;
    return strict_pattern.test(s);
}

export default {
    loose_test, strict_test
}
