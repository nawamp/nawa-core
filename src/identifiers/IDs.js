const crypto = require("crypto");


async function global_scope_id(){
    const random_bytes = await new Promise((resolve, reject)=>{
        crypto.randomBytes(8, (err, buf)=>{
            if(err) return reject();
            resolve(buf);
        });
    });

    const random_bigint = BigInt("0x" + random_bytes.toString("hex"));
    const mask = 9007199254740991n; // 0b1111....1111, 2^53-1, 53 times of 1
    return (random_bigint & mask) + 1n;
}


async function router_scope_id(){
}


async function session_scope_id(session_data){
    
}


export {
    global_scope_id,
    router_scope_id,
    session_scope_id,
}
