const fs = require("fs");

module.exports = (env)=>{
    let ret = [];

    const package_json = JSON.parse(fs.readFileSync("./package.json"));
    
    ret = ret.concat(require("./webpack/abstract")({ env, package_json }));
    ret = ret.concat(require("./webpack/nawa-ws")({ env, package_json }));
    ret = ret.concat(require("./webpack/test")({ env, package_json }));

    return ret;
}; 
