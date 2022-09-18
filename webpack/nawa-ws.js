const path = require('path');
module.exports = function({ env }){
    const is_dev = (env.production === undefined);
    const output_path = path.resolve(__dirname, "..", is_dev?"dev":"dist");

    const externals = {
        "nawa": "commonjs ./nawa-abstract",
    };
    for(let i of "tls,crypto,net,url,stream,http,https,zlib,path,os,fs,utf-8-validate,bufferutils".split(",")) externals[i] = "commonjs " + i;

    return [
        {
            entry: './nawa-ws/index.js',
            mode: is_dev?'development':'production',
            watch: is_dev,
            output: {
                filename: 'nawa-ws.js',
                path: output_path,
            },
            resolve: {
                alias: {
                    test: path.resolve(__dirname, "..", "test"),
                },
            },
            externals,
            module: {
                rules: [
                    {
                        test: /\.(js)$/,
                        loader: 'ifdef-loader',
                        exclude: /node_modules/,
                        options: {
                            DEV: is_dev,
                        }
                    }
                ]
            },
        },
    ];

}
