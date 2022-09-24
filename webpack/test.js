const path = require('path');
module.exports = function({ env }){
    const is_dev = (env.production === undefined);
    const output_path = path.resolve(__dirname, "..", is_dev?"dev":"dist");

    if(is_dev) return [];
    return [
        {
            entry: './test/index.js',
            mode: is_dev?'development':'production',
            watch: is_dev,
            output: {
                filename: 'test.js',
                path: output_path,
            },
            resolve: {
                alias: {
                    test: path.resolve(__dirname, "..", "test"),
                },
            },
            externals: {
                "nawa": "commonjs ./nawa-abstract",
            },
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
