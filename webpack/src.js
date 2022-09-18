const path = require('path');
const webpack = require('webpack');

module.exports = function({ env, package_json }){
    const is_dev = (env.production === undefined);
    const output_path = path.resolve(__dirname, "..", is_dev?"dev":"dist");

    return [
        {
            entry: './src/index.js',
            mode: is_dev?'development':'production',
            watch: is_dev,
            output: {
                filename: 'nawa-abstract.js',
                path: output_path,
                library: {
                    type: "commonjs",
                }
            },
            resolve: {
                alias: {
                    src: path.resolve(__dirname, "..", "src"),
                }
            },
            externals: {
                "crypto": "commonjs crypto",
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
            plugins: [
                new webpack.DefinePlugin({
                    NAWA_VERSION: `"${package_json.version}"`,
                }),
            ],
        },
    ];

}
