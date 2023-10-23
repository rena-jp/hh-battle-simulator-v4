module.exports = (env, argv) => ({
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: `./hh-battle-simulator-v4${argv.mode === 'development' ? '.dev' : ''}.user.js`,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: 'clean-css-loader',
                type: 'asset/source',
            },
        ],
    },
    externals: {
        jquery: '$',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [AddMetadata],
});

function AddMetadata(compiler) {
    const metadata = require('./build/metadata.js');
    const { ConcatSource } = compiler.webpack.sources;
    compiler.hooks.thisCompilation.tap('AddMetadata', compilation => {
        compilation.hooks.afterProcessAssets.tap('AddMetadata', assets => {
            Object.keys(assets).forEach(fileName => {
                if (fileName.endsWith('.user.js')) {
                    compilation.updateAsset(fileName, old => new ConcatSource(metadata, '\n', old));
                }
            });
        });
    });
}
