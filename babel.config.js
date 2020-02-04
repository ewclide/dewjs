module.exports = {
    presets: [
        '@babel/preset-env'
    ],
    plugins: [
        ['@babel/plugin-transform-runtime', { regenerator: true }],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-proposal-export-default-from'
    ]
};