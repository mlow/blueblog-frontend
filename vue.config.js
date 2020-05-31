// vue.config.js
module.exports = {
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/graphql': {
                target: 'http://localhost:8000/',
                changeOrigin: true,
                // pathRewrite: {
                //     '^/api': '', // remove base path
                // },
            },
        },
    },
};
