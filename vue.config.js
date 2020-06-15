// vue.config.js
module.exports = {
    chainWebpack: config => {
        // GraphQL Loader
        config.module
            .rule('graphql')
            .test(/\.(graphql|gql)$/)
            .use('graphql-tag/loader')
            .loader('graphql-tag/loader')
            .end();
    },
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/graphql': {
                target: 'http://localhost:8000/',
                changeOrigin: true,
            },
        },
    },
};
