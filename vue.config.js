// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    // GraphQL Loader
    config.module
      .rule("graphql")
      .test(/\.(graphql|gql)$/)
      .use("graphql-tag/loader")
      .loader("graphql-tag/loader")
      .end();
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: "http://api:4000/graphql",
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
      },
    },
  },
};
