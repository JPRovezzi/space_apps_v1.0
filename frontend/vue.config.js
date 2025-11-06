const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  publicPath: "/space_apps_v1.0/", // 👈 Esta línea es clave para GitHub Pages
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Astrochingolo";
      return args;
    });
  },
});
