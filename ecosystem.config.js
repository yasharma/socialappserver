module.exports = {
  apps : [
      {
        name: "socialproofbackend",
        script: "./server.js",
        watch: true,
        env: {
          "PORT": 8080,
          "NODE_ENV": "production",
        }
      }
  ]
}