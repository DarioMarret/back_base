module.exports = {
  apps: [{
    name: "BACKEND_PUNTOVENTA",
    script: "./index.js",
    watch: true,
    max_memory_restart: '500M',
    exec_mode: 'cluster',
    instances: 1,
    env: {
      NODE_ENV: "production",
      PORT: "3001",
      HOST: "0.0.0.0",
      USER_DB:"root",
      PASSWORD_DB:"Marret123456+-*",
      DATABASE_DB:"facturacion_api",
      HOST_DB:"localhost",
    },
    env_development: {
      NODE_ENV: "development"
    }
  }]
}
