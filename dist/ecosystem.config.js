"use strict";

module.exports = {
  apps: [{
    name: "LUV_API",
    script: "./index.js",
    watch: true,
    max_memory_restart: '500M',
    exec_mode: 'cluster',
    instances: 1,
    env: {
      NODE_ENV: "production",
      PORT: "3001",
      HOST: "0.0.0.0",
      BASIC_USERNAME: "",
      BASIC_PASSWORD: ""
    },
    env_development: {
      NODE_ENV: "development"
    }
  }]
};