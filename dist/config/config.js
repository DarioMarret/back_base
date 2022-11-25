"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headers = void 0;

require("dotenv/config");

const {
  base64encode,
  base64decode
} = require('nodejs-base64');

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${base64encode(process.env.BASIC_USERNAME + ':' + process.env.BASIC_PASSWORD)}`
};
exports.headers = headers;