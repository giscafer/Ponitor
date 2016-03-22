'use strict'
const config = require('../config.global');
const Redis = require('ioredis');

const client = new Redis({
  port: config.redis_port,
  host: config.redis_host,
  db: config.redis_db,
});

exports = module.exports = client;
