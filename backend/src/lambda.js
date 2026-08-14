'use strict';

const serverlessExpress = require('@codegenie/serverless-express');
const app = require('./app');

module.exports.handler = serverlessExpress({ app });