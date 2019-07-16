'use strict'

const API = require('./api')
const Tracer = require('./lib/tracer')

const api = new API(new Tracer())

module.exports = api
