'use strict'
const tracer = require('../../')
tracer.startTrace('test trace', function() {
  tracer.addAttribute('test attribute', 0)
  const trace = tracer.endTrace()
  // the root segment in the trace should have a test attribute with a value of 0
  console.log(JSON.stringify(trace, null, 2))
})
