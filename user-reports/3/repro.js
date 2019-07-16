'use strict'
const tracer = require('../../')
tracer.applyInstrumentation('timers', global)

const WerkQ = require('./werkQ')
const queue = new WerkQ()

tracer.startTrace('first trace', function() {
  queue.enqueueTask(function firstTask(done) {
    // should end and print the first trace
    const trace = tracer.endTrace()
    console.log(
      'From first task (should be first trace):',
      JSON.stringify(trace, null, 2)
    )
    done()
  })
})

tracer.startTrace('second trace', function() {
  queue.enqueueTask(function secondTask(done) {
    // should end and print the second trace
    const trace = tracer.endTrace()
    console.log(
      'From second task (should be second trace):',
      JSON.stringify(trace, null, 2)
    )
    done()
  })
})
