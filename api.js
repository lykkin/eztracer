'use strict'

const Trace = require('./lib/tracer/trace')

const INSTRUMENTATION = require('./lib/instrumentation')

class API {
  constructor(tracer) {
    this.tracer = tracer
  }

  /**
   * Annotate the current running segment with an attribute.
   * 
   * name must be a non-empty string, value must be a non-null value.
   */
  addAttribute(name, value) {
    const segment = this.tracer.getCurrentSegment()
    if (segment) {
      segment.addAttribute(name, value)
    }
  }

  /**
   * Start a new trace - the trace's root segment will be active while handleFunction
   * executes.
   *
   * name must be a non-empty string, handleFunction must be a function.
   * handleFunction takes no arguments.
   */
  startTrace(name, handleFunction) {
    if (typeof name !== 'string' || !name.length) {
      throw new Error('name must be a non-empty string')
    }
    if (typeof handleFunction !== 'function') {
      throw new Error('handleFunction must be a function')
    }
    const trace = new Trace(name)
    this.tracer.applySegment(trace.root, handleFunction)
  }

  /**
   * Loads instrumentation for moduleName and applies it to module.
   *
   * For example:
   * ```js
   * const express = api.applyInstrumentation('express', require('express'))
   * ```
   */
  applyInstrumentation(moduleName, module) {
    const instrumentation = INSTRUMENTATION[moduleName]
    if (instrumentation) {
      return instrumentation(module, this.tracer)
    }
  }

  /**
   * Ends the current running trace.
   *
   * Returns the ended trace.
   */
  endTrace() {
    return this.tracer.endTrace()
  }
}

module.exports = API
