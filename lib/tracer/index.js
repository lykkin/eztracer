'use strict'

class Tracer {
  constructor() {
    this.segment = null
  }

  getCurrentSegment() {
    return this.segment
  }

  applySegment(segment, handleFunction) {
    // replace the current active segment
    const originalSegment = this.segment
    this.segment = segment
    try {
      // execute the given function
      return handleFunction()
    } finally {
      // update the timing of the given segment and replace the segment
      // that was active before we stepped in
      segment.update()
      this.segment = originalSegment
    }
  }

  endTrace() {
    const trace = this.segment && this.segment.trace
    if (trace) {
      trace.end()
    }
    return trace
  }
}

module.exports = Tracer
