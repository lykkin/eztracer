'use strict'

const Segment = require('./segment')

const ExclusiveTimeCalculator = require('./exclusive-time-calculator')

class Trace {
  constructor(name) {
    this.name = name
    this.root = new Segment(name, this)
    this.attributes = {}
  }

  end() {
    const segmentQueue = [this.root]
    while (segmentQueue.length) {
      const toEnd = segmentQueue.pop()
      toEnd.softEnd()
      Array.prototype.push.apply(segmentQueue, toEnd.getChildren())
    }
    const calculator = new ExclusiveTimeCalculator(this.root)
    calculator.process()
  }

  toJSON() {
    return {
      name: this.name,
      trace: this.root,
      attributes: this.attributes
    }
  }
}

module.exports = Trace
