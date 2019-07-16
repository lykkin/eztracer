'use strict'

const Timer = require('./timer')

class Segment {
  constructor(name, trace) {
    this.name = name
    this.timer = new Timer()
    this.attributes = {}
    this.trace = trace

    this._children = []
    this._exclusiveDuration = null
    this._totalDuration = null
  }

  getChildren() {
    return this._children
  }

  // ends the segment's timer, does not allow addition updating
  end(timestamp=Date.now()) {
    this.timer.end(timestamp)
  }

  // only end if timer hasn't been updated/ended since creation
  softEnd(timestamp=Date.now()) {
    if (this.timer.duration == null) {
      this.timer.end()
    }
  }

  //TESTING ONLY: set the start and duration of the segment's timer
  setDurationInMillis(duration, startTime) {
    this.timer.duration = duration
    this.timer.ended = true
    if (startTime) {
      this.timer.start = startTime
    }
  }

  // update but don't end, used for possibly async segment.
  update(timestamp=Date.now()) {
    this.timer.update(timestamp)
  }

  addChild(name) {
    if (typeof name !== 'string' || !name.length) {
      throw new Error('name must be a non-empty string')
    }
    const child = new Segment(name, this.trace)
    this._children.push(child)
    return child
  }

  getDurationInMillis() {
    return this.timer.getDurationInMillis()
  }

  addAttribute(name, value) {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('name must be a non-empty string')
    }
    
    // null values are ignored by the backend, so skip them.
    if (value) {
      this.attributes[name] = value
    }
  }

  toJSON() {
    return {
      name: this.name,
      startTime: this.timer.start,
      attributes: this.attributes,
      totalDuration: this.timer.duration,
      exclusiveDuration: this._exclusiveDuration,
      children: this._children
    }
  }
}

module.exports = Segment
