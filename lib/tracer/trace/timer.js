'use strict'

class Timer {
  constructor(startTime=Date.now()) {
    this.start = startTime
    this.ended = false
    this.duration = null
  }

  end(timestamp=Date.now()) {
    if (!this.ended) {
      this.ended = true
      this.duration = timestamp - this.start
    }
  }

  update(timestamp=Date.now()) {
    if (!this.ended) {
      this.duration = timestamp - this.start
    }
  }

  getDurationInMillis() {
    return this.duration
  }

  toRange() {
    return this.duration != null ? [this.start, this.start + this.duration] : null
  }
}

module.exports = Timer
