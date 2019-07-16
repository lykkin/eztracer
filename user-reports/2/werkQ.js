'use strict'

class WerkQ {
  constructor() {
    this.queue = []
    this.tickScheduled = false
  }

  scheduleTick() {
    const currentTick = this.queue.slice()
    this.queue = []
    return this.executeTick(currentTick) 
  }

  enqueueTask(task) {
    this.queue.push(task)
    if (!this.tickScheduled) {
      this.tickScheduled = true
      setImmediate(this.scheduleTick.bind(this))
    }
  }

  executeTick(tickTasks) {
    if (tickTasks.length === 0) {
      this.tickScheduled = false
      if (this.queue.length > 0) {
        setImmediate(this.scheduleTick.bind(this))
      }
      return 
    }
    const task = tickTasks.shift()
    task(() => {
      setImmediate(
        this.executeTick.bind(this),
        tickTasks
      )
    })
  }
}

module.exports = WerkQ
