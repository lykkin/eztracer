'use strict'

// since we are instrumenting global methods
module.exports = function instrumentTimers(nodule, tracer) {
  // TODO: setInterval
  // ???: how do we handle clearing instrumented timers? e.g. clearTimeout
  const instrumentedGlobalTimers = [
    'setTimeout',
    'setImmediate'
  ]

  instrumentedGlobalTimers.forEach(function instrumentTimer(methodName) {
    const oldTimer = global[methodName]
    nodule[methodName] = wrappedMethod
    wrappedMethod.__instrumented = true
    function wrappedMethod(...args) {
      // check if we have a parent we can spawn off
      const parentSegment = tracer.getCurrentSegment()
      if (parentSegment == null) {
        return oldTimer.apply(nodule, arguments)
      }

      const timerSegment = parentSegment.addChild(methodName)

      // wrap the callback to update the timer segment and record the callback
      const cb = args[0]
      args[0] = function wrappedCB(...cbArgs) {
        timerSegment.update()
        const cbSegment = timerSegment.addChild('callback: ' + (cb.name || '<anonymous>'))
        return tracer.applySegment(cbSegment, function timeCallback() {
          return cb.apply(null, cbArgs)
        })
      }

      return tracer.applySegment(timerSegment, function timeTimerMethod() {
        return oldTimer.apply(nodule, args)
      })
    }
  })
}
