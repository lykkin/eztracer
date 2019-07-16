'use strict'

const tap = require('tap')
const ExclusiveTimeCalculator = require('../../lib/tracer/trace/exclusive-time-calculator')
const Segment = require('../../lib/tracer/trace/segment')
const Trace = require('../../lib/tracer/trace')
const trace = new Trace('test trace')
const now = Date.now()

function calc(root) {
  const calculator = new ExclusiveTimeCalculator(root)
  calculator.process()
}

tap.test('ExclusiveTimeCalculator', (t) => {
  t.autoend()
  /**
   * [0, 100] - 50
   *    |
   * [0 , 25] - 25
   *    |
   * [50, 75] - 25
   */
  t.test('should calculate properly for grandchildren', (t) => {
    const root = new Segment('root', trace)
    root.setDurationInMillis(100, now)
    const child = root.addChild('child')
    child.setDurationInMillis(25, now)
    const grandchild = child.addChild('grandchild')
    grandchild.setDurationInMillis(25, now + 50)
    calc(root)
    t.equal(root._exclusiveDuration, 50, 'should have the expected exclusive duration')
    t.equal(child._exclusiveDuration, 25, 'should have the expected exclusive duration')
    t.equal(grandchild._exclusiveDuration, 25, 'should have the expected exclusive duration')
    t.end()
  })
  /**
   *          [0, 100] - 50
   *         /        \
   * [0 , 25] - 25     [50, 75] - 25
   */
  t.test('should calculate properly for grandchildren', (t) => {
    const root = new Segment('root', trace)
    root.setDurationInMillis(100, now)
    const child = root.addChild('child')
    child.setDurationInMillis(25, now)
    const child2 = root.addChild('child2')
    child2.setDurationInMillis(25, now + 50)
    calc(root)
    t.equal(root._exclusiveDuration, 50, 'should have the expected exclusive duration')
    t.equal(child._exclusiveDuration, 25, 'should have the expected exclusive duration')
    t.equal(child2._exclusiveDuration, 25, 'should have the expected exclusive duration')
    t.end()
  })
  /**
   * [0, 100] - 75
   *    |
   * [0, 25] - 0
   *    |
   * [0, 25] - 25
   */
  t.test('should calculate properly for grandchildren', (t) => {
    const root = new Segment('root', trace)
    root.setDurationInMillis(100, now)
    const child = root.addChild('child')
    child.setDurationInMillis(25, now)
    const grandchild = child.addChild('grandchild')
    grandchild.setDurationInMillis(25, now)
    calc(root)
    t.equal(root._exclusiveDuration, 75, 'should have the expected exclusive duration')
    t.equal(child._exclusiveDuration, 0, 'should have the expected exclusive duration')
    t.equal(grandchild._exclusiveDuration, 25, 'should have the expected exclusive duration')
    t.end()
  })
  /**
   * [0, 100] - 0
   *    |
   * [0, 25] - 0
   *    |
   * [0, 250] - 250
   */
  t.test('should calculate properly for grandchildren', (t) => {
    const root = new Segment('root', trace)
    root.setDurationInMillis(100, now)
    const child = root.addChild('child')
    child.setDurationInMillis(25, now)
    const grandchild = child.addChild('grandchild')
    grandchild.setDurationInMillis(250, now)
    calc(root)
    t.equal(root._exclusiveDuration, 0, 'should have the expected exclusive duration')
    t.equal(child._exclusiveDuration, 0, 'should have the expected exclusive duration')
    t.equal(grandchild._exclusiveDuration, 250, 'should have the expected exclusive duration')
    t.end()
  })

 /**
   *         [0, 100] - 30
   *            |
   *         [0, 25] - 0
   *        /       \
   * [0, 20] - 20    [20, 70] - 50
   */
  t.test('should calculate properly for multiple grandchildren', (t) => {
    const root = new Segment('root', trace)
    root.setDurationInMillis(100, now)
    const child = root.addChild('child')
    child.setDurationInMillis(25, now)
    const grandchild = child.addChild('grandchild')
    grandchild.setDurationInMillis(20, now)
    const grandchild2 = child.addChild('grandchild2')
    grandchild2.setDurationInMillis(50, now + 20)
    calc(root)
    t.equal(root._exclusiveDuration, 30, 'should have the expected exclusive duration')
    t.equal(child._exclusiveDuration, 0, 'should have the expected exclusive duration')
    t.equal(grandchild._exclusiveDuration, 20, 'should have the expected exclusive duration')
    t.equal(grandchild2._exclusiveDuration, 50, 'should have the expected exclusive duration')
    t.end()
  })

  /**
   *          [0, 100] - 0
   *             |
   *          [0, 25] - 0
   *         /        \
   * [0, 250] - 250    [1, 251] - 250
   */
  t.test('should calculate properly for grandchildren', (t) => {
    const root = new Segment('root', trace)
    root.setDurationInMillis(100, now)
    const child = root.addChild('child')
    child.setDurationInMillis(25, now)
    const grandchild = child.addChild('grandchild')
    grandchild.setDurationInMillis(250, now)
    const grandchild2 = child.addChild('grandchild2')
    grandchild2.setDurationInMillis(250, now + 1)
    calc(root)
    t.equal(root._exclusiveDuration, 0, 'should have the expected exclusive duration')
    t.equal(child._exclusiveDuration, 0, 'should have the expected exclusive duration')
    t.equal(grandchild._exclusiveDuration, 250, 'should have the expected exclusive duration')
    t.equal(grandchild2._exclusiveDuration, 250, 'should have the expected exclusive duration')
    t.end()
  })
  
})
