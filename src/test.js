import { assert as test } from 'chai'
import sinon from 'sinon'
import { JSDOM } from 'jsdom'
import { controlSingle } from './index.js'

beforeEach(() => {
	const dom = new JSDOM(
		'<!DOCTYPE html><html><head></head><body> <div class="startElem"></div> </body></html>',
	)
	global.window = /** @type {*} */ (dom.window)
	global.document = dom.window.document
	global.WheelEvent = dom.window.WheelEvent
})

describe('2+2', () => {
	it('should = 4', () => {
		test.strictEqual(2 + 2, 4)
	})
})

function fakeTouch(id, target, clientX, clientY) {
	return /** @type {Touch} */ ({
		identifier: id,
		target,
		clientX,
		clientY,
	})
}

describe('controlSingle', () => {
	describe('simple', () => {
		let c
		/** @type {Required<{[K in keyof Parameters<typeof controlSingle>[0]['callbacks']]: import('sinon').SinonSpy}>} */
		let callbacks
		let startElem
		beforeEach(() => {
			callbacks = {
				singleDown: sinon.spy(),
				singleMove: sinon.spy(),
				singleUp: sinon.spy(),
				singleHover: sinon.spy(),
				singleLeave: sinon.spy(),
				wheelRot: sinon.spy(),
			}
			startElem = document.body.getElementsByClassName('startElem')[0]
			startElem.getBoundingClientRect = () => /**@type {*}*/ ({ left: -1000, top: -2000 })
			c = controlSingle({ startElem, callbacks })
		})
		/**
		 * @param {Element} elem
		 * @param {string} name
		 * @param {MouseEventInit} params
		 */
		function dispatchMouse(elem, name, params) {
			const event = new window.MouseEvent(name, params)
			elem.dispatchEvent(event)
			return event
		}
		/**
		 * @param {Element} elem
		 * @param {string} name
		 * @param {TouchEventInit} params
		 */
		function dispatchTouch(elem, name, params) {
			const event = new window.TouchEvent(name, params)
			elem.dispatchEvent(event)
			return event
		}
		function testArgs(args, destEvent, destId, destX, destY) {
			const [e, id, x, y] = args
			test.strictEqual(e, destEvent)
			test.strictEqual(id, destId)
			test.strictEqual(x, destX)
			test.strictEqual(y, destY)
		}
		describe('mouse interaction', () => {
			describe('down', () => {
				it('should handle mouse down', () => {
					const event = dispatchMouse(startElem, 'mousedown', { clientX: 12, clientY: 23 })
					test.strictEqual(callbacks.singleDown.callCount, 1)
					testArgs(callbacks.singleDown.args[0], event, 'mouse', 1012, 2023)
				})
			})
			describe('move', () => {
				it('should ignore mouse move unless down', () => {
					dispatchMouse(startElem, 'mousemove', {})
					test.strictEqual(callbacks.singleMove.callCount, 0)
				})
				it('should handle mouse move if down', () => {
					dispatchMouse(startElem, 'mousedown', {})
					const event = dispatchMouse(startElem, 'mousemove', { clientX: 1, clientY: 2 })
					test.strictEqual(callbacks.singleMove.callCount, 1)
					testArgs(callbacks.singleMove.args[0], event, 'mouse', 1001, 2002)
				})
			})
			describe('up', () => {
				it('should ignore mouse up unless down', () => {
					dispatchMouse(startElem, 'mouseup', {})
					test.strictEqual(callbacks.singleUp.callCount, 0)
				})
				it('should handle mouse up if down', () => {
					dispatchMouse(startElem, 'mousedown', {})
					const event = dispatchMouse(startElem, 'mouseup', {})
					test.strictEqual(callbacks.singleUp.callCount, 1)
					testArgs(callbacks.singleUp.args[0], event, 'mouse')
				})
			})
		})
		describe('mouse hover', () => {
			it('should call hover unless down', () => {
				const event = dispatchMouse(startElem, 'mousemove', { clientX: 12, clientY: 23 })
				test.strictEqual(callbacks.singleHover.callCount, 1)
				testArgs(callbacks.singleHover.args[0], event, 1012, 2023)
			})
			it('should notcall hover if down', () => {
				dispatchMouse(startElem, 'mousedown', {})
				dispatchMouse(startElem, 'mousemove', { clientX: 123, clientY: 234 })
				test.strictEqual(callbacks.singleHover.callCount, 0)
			})
		})
		describe('mouse leave', () => {
			it('should call on leave', () => {
				const event = dispatchMouse(startElem, 'mouseleave', { clientX: 12, clientY: 23 })
				test.strictEqual(callbacks.singleLeave.callCount, 1)
				testArgs(callbacks.singleLeave.args[0], event, 1012, 2023)
			})
		})
		describe('touch interaction', () => {
			describe('start', () => {
				it('should handle touch down', () => {
					const event = dispatchTouch(startElem, 'touchstart', {
						changedTouches: [fakeTouch(123, startElem, 12, 23)],
					})
					test.strictEqual(callbacks.singleDown.callCount, 1)
					testArgs(callbacks.singleDown.args[0], event, 123, 1012, 2023)
				})
				it('should ignore touch down if already touched', () => {
					dispatchTouch(startElem, 'touchstart', {
						changedTouches: [fakeTouch(123, startElem, 12, 23)],
					})
					test.strictEqual(callbacks.singleDown.callCount, 1)
					dispatchTouch(startElem, 'touchstart', {
						changedTouches: [fakeTouch(124, startElem, 12, 23)],
					})
					test.strictEqual(callbacks.singleDown.callCount, 1)
				})
			})
			describe('move', () => {
				it('should ignore touch move unless started', () => {
					dispatchTouch(startElem, 'touchmove', {
						changedTouches: [fakeTouch(123, startElem, 12, 23)],
					})
					test.strictEqual(callbacks.singleMove.callCount, 0)
				})
				it('should ignore touch move unless same id', () => {
					dispatchTouch(startElem, 'touchstart', {
						changedTouches: [fakeTouch(123, startElem, 12, 23)],
					})
					dispatchTouch(startElem, 'touchmove', {
						changedTouches: [fakeTouch(124, startElem, 12, 23)],
					})
					test.strictEqual(callbacks.singleMove.callCount, 0)
				})
				it('should handle touch move if started', () => {
					dispatchTouch(startElem, 'touchstart', {
						changedTouches: [fakeTouch(123, startElem, 12, 23)],
					})
					const event = dispatchTouch(startElem, 'touchmove', {
						changedTouches: [fakeTouch(123, startElem, 12, 23)],
					})
					test.strictEqual(callbacks.singleMove.callCount, 1)
					testArgs(callbacks.singleMove.args[0], event, 123, 1012, 2023)
				})
			})
			for (const eventName of ['touchend', 'touchcancel']) {
				const label = eventName.slice(5)
				describe(label, () => {
					it(`should ignore touch ${label} unless started`, () => {
						dispatchTouch(startElem, eventName, {
							changedTouches: [fakeTouch(123, startElem, 12, 23)],
						})
						test.strictEqual(callbacks.singleMove.callCount, 0)
					})
					it(`should ignore touch ${label} unless same id`, () => {
						dispatchTouch(startElem, 'touchstart', {
							changedTouches: [fakeTouch(123, startElem, 12, 23)],
						})
						dispatchTouch(startElem, eventName, {
							changedTouches: [fakeTouch(124, startElem, 12, 23)],
						})
						test.strictEqual(callbacks.singleMove.callCount, 0)
					})
					it(`should handle touch ${label} if started`, () => {
						dispatchTouch(startElem, 'touchstart', {
							changedTouches: [fakeTouch(123, startElem, 12, 23)],
						})
						const event = dispatchTouch(startElem, eventName, {
							changedTouches: [fakeTouch(123, startElem, 12, 23)],
						})
						test.strictEqual(callbacks.singleMove.callCount, 0)
						testArgs(callbacks.singleUp.args[0], event, 123)
					})
				})
			}
		})
		describe('mouse wheel', () => {
			it('should call whell', () => {
				const params = { deltaX: 1, deltaY: 2, deltaZ: 3, clientX: 12, clientY: 23 }
				const event = new window.WheelEvent('wheel', params)
				startElem.dispatchEvent(event)
				test.strictEqual(callbacks.wheelRot.callCount, 1)
				const [e, dx, dy, dz, x, y] = callbacks.wheelRot.args[0]
				test.strictEqual(e, event)
				test.strictEqual(dx, 1)
				test.strictEqual(dy, 2)
				test.strictEqual(dz, 3)
				test.strictEqual(x, 1012)
				test.strictEqual(y, 2023)
			})
		})
		describe('toggle', () => {
			it('should detach listeners', () => {
				c.off()
				dispatchMouse(startElem, 'mousedown', {})
				dispatchTouch(startElem, 'touchstart', {})
				startElem.dispatchEvent(new window.WheelEvent('wheel'))
				test.strictEqual(callbacks.singleDown.callCount, 0)
				test.strictEqual(callbacks.wheelRot.callCount, 0)
			})
			it('should reattach listeners', () => {
				c.off()
				c.on()
				dispatchMouse(startElem, 'mousedown', {})
				dispatchMouse(startElem, 'mouseup', {})
				dispatchTouch(startElem, 'touchstart', {
					changedTouches: [fakeTouch(123, startElem, 12, 23)],
				})
				startElem.dispatchEvent(new window.WheelEvent('wheel'))
				test.strictEqual(callbacks.singleDown.callCount, 2)
				test.strictEqual(callbacks.wheelRot.callCount, 1)
			})
		})
	})
})
