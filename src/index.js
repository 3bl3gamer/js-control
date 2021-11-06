/** @typedef {[EventTarget, string, (e:any) => void]} Evt */

/**
 * @param {{
 *   startElem: Element,
 *   moveElem?: EventTarget|null,
 *   offsetElem?: Element|null|'no-offset',
 *   leaveElem?: EventTarget|null,
 *   callbacks: {
 *     singleDown?: (e:MouseEvent|TouchEvent, id:'mouse'|number, x:number, y:number) => boolean|void,
 *     singleMove?: (e:MouseEvent|TouchEvent, id:'mouse'|number, x:number, y:number) => void|boolean,
 *     singleUp?: (e:MouseEvent|TouchEvent, id:'mouse'|number) => void|boolean,
 *     singleHover?: (e:MouseEvent, x:number, y:number) => void|boolean,
 *     singleLeave?: (e:MouseEvent, x:number, y:number) => void|boolean,
 *     wheelRot?: (e:WheelEvent, deltaX:number, deltaY:number, deltaZ:number, x:number, y:number) => void|boolean,
 *   },
 * }} params
 */
export function controlSingle(params) {
	const { startElem, callbacks } = params
	const moveElem = params.moveElem ?? window
	const offsetElem = params.offsetElem ?? startElem
	const leaveElem = params.leaveElem ?? startElem

	const { singleDown = noop, singleMove = noop, singleUp = noop } = callbacks
	const { singleHover = noop, singleLeave = noop, wheelRot = noop } = callbacks

	let touchId = /** @type {number|null} */ (null)

	const wrap = makeOffsetWrapper(offsetElem)

	const mousedown = wrap(function mousedown(/** @type {MouseEvent} */ e, dx, dy) {
		if (e.button !== 0) return false
		addListener(mouseMoveEvt)
		addListener(mouseUpEvt)
		removeListener(mouseHoverEvt)
		return singleDown(e, 'mouse', e.clientX + dx, e.clientY + dy)
	})

	const mousemove = wrap(function mousemove(/** @type {MouseEvent} */ e, dx, dy) {
		return singleMove(e, 'mouse', e.clientX + dx, e.clientY + dy)
	})

	const mouseup = wrap(function mouseup(/** @type {MouseEvent} */ e, dx, dy) {
		if (e.button !== 0) return false
		removeListener(mouseMoveEvt)
		removeListener(mouseUpEvt)
		addListener(mouseHoverEvt)
		return singleUp(e, 'mouse')
	})

	const mousemoveHover = wrap(function mousemoveHover(/** @type {MouseEvent} */ e, dx, dy) {
		return singleHover(e, e.clientX + dx, e.clientY + dy)
	})

	const mouseleave = wrap(function mouseleave(/** @type {MouseEvent} */ e, dx, dy) {
		return singleLeave(e, e.clientX + dx, e.clientY + dy)
	})

	const touchstart = wrap(function touchstart(/** @type {TouchEvent} */ e, dx, dy) {
		if (touchId !== null) return false

		addListener(touchMoveEvt)
		addListener(touchEndEvt)
		addListener(touchCancelEvt)

		const t = e.changedTouches[0]
		touchId = t.identifier
		return singleDown(e, touchId, t.clientX + dx, t.clientY + dy)
	})

	const touchmove = wrap(function touchmove(/** @type {TouchEvent} */ e, dx, dy) {
		if (touchId === null) return false
		const touch = findTouch(e.changedTouches, touchId)
		if (touch === null) return false
		return singleMove(e, touchId, touch.clientX + dx, touch.clientY + dy)
	})

	const touchend = wrap(function touchend(/** @type {TouchEvent} */ e, dx, dy) {
		if (touchId === null) return false

		const releasedTouch = findTouch(e.changedTouches, touchId)
		if (releasedTouch === null) return false

		touchId = null

		removeListener(touchMoveEvt)
		removeListener(touchEndEvt)
		removeListener(touchCancelEvt)

		return singleUp(e, releasedTouch.identifier)
	})

	const touchcancel = wrap(function touchcancel(/** @type {TouchEvent} */ e, dx, dy) {
		touchend(e)
	})

	const mousewheel = makeWheelListener(wrap, wheelRot)

	const mouseDownEvt = /** @type {Evt} */ ([startElem, 'mousedown', mousedown])
	const mouseMoveEvt = /** @type {Evt} */ ([moveElem, 'mousemove', mousemove])
	const mouseUpEvt = /** @type {Evt} */ ([moveElem, 'mouseup', mouseup])
	const wheelEvt = /** @type {Evt} */ ([startElem, 'wheel', mousewheel])
	const mouseHoverEvt = /** @type {Evt} */ ([startElem, 'mousemove', mousemoveHover])
	const mouseLeaveEvt = /** @type {Evt} */ ([leaveElem, 'mouseleave', mouseleave])
	const touchStartEvt = /** @type {Evt} */ ([startElem, 'touchstart', touchstart])
	const touchMoveEvt = /** @type {Evt} */ ([moveElem, 'touchmove', touchmove])
	const touchEndEvt = /** @type {Evt} */ ([moveElem, 'touchend', touchend])
	const touchCancelEvt = /** @type {Evt} */ ([moveElem, 'touchcancel', touchcancel])
	// prettier-ignore
	const events = [
		mouseDownEvt, mouseMoveEvt, mouseUpEvt, mouseHoverEvt, mouseLeaveEvt, wheelEvt,
		touchStartEvt, touchMoveEvt, touchEndEvt, touchCancelEvt,
	]
	const autoOnEvents = [mouseDownEvt, touchStartEvt, mouseHoverEvt, mouseLeaveEvt, wheelEvt]

	return makeEventsToggler(events, autoOnEvents)
}

/**
 * @param {{
 *   startElem: Element,
 *   offsetElem?: Element|null|'no-offset',
 *   wheelRot: (e:WheelEvent, deltaX:number, deltaY:number, deltaZ:number, x:number, y:number) => void|boolean,
 * }} params
 */
export function controlWheel(params) {
	const { startElem, wheelRot } = params
	const offsetElem = params.offsetElem ?? startElem

	const wrap = makeOffsetWrapper(offsetElem)
	const mousewheel = makeWheelListener(wrap, wheelRot)
	const wheelEvt = /** @type {Evt} */ ([startElem, 'wheel', mousewheel])

	return makeEventsToggler([], [wheelEvt])
}

/**
 * @param {{
 *   startElem: Element,
 *   moveElem?: EventTarget|null,
 *   offsetElem?: Element|null,
 *   leaveElem?: EventTarget|null,
 *   callbacks: {
 *     singleDown?: (e:MouseEvent|TouchEvent, id:'mouse'|number, x:number, y:number, isSwitching:boolean) => boolean|void,
 *     singleMove?: (e:MouseEvent|TouchEvent, id:'mouse'|number, x:number, y:number) => void|boolean,
 *     singleUp?: (e:MouseEvent|TouchEvent, id:'mouse'|number, isSwitching:boolean) => void|boolean,
 *     singleHover?: (e:MouseEvent, x:number, y:number) => void|boolean,
 *     singleLeave?: (e:MouseEvent, x:number, y:number) => void|boolean,
 *     doubleDown?: (e:TouchEvent, id0:number, x0:number, y0:number, id1:number, x1:number, y1:number) => void|boolean,
 *     doubleMove?: (e:TouchEvent, id0:number, x0:number, y0:number, id1:number, x1:number, y1:number) => void|boolean,
 *     doubleUp?: (e:TouchEvent, id0:number, id1:number) => void|boolean,
 *     wheelRot?: (e:WheelEvent, deltaX:number, deltaY:number, deltaZ:number, x:number, y:number) => void|boolean,
 *   },
 * }} params
 */
export function controlDouble(params) {
	const { startElem, callbacks } = params
	const moveElem = params.moveElem ?? window
	const offsetElem = params.offsetElem ?? startElem
	const leaveElem = params.leaveElem ?? startElem

	const { singleDown = noop, singleMove = noop, singleUp = noop } = callbacks
	const { doubleDown = noop, doubleMove = noop, doubleUp = noop } = callbacks
	const { singleHover = noop, singleLeave = noop, wheelRot = noop } = callbacks

	const touchIds = /** @type {number[]} */ ([])

	const wrap = makeOffsetWrapper(offsetElem)

	const mousedown = wrap(function mousedown(/** @type {MouseEvent} */ e, dx, dy) {
		if (e.button !== 0) return false
		addListener(mouseMoveEvt)
		addListener(mouseUpEvt)
		removeListener(mouseHoverEvt)
		return singleDown(e, 'mouse', e.clientX + dx, e.clientY + dy, false)
	})

	const mousemove = wrap(function mousemove(/** @type {MouseEvent} */ e, dx, dy) {
		return singleMove(e, 'mouse', e.clientX + dx, e.clientY + dy)
	})

	const mouseup = wrap(function mouseup(/** @type {MouseEvent} */ e, dx, dy) {
		if (e.button !== 0) return false
		removeListener(mouseMoveEvt)
		removeListener(mouseUpEvt)
		addListener(mouseHoverEvt)
		return singleUp(e, 'mouse', false)
	})

	const mousemoveHover = wrap(function mousemoveHover(/** @type {MouseEvent} */ e, dx, dy) {
		return singleHover(e, e.clientX + dx, e.clientY + dy)
	})

	const mouseleave = wrap(function mouseleave(/** @type {MouseEvent} */ e, dx, dy) {
		return singleLeave(e, e.clientX + dx, e.clientY + dy)
	})

	const touchstart = wrap(function touchstart(/** @type {TouchEvent} */ e, dx, dy) {
		const curCount = touchIds.length
		if (curCount === 2) return false
		const changedTouches = e.changedTouches

		if (curCount === 0) {
			addListener(touchMoveEvt)
			addListener(touchEndEvt)
			addListener(touchCancelEvt)
		}

		if (curCount === 0 && changedTouches.length === 1) {
			const t = e.changedTouches[0]
			touchIds.push(t.identifier)
			return singleDown(e, touchIds[0], t.clientX + dx, t.clientY + dy, false)
		}

		let t0, t1
		let prevent = /**@type {void|boolean}*/ (false)
		if (curCount === 0) {
			// and changedTouches.length >= 2
			t0 = changedTouches[0]
			t1 = changedTouches[1]
			touchIds.push(t0.identifier)
			prevent = singleDown(e, t0.identifier, t0.clientX + dx, t0.clientY + dy, false)
		} else {
			// curCount === 1 and changedTouches.length >= 1
			t0 = mustFindTouch(e.touches, touchIds[0])
			t1 = e.changedTouches[0]
		}
		touchIds.push(t1.identifier)
		const prevetUp = singleUp(e, t0.identifier, true)
		prevent = prevent || prevetUp

		const x0 = t0.clientX + dx
		const y0 = t0.clientY + dy
		const x1 = t1.clientX + dx
		const y1 = t1.clientY + dy
		const preventDouble = doubleDown(e, touchIds[0], x0, y0, touchIds[1], x1, y1)
		return prevent || preventDouble
	})

	const touchmove = wrap(function touchmove(/** @type {TouchEvent} */ e, dx, dy) {
		const curCount = touchIds.length
		if (curCount === 1) {
			const t0 = findTouch(e.changedTouches, touchIds[0])
			if (t0 === null) return false
			return singleMove(e, touchIds[0], t0.clientX + dx, t0.clientY + dy)
		}
		if (curCount === 2) {
			// can not use e.changedTouches: one of touches may have not changed
			const t0 = mustFindTouch(e.touches, touchIds[0])
			const t1 = mustFindTouch(e.touches, touchIds[1])
			const x0 = t0.clientX + dx
			const y0 = t0.clientY + dy
			const x1 = t1.clientX + dx
			const y1 = t1.clientY + dy
			return doubleMove(e, touchIds[0], x0, y0, touchIds[1], x1, y1)
		}
	})

	const releasedTouches = /** @type {Touch[]} */ ([])
	const touchend = wrap(function touchend(/** @type {TouchEvent} */ e, dx, dy) {
		const curCount = touchIds.length
		if (curCount === 0) return false

		const tid0 = touchIds[0]
		const tid1 = touchIds[1]

		releasedTouches.length = 0
		for (let j = touchIds.length - 1; j >= 0; j--) {
			for (let i = 0; i < e.changedTouches.length; i++) {
				const t = e.changedTouches[i]
				if (t.identifier === touchIds[j]) {
					touchIds.splice(j, 1)
					releasedTouches.push(t)
				}
			}
		}
		if (releasedTouches.length === 0) return false

		if (curCount === releasedTouches.length) {
			removeListener(touchMoveEvt)
			removeListener(touchEndEvt)
			removeListener(touchCancelEvt)
		}

		if (curCount === 1 && releasedTouches.length === 1) {
			return singleUp(e, releasedTouches[0].identifier, false)
		}

		const tLast = mustFindTouch(e.touches, releasedTouches[0].identifier === tid0 ? tid1 : tid0)

		const preventUp2 = doubleUp(e, tid0, tid1)
		const preventDown1 = singleDown(e, tLast.identifier, tLast.clientX + dx, tLast.clientY + dy, true)
		let preventUp1 = /**@type {void|boolean}*/ (false)
		if (curCount === 2 && releasedTouches.length === 2) {
			preventUp1 = singleUp(e, tLast.identifier, false)
		}
		return preventUp2 || preventDown1 || preventUp1
	})

	const touchcancel = wrap(function touchcancel(/** @type {TouchEvent} */ e, dx, dy) {
		touchend(e)
	})

	const mousewheel = makeWheelListener(wrap, wheelRot)

	const mouseDownEvt = /** @type {Evt} */ ([startElem, 'mousedown', mousedown])
	const mouseMoveEvt = /** @type {Evt} */ ([moveElem, 'mousemove', mousemove])
	const mouseUpEvt = /** @type {Evt} */ ([moveElem, 'mouseup', mouseup])
	const wheelEvt = /** @type {Evt} */ ([startElem, 'wheel', mousewheel])
	const mouseHoverEvt = /** @type {Evt} */ ([startElem, 'mousemove', mousemoveHover])
	const mouseLeaveEvt = /** @type {Evt} */ ([leaveElem, 'mouseleave', mouseleave])
	const touchStartEvt = /** @type {Evt} */ ([startElem, 'touchstart', touchstart])
	const touchMoveEvt = /** @type {Evt} */ ([moveElem, 'touchmove', touchmove])
	const touchEndEvt = /** @type {Evt} */ ([moveElem, 'touchend', touchend])
	const touchCancelEvt = /** @type {Evt} */ ([moveElem, 'touchcancel', touchcancel])
	// prettier-ignore
	const events = [
		mouseDownEvt, mouseMoveEvt, mouseUpEvt, mouseHoverEvt, mouseLeaveEvt, wheelEvt,
		touchStartEvt, touchMoveEvt, touchEndEvt, touchCancelEvt,
	]
	const autoOnEvents = [mouseDownEvt, touchStartEvt, mouseHoverEvt, mouseLeaveEvt, wheelEvt]

	return makeEventsToggler(events, autoOnEvents)
}

function noop() {}

/**
 * @param {Element|'no-offset'} offsetElem
 */
function makeOffsetWrapper(offsetElem) {
	/**
	 * @template {Event} T
	 * @param {(e:T, x:number, y:number) => boolean|void} func
	 * @returns {(e:T) => void}
	 */
	function wrap(func) {
		return e => {
			let dx = 0
			let dy = 0
			if (offsetElem !== 'no-offset') {
				;({ left: dx, top: dy } = offsetElem.getBoundingClientRect())
			}
			func(e, -dx, -dy) && e.preventDefault()
		}
	}
	return wrap
}

/**
 * @param {(func: (e:WheelEvent, x:number, y:number) => boolean|void) => ((e:WheelEvent) => void)} wrap
 * @param {(e:WheelEvent, deltaX:number, deltaY:number, deltaZ:number, x:number, y:number) => void|boolean} wheelRot
 */
function makeWheelListener(wrap, wheelRot) {
	const deltaMode2pixels = []
	deltaMode2pixels[WheelEvent.DOM_DELTA_PIXEL] = 1
	deltaMode2pixels[WheelEvent.DOM_DELTA_LINE] = 20
	deltaMode2pixels[WheelEvent.DOM_DELTA_PAGE] = 50 // а это вообще как?
	return wrap(function mousewheel(/** @type {WheelEvent} */ e, dx, dy) {
		const k = deltaMode2pixels[e.deltaMode]
		return wheelRot(e, e.deltaX * k, e.deltaY * k, e.deltaZ * k, e.clientX + dx, e.clientY + dy)
	})
}

/**
 * @param {Evt[]} allEents
 * @param {Evt[]} autoOnEvents
 */
function makeEventsToggler(allEents, autoOnEvents) {
	let isOn = false
	/** @param {boolean|null|undefined} on */
	function toggle(on) {
		on = on ?? !isOn
		if (isOn === on) return
		if (on) autoOnEvents.map(addListener)
		else allEents.map(removeListener)
		isOn = on
	}

	toggle(true)
	return {
		toggle,
		get isOn() {
			return isOn
		},
		on() {
			toggle(true)
		},
		off() {
			toggle(false)
		},
	}
}

/**
 * @param {TouchList} list
 * @param {number} id
 */
function findTouch(list, id) {
	for (let i = 0; i < list.length; i++) if (list[i].identifier === id) return list[i]
	return null
}
/**
 * @param {TouchList} list
 * @param {number} id
 */
function mustFindTouch(list, id) {
	const touch = findTouch(list, id)
	if (touch === null) throw new Error(`touch #${id} not found`)
	return touch
}

/** @param {Evt} event */
function addListener(event) {
	event[0].addEventListener(event[1], event[2], { capture: true, passive: false })
}

/** @param {Evt} event */
function removeListener(event) {
	event[0].removeEventListener(event[1], event[2], { capture: true })
}
