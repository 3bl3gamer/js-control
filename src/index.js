/** @typedef {[EventTarget, string, (e:any) => void]} Evt */
/** @typedef {[allEents:Evt[], autoOnEvents:Evt[]]} EvtGroup */

/**
 * @typedef {{
 *   singleDown: (e:PointerEvent, x:number, y:number) => boolean|void,
 *   singleMove: (e:PointerEvent, x:number, y:number) => void|boolean,
 *   singleUp: (e:PointerEvent) => void|boolean,
 * }} SingleMoveCallbacks
 */

/**
 * @typedef {{
 *   singleHover: (e:PointerEvent, x:number, y:number) => void|boolean,
 *   singleLeave: (e:PointerEvent, x:number, y:number) => void|boolean,
 * }} SingleHoverCallbacks
 */

/**
 * @typedef {{
 *   singleDown: (e:PointerEvent, x:number, y:number, isSwitching:boolean) => boolean|void,
 *   singleMove: (e:PointerEvent, x:number, y:number) => void|boolean,
 *   singleUp:   (e:PointerEvent, isSwitching:boolean) => void|boolean,
 *   doubleDown: (e:PointerEvent, e0:PointerEvent, e1:PointerEvent, x0:number, y0:number, x1:number, y1:number) => void|boolean,
 *   doubleMove: (e:PointerEvent, e0:PointerEvent, e1:PointerEvent, x0:number, y0:number, x1:number, y1:number) => void|boolean,
 *   doubleUp:   (e:PointerEvent, e0:PointerEvent, e1:PointerEvent) => void|boolean,
 * }} DoubleMoveCallbacks
 */

/**
 * @typedef {{
 *   wheelRot: (e:WheelEvent, deltaX:number, deltaY:number, deltaZ:number, x:number, y:number) => void|boolean,
 * }} WheelCallbacks
 */

/**
 * @typedef {{
 *   startElem: Element,
 *   moveElem?: EventTarget|null,
 *   offsetElem?: Element|null|'no-offset',
 * }} MoveElemsCfg
 */

/**
 * @typedef {{
 *   startElem: Element,
 *   offsetElem?: Element|null|'no-offset',
 * }} WheelElemsCfg
 */

/**
 * @typedef {{down?():unknown, up?():unknown}} Context
 */

/**
 * @param {SingleMoveCallbacks} callbacks
 * @param {Context} [context]
 */
export function controlSingle(callbacks, context) {
	const { singleDown, singleMove, singleUp } = callbacks

	/** @type {Element} */
	let startElem
	/** @type {EventTarget} */
	let moveElem
	/** @type {Element|null} */
	let offsetElem

	/** @type {Evt} */
	let pointerDownEvt
	/** @type {Evt} */
	let pointerMoveEvt
	/** @type {Evt} */
	let pointerUpEvt
	/** @type {Evt} */
	let pointerCancelEvt

	let pointerId = /** @type {number|null} */ (null)

	const wrap = makeOffsetWrapper(() => offsetElem)

	const pointerdown = wrap(function pointerdown(/** @type {PointerEvent} */ e, dx, dy) {
		if (pointerId !== null) return false
		if (e.pointerType === 'mouse' && e.button !== 0) return false
		pointerId = e.pointerId
		addListener(pointerMoveEvt)
		addListener(pointerUpEvt)
		addListener(pointerCancelEvt)
		context?.down?.() //TODO: removeListener(mouseHoverEvt)
		return singleDown(e, e.clientX + dx, e.clientY + dy)
	})

	const pointermove = wrap(function pointermove(/** @type {PointerEvent} */ e, dx, dy) {
		if (e.pointerId !== pointerId) return false
		return singleMove(e, e.clientX + dx, e.clientY + dy)
	})

	const pointerup = wrap(function pointerup(/** @type {PointerEvent} */ e, dx, dy) {
		if (e.pointerId !== pointerId) return false
		if (e.pointerType === 'mouse' && e.button !== 0) return false

		removeListener(pointerMoveEvt)
		removeListener(pointerUpEvt)
		removeListener(pointerCancelEvt)
		context?.up?.() //TODO: addListener(mouseHoverEvt)

		pointerId = null
		return singleUp(e)
	})

	const pointercancel = function pointercancel(e) {
		pointerup(e)
	}

	return makeEventsToggler((/**@type {MoveElemsCfg}*/ elems) => {
		startElem = elems.startElem
		moveElem = elems.moveElem ?? window
		offsetElem = nullUnlessOffset(elems.offsetElem, startElem)

		pointerDownEvt = [startElem, 'pointerdown', pointerdown]
		pointerMoveEvt = [moveElem, 'pointermove', pointermove]
		pointerUpEvt = [moveElem, 'pointerup', pointerup]
		pointerCancelEvt = [moveElem, 'pointercancel', pointercancel]

		return [[pointerDownEvt, pointerMoveEvt, pointerUpEvt, pointerCancelEvt], [pointerDownEvt]]
	})
}

/**
 * @param {DoubleMoveCallbacks} callbacks
 * @param {Context} [context]
 */
export function controlDouble(callbacks, context) {
	const { singleDown, singleMove, singleUp, doubleDown, doubleMove, doubleUp } = callbacks

	/** @type {Element} */
	let startElem
	/** @type {EventTarget} */
	let moveElem
	/** @type {Element|null} */
	let offsetElem

	/** @type {Evt} */
	let pointerDownEvt
	/** @type {Evt} */
	let pointerMoveEvt
	/** @type {Evt} */
	let pointerUpEvt
	/** @type {Evt} */
	let pointerCancelEvt

	const lastPointerEvents = /** @type {PointerEvent[]} */ ([])

	const wrap = makeOffsetWrapper(() => offsetElem)

	const pointerdown = wrap(function pointerdown(/** @type {PointerEvent} */ e, dx, dy) {
		if (e.pointerType === 'mouse' && e.button !== 0) return false
		const curCount = lastPointerEvents.length
		if (curCount === 2) return false

		if (curCount === 0) {
			addListener(pointerMoveEvt)
			addListener(pointerUpEvt)
			addListener(pointerCancelEvt)
			context?.down?.() //TODO: removeListener(mouseHoverEvt)
		}

		const x = e.clientX + dx
		const y = e.clientY + dy

		if (curCount === 0) {
			lastPointerEvents.push(e)
			return singleDown(e, x, y, false)
		}

		// curCount === 1
		const e0 = lastPointerEvents[0]
		lastPointerEvents.push(e)
		const preventUp = singleUp(e0, true)
		const preventDouble = doubleDown(e, e0, e, e0.clientX + dx, e0.clientY + dy, x, y)
		return preventUp || preventDouble
	})

	const pointermove = wrap(function pointermove(/** @type {PointerEvent} */ e, dx, dy) {
		const curCount = lastPointerEvents.length

		const index = findPointerIndex(lastPointerEvents, e)
		if (index === -1) return false
		lastPointerEvents[index] = e

		if (curCount === 1) {
			return singleMove(e, e.clientX + dx, e.clientY + dy)
		}

		// curCount === 2
		const e0 = lastPointerEvents[0]
		const e1 = lastPointerEvents[1]

		return doubleMove(e, e0, e1, e0.clientX + dx, e0.clientY + dy, e1.clientX + dx, e1.clientY + dy)
	})

	const pointerup = wrap(function pointerup(/** @type {PointerEvent} */ e, dx, dy) {
		const curCount = lastPointerEvents.length

		const index = findPointerIndex(lastPointerEvents, e)
		if (index === -1) return false

		if (curCount === 1) {
			removeListener(pointerMoveEvt)
			removeListener(pointerUpEvt)
			removeListener(pointerCancelEvt)
			context?.up?.() //TODO: addListener(mouseHoverEvt)
		}

		if (curCount === 1) {
			lastPointerEvents.length = 0
			return singleUp(e, false)
		}

		// curCount === 2
		const e0 = lastPointerEvents[0]
		const e1 = lastPointerEvents[1]
		const eRemaining = lastPointerEvents.splice(index, 1)[0]

		const preventUp = doubleUp(e, e0, e1)
		const preventDown = singleDown(eRemaining, eRemaining.clientX + dx, eRemaining.clientY + dy, true)
		return preventUp || preventDown
	})

	const pointercancel = function pointercancel(e) {
		pointerup(e)
	}

	return makeEventsToggler((/**@type {MoveElemsCfg}*/ elems) => {
		startElem = elems.startElem
		moveElem = elems.moveElem ?? window
		offsetElem = nullUnlessOffset(elems.offsetElem, startElem)

		pointerDownEvt = [startElem, 'pointerdown', pointerdown]
		pointerMoveEvt = [moveElem, 'pointermove', pointermove]
		pointerUpEvt = [moveElem, 'pointerup', pointerup]
		pointerCancelEvt = [moveElem, 'pointercancel', pointercancel]

		return [[pointerDownEvt, pointerMoveEvt, pointerUpEvt, pointerCancelEvt], [pointerDownEvt]]
	})
}

/**
 * @param {WheelCallbacks} callbacks
 */
export function controlWheel(callbacks) {
	const wheelRot = callbacks.wheelRot

	/** @type {Element|null} */
	let offsetElem

	const wrap = makeOffsetWrapper(() => offsetElem)

	const deltaMode2pixels = []
	deltaMode2pixels[WheelEvent.DOM_DELTA_PIXEL] = 1
	deltaMode2pixels[WheelEvent.DOM_DELTA_LINE] = 20
	deltaMode2pixels[WheelEvent.DOM_DELTA_PAGE] = 50 // а это вообще как?

	const mousewheel = wrap(function mousewheel(/** @type {WheelEvent} */ e, dx, dy) {
		const k = deltaMode2pixels[e.deltaMode]
		return wheelRot(e, e.deltaX * k, e.deltaY * k, e.deltaZ * k, e.clientX + dx, e.clientY + dy)
	})

	return makeEventsToggler((/**@type {MoveElemsCfg}*/ elems) => {
		const startElem = elems.startElem
		offsetElem = nullUnlessOffset(elems.offsetElem, startElem)

		const wheelEvt = /** @type {Evt} */ ([startElem, 'wheel', mousewheel])

		return [[wheelEvt], [wheelEvt]]
	})
}

/**
 * @param {() => Element|null|undefined} getOffsetElem
 */
function makeOffsetWrapper(getOffsetElem) {
	/**
	 * @template {Event} T
	 * @param {(e:T, x:number, y:number) => boolean|void} func
	 * @returns {(e:T) => void}
	 */
	function wrap(func) {
		return e => {
			let dx = 0
			let dy = 0
			const elem = getOffsetElem()
			if (elem) ({ left: dx, top: dy } = elem.getBoundingClientRect())
			func(e, -dx, -dy) && e.preventDefault()
		}
	}
	return wrap
}

/**
 * @param {Element|null|undefined|'no-offset'} elem
 * @param {Element} defaultElem
 */
function nullUnlessOffset(elem, defaultElem) {
	if (elem === 'no-offset') return null
	return elem ?? defaultElem
}

/**
 * @param {PointerEvent[]} events
 * @param {PointerEvent} event
 */
function findPointerIndex(events, event) {
	for (let i = 0; i < events.length; i++) if (events[i].pointerId === event.pointerId) return i
	return -1
}

/** @param {Evt} event */
function addListener(event) {
	event[0].addEventListener(event[1], event[2], { capture: true, passive: false })
}

/** @param {Evt} event */
function removeListener(event) {
	event[0].removeEventListener(event[1], event[2], { capture: true })
}

/**
 * @template TElemsCfg
 * @param {(elems: TElemsCfg) => EvtGroup} getEvents
 */
function makeEventsToggler(getEvents) {
	let events = /**@type {(EvtGroup|null)}*/ (null)

	/**
	 * @param {TElemsCfg} elems
	 * @param {boolean|null|undefined} [on]
	 */
	function toggle(elems, on) {
		const isOn = !!events
		on = on ?? !isOn
		if (isOn === on) return
		if (events) {
			const allEents = events[0]
			allEents.map(removeListener)
			events = null
		} else {
			events = getEvents(elems)
			const autoOnEvents = events[1]
			autoOnEvents.map(addListener)
		}
	}

	return {
		toggle,
		get isOn() {
			return !!events
		},
		/** @param {TElemsCfg} elems */
		on(elems) {
			toggle(elems, true)
		},
		/** @param {TElemsCfg} elems */
		off(elems) {
			toggle(elems, false)
		},
	}
}
