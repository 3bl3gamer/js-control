import { controlSingle, controlDouble } from '../../src'

window.addEventListener('error', e => {
	if (e.message === 'Script error.' && e.filename === '') return
	alert(`${e.message} in ${e.filename}:${e.lineno}:${e.colno}`)
})

const body = document.body

function translate(elem, x, y, scale = 1) {
	elem.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
}

function clamp(elem, x, y) {
	const rect = elem.getBoundingClientRect()
	const parentRect = elem.parentElement.getBoundingClientRect()
	if (x < 0) x = 0
	if (y < 0) y = 0
	if (x > parentRect.width - rect.width) x = parentRect.width - rect.width
	if (y > parentRect.height - rect.height) y = parentRect.height - rect.height
	return [x, y]
}

function distance(x0, y0, x1, y1) {
	return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)
}

function makeWrap(label) {
	const wrap = document.createElement('div')
	wrap.style.position = 'relative'
	wrap.style.overflow = 'hidden'
	wrap.style.height = '50vh'
	wrap.style.marginBottom = '8px'
	wrap.style.outline = '2px solid gray'
	wrap.style.display = 'flex'
	wrap.style.alignItems = 'center'
	wrap.style.justifyContent = 'center'
	wrap.style.textAlign = 'center'
	wrap.style.fontSize = '48px'
	wrap.style.color = 'lightgray'
	wrap.innerHTML = label
	body.appendChild(wrap)
	return wrap
}

function makeElem(wrap, label) {
	const elem = document.createElement('div')
	elem.style.position = 'absolute'
	elem.style.left = '0'
	elem.style.top = '0'
	elem.style.width = '192px'
	elem.style.minHeight = '96px'
	elem.style.outline = '2px solid gray'
	elem.style.backgroundColor = 'lightgray'
	elem.style.padding = '4px'
	elem.style.fontSize = '18px'
	elem.style.color = 'black'
	elem.style.transformOrigin = '0 0'
	elem.style.touchAction = 'none'
	elem.style.userSelect = 'none'
	wrap.appendChild(elem)
	const span = document.createElement('span')
	span.innerHTML = label
	span.style.pointerEvents = 'none'
	elem.appendChild(span)
	return [elem, span]
}

function roundStr(val, n) {
	return val.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: n })
}
function roundStr1(val) {
	return roundStr(val, 1)
}

{
	const wrap = makeWrap('controlSingle')
	const [elem, labelElem] = makeElem(wrap, 'drag me')

	let elemX = 32
	let elemY = 24
	let prevX, prevY
	translate(elem, elemX, elemY)

	controlSingle({
		singleDown(e, id, x, y) {
			prevX = x
			prevY = y
			labelElem.innerHTML = `<b>down</b><br>id=${id}<br>x=${roundStr1(x)} y=${roundStr1(y)}`
			return true
		},
		singleMove(e, id, x, y) {
			labelElem.innerHTML = `<b>move</b><br>id=${id}<br>x=${roundStr1(x)} y=${roundStr1(y)}`
			elemX += x - prevX
			elemY += y - prevY
			;[elemX, elemY] = clamp(elem, elemX, elemY)
			translate(elem, elemX, elemY)
			prevX = x
			prevY = y
		},
		singleUp(e, id) {
			labelElem.innerHTML = `<b>up</b><br>id=${id}`
		},
	}).on({ startElem: elem, offsetElem: wrap })
}

{
	const wrap = makeWrap('controlDouble')
	const [elem, label] = makeElem(wrap, 'drag me<br>touch-scale me<br>wheel-zoom me')

	let elemX = 32
	let elemY = 24
	let elemScale = 1
	let prevX, prevY, prevDis
	translate(elem, elemX, elemY, elemScale)

	controlDouble({
		singleDown(e, id, x, y, isSwitching) {
			prevX = x
			prevY = y
			label.innerHTML = `<b>down x1</b><br>id=${id}<br>x=${roundStr1(x)} y=${roundStr1(y)}`
			return true
		},
		singleMove(e, id, x, y) {
			label.innerHTML = `<b>move x1</b><br>id=${id}<br>x=${roundStr1(x)} y=${roundStr1(y)}`
			elemX += x - prevX
			elemY += y - prevY
			;[elemX, elemY] = clamp(elem, elemX, elemY)
			translate(elem, elemX, elemY, elemScale)
			prevX = x
			prevY = y
		},
		singleUp(e, id, isSwitching) {
			label.innerHTML = `<b>up x1</b><br>id=${id}`
		},
		doubleDown(e, id0, x0, y0, id1, x1, y1) {
			label.innerHTML =
				`<b>down x2</b><br>id0=${id0} id1=${id1}` +
				`<br>x0=${roundStr1(x0)} y0=${roundStr1(y0)}` +
				`<br>x1=${roundStr1(x1)} y1=${roundStr1(y1)}`
			prevDis = distance(x0, y0, x1, y1)
			prevX = (x0 + x1) / 2
			prevY = (y0 + y1) / 2
			return true
		},
		doubleMove(e, id0, x0, y0, id1, x1, y1) {
			label.innerHTML =
				`<b>move x2</b><br>id0=${id0} id1=${id1}` +
				`<br>x0=${roundStr1(x0)} y0=${roundStr1(y0)}` +
				`<br>x1=${roundStr1(x1)} y1=${roundStr1(y1)}`
			const curX = (x0 + x1) / 2
			const curY = (y0 + y1) / 2
			const curDis = distance(x0, y0, x1, y1)

			const { width, height } = elem.getBoundingClientRect()
			const dScale = curDis / prevDis
			elemScale *= dScale
			elemX += curX - prevX + (width * (1 - dScale)) / 2
			elemY += curY - prevY + (height * (1 - dScale)) / 2
			;[elemX, elemY] = clamp(elem, elemX, elemY)
			translate(elem, elemX, elemY, elemScale)

			prevX = curX
			prevY = curY
			prevDis = curDis
		},
		doubleUp(e, id0, id1) {
			label.innerHTML = `<b>up x2</b><br>id0=${id0} id1=${id1}`
		},
		wheelRot(e, dx, dy, dz, x, y) {
			label.innerHTML = `<b>wheel</b><br>dx=${roundStr1(dx)} dy=${roundStr1(dy)} dz=${roundStr1(dz)}`

			const { width, height } = elem.getBoundingClientRect()
			const dScale = Math.pow(2, -dy / 480)
			elemScale *= dScale
			elemX += (width * (1 - dScale)) / 2
			elemY += (height * (1 - dScale)) / 2
			translate(elem, elemX, elemY, elemScale)

			return true
		},
	}).on({ startElem: elem, offsetElem: wrap })
}
