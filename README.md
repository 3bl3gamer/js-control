Utils for unified mouse and single/double touch input.

[Example](https://3bl3gamer.github.io/js-control/examples/)

## Usage

### Single input

```js
controlSingle({
    singleDown(e, id, x, y) {
        // `e` is original event (MouseEvent or TouchEvent)
        // `id` is touchId for touch input and 'mouse' for mouse input
        // `x` and `y` are relative to `offsetElem` top-left corner
        return true //`true` issues e.preventDefault()
    },
    singleMove(e, id, x, y) {
        // ...
    },
    singleUp(e, id) {
        // ...
    },

    singleHover(e, x, y) {
        // ...
    },
    singleLeave(e, x, y) {
        // ...
    },
}).on({ startElem, moveElem, leaveElem, offsetElem })
```

### Single/double input

```js
controlDouble({
    singleDown(e, id, x, y, isSwitching) {
        // ...
        return true
    },
    singleMove(e, id, x, y) {
        // move something
    },
    singleUp(e, id, isSwitching) {
        // ...
    },

    doubleDown(e, id0, x0, y0, id1, x1, y1) {
        // ...
    },
    doubleMove(e, id0, x0, y0, id1, x1, y1) {
        // move something, zoom something
    },
    doubleUp(e, id0, id1) {
        // ...
    },

    singleHover(e, x, y) {
        // hover something
    },
    singleLeave(e, x, y) {
        // ...
    },

    wheelRot(e, dx, dy, dz, x, y) {
        // zoom someting
        return true
    },
}).on({ startElem, moveElem, leaveElem, offsetElem })
```

`isSwitching` argument is `true` when input mode is switching from single- to double-touch or back.
That is, `singleUp(..., true)` is always called before `doubleDown()`
and `singleDown(..., true)` is always called after `doubleUp()`.

### Wheel

```js
controlWheel({
    wheelRot(e, dx, dy, dz, x, y) {
        // ...
    },
}).on({ startElem, offsetElem })
```

### General

`controlSmth(callbacks).on(elems)`

Each `controlSmth(callbacks)` accepts an object with optional functions. Most of these functions:
 * receive related event as fist argument;
 * receive mouse/touch coordinates relative to `offsetElem` top-left corner;
 * may return `true` to trigger `preventDefault()` on related event.

Each `controlSmth()` returns object with:
 * `isOn` — readonly property indicating if control is enabled (events are attached to elems);
 * `on(elems)` — attaches listeners to elems unless `isOn`, otherwise does nothing, returns control object;
 * `off()` — detaches listeners if `isOn`, otherwise does nothing, returns control object.

Where `elems` is an object with:
 * `startElem` — element for `mousedown`, `touchstart` and `wheel` events;
 * `moveElem` — (optional, `window` by default) element for `*move`, `*up/end` events;
 * `leaveElem` — (optional, `startElem` by default) element for `mouseleave` event;
 * `offsetElem` — (optional, `startElem` by default) offset element or string `'no-offset'`.

After `off()` control can be re-enabled with `on()` again.

More info in [src/index.d.ts](https://github.com/3bl3gamer/js-control/blob/master/src/index.d.ts).
