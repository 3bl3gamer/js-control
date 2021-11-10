PointerEvents multitouch is broken in Firefox for three years https://bugzilla.mozilla.org/show_bug.cgi?id=1524251

One more bugreport https://bugzilla.mozilla.org/show_bug.cgi?id=1729465

## Howto

Requires on target lement:

```css
.elem {
    touch-action: none; /* prevents same default browser behaviors */
    user-select: none; /* prevents long-tap-text-selection */
}
```

## TODO

### Combining multiple controls

```js
combine(
    controlDouble({...}),
    controlHover({...}),
    controlWheel({...}),
).on({startElem})
```

And update example.

### Tests
