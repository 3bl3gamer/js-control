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
export function controlSingle(callbacks: SingleMoveCallbacks, context?: Context): {
    toggle: (elems: MoveElemsCfg, on?: boolean | null | undefined) => void;
    readonly isOn: boolean;
    /** @param {TElemsCfg} elems */
    on(elems: MoveElemsCfg): void;
    /** @param {TElemsCfg} elems */
    off(elems: MoveElemsCfg): void;
};
/**
 * @param {DoubleMoveCallbacks} callbacks
 * @param {Context} [context]
 */
export function controlDouble(callbacks: DoubleMoveCallbacks, context?: Context): {
    toggle: (elems: MoveElemsCfg, on?: boolean | null | undefined) => void;
    readonly isOn: boolean;
    /** @param {TElemsCfg} elems */
    on(elems: MoveElemsCfg): void;
    /** @param {TElemsCfg} elems */
    off(elems: MoveElemsCfg): void;
};
/**
 * @param {WheelCallbacks} callbacks
 */
export function controlWheel(callbacks: WheelCallbacks): {
    toggle: (elems: MoveElemsCfg, on?: boolean | null | undefined) => void;
    readonly isOn: boolean;
    /** @param {TElemsCfg} elems */
    on(elems: MoveElemsCfg): void;
    /** @param {TElemsCfg} elems */
    off(elems: MoveElemsCfg): void;
};
export type Evt = [EventTarget, string, (e: any) => void];
export type EvtGroup = [allEents: [EventTarget, string, (e: any) => void][], autoOnEvents: Evt[]];
export type SingleMoveCallbacks = {
    singleDown: (e: PointerEvent, x: number, y: number) => boolean | void;
    singleMove: (e: PointerEvent, x: number, y: number) => void | boolean;
    singleUp: (e: PointerEvent) => void | boolean;
};
export type SingleHoverCallbacks = {
    singleHover: (e: PointerEvent, x: number, y: number) => void | boolean;
    singleLeave: (e: PointerEvent, x: number, y: number) => void | boolean;
};
export type DoubleMoveCallbacks = {
    singleDown: (e: PointerEvent, x: number, y: number, isSwitching: boolean) => boolean | void;
    singleMove: (e: PointerEvent, x: number, y: number) => void | boolean;
    singleUp: (e: PointerEvent, isSwitching: boolean) => void | boolean;
    doubleDown: (e: PointerEvent, e0: PointerEvent, e1: PointerEvent, x0: number, y0: number, x1: number, y1: number) => void | boolean;
    doubleMove: (e: PointerEvent, e0: PointerEvent, e1: PointerEvent, x0: number, y0: number, x1: number, y1: number) => void | boolean;
    doubleUp: (e: PointerEvent, e0: PointerEvent, e1: PointerEvent) => void | boolean;
};
export type WheelCallbacks = {
    wheelRot: (e: WheelEvent, deltaX: number, deltaY: number, deltaZ: number, x: number, y: number) => void | boolean;
};
export type MoveElemsCfg = {
    startElem: Element;
    moveElem?: EventTarget | null;
    offsetElem?: Element | null | 'no-offset';
};
export type WheelElemsCfg = {
    startElem: Element;
    offsetElem?: Element | null | 'no-offset';
};
export type Context = {
    down?(): unknown;
    up?(): unknown;
};
