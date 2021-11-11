/** @typedef {[EventTarget, string, (e:any) => void]} Evt */
/** @typedef {[allEents:Evt[], autoOnEvents:Evt[]]} EvtGroup */
/**
 * @template TElemsCfg
 * @typedef {{
 *   readonly isOn: boolean,
 *   on(elems: TElemsCfg): ControlToggler<TElemsCfg>,
 *   off(): ControlToggler<TElemsCfg>,
 * }} ControlToggler
 */
/**
 * @typedef {{
 *   singleDown?: (e:MouseEvent|TouchEvent, id:'mouse'|number, x:number, y:number) => boolean|void,
 *   singleMove?: (e:MouseEvent|TouchEvent, id:'mouse'|number, x:number, y:number) => void|boolean,
 *   singleUp?:   (e:MouseEvent|TouchEvent, id:'mouse'|number) => void|boolean,
 * }} SingleMoveCallbacks
 */
/**
 * @typedef {{
 *   singleHover?: (e:MouseEvent, x:number, y:number) => void|boolean,
 *   singleLeave?: (e:MouseEvent, x:number, y:number) => void|boolean,
 * }} SingleHoverCallbacks
 */
/**
 * @typedef {{
 *   singleDown?: (e:MouseEvent|TouchEvent, id:'mouse'|number, x:number, y:number, isSwitching:boolean) => boolean|void,
 *   singleMove?: (e:MouseEvent|TouchEvent, id:'mouse'|number, x:number, y:number) => void|boolean,
 *   singleUp?:   (e:MouseEvent|TouchEvent, id:'mouse'|number, isSwitching:boolean) => void|boolean,
 *   doubleDown?: (e:TouchEvent, id0:number, x0:number, y0:number, id1:number, x1:number, y1:number) => void|boolean,
 *   doubleMove?: (e:TouchEvent, id0:number, x0:number, y0:number, id1:number, x1:number, y1:number) => void|boolean,
 *   doubleUp?:   (e:TouchEvent, id0:number, id1:number) => void|boolean,
 * }} DoubleMoveCallbacks
 */
/**
 * @typedef {{
 *   wheelRot?: (e:WheelEvent, deltaX:number, deltaY:number, deltaZ:number, x:number, y:number) => void|boolean,
 * }} WheelCallbacks
 */
/**
 * @typedef {{
 *   startElem: Element,
 *   moveElem?: EventTarget|null,
 *   leaveElem?: EventTarget|null,
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
 * @param {SingleMoveCallbacks & SingleHoverCallbacks} callbacks
 */
export function controlSingle(callbacks: SingleMoveCallbacks & SingleHoverCallbacks): ControlToggler<MoveElemsCfg>;
/**
 * @param {WheelCallbacks} callbacks
 */
export function controlWheel(callbacks: WheelCallbacks): ControlToggler<WheelElemsCfg>;
/**
 * @param {DoubleMoveCallbacks & SingleHoverCallbacks & WheelCallbacks} callbacks
 */
export function controlDouble(callbacks: DoubleMoveCallbacks & SingleHoverCallbacks & WheelCallbacks): ControlToggler<MoveElemsCfg>;
export type Evt = [EventTarget, string, (e: any) => void];
export type EvtGroup = [allEents: [EventTarget, string, (e: any) => void][], autoOnEvents: Evt[]];
export type ControlToggler<TElemsCfg> = {
    readonly isOn: boolean;
    on(elems: TElemsCfg): ControlToggler<TElemsCfg>;
    off(): ControlToggler<TElemsCfg>;
};
export type SingleMoveCallbacks = {
    singleDown?: (e: MouseEvent | TouchEvent, id: 'mouse' | number, x: number, y: number) => boolean | void;
    singleMove?: (e: MouseEvent | TouchEvent, id: 'mouse' | number, x: number, y: number) => void | boolean;
    singleUp?: (e: MouseEvent | TouchEvent, id: 'mouse' | number) => void | boolean;
};
export type SingleHoverCallbacks = {
    singleHover?: (e: MouseEvent, x: number, y: number) => void | boolean;
    singleLeave?: (e: MouseEvent, x: number, y: number) => void | boolean;
};
export type DoubleMoveCallbacks = {
    singleDown?: (e: MouseEvent | TouchEvent, id: 'mouse' | number, x: number, y: number, isSwitching: boolean) => boolean | void;
    singleMove?: (e: MouseEvent | TouchEvent, id: 'mouse' | number, x: number, y: number) => void | boolean;
    singleUp?: (e: MouseEvent | TouchEvent, id: 'mouse' | number, isSwitching: boolean) => void | boolean;
    doubleDown?: (e: TouchEvent, id0: number, x0: number, y0: number, id1: number, x1: number, y1: number) => void | boolean;
    doubleMove?: (e: TouchEvent, id0: number, x0: number, y0: number, id1: number, x1: number, y1: number) => void | boolean;
    doubleUp?: (e: TouchEvent, id0: number, id1: number) => void | boolean;
};
export type WheelCallbacks = {
    wheelRot?: (e: WheelEvent, deltaX: number, deltaY: number, deltaZ: number, x: number, y: number) => void | boolean;
};
export type MoveElemsCfg = {
    startElem: Element;
    moveElem?: EventTarget | null;
    leaveElem?: EventTarget | null;
    offsetElem?: Element | null | 'no-offset';
};
export type WheelElemsCfg = {
    startElem: Element;
    offsetElem?: Element | null | 'no-offset';
};
