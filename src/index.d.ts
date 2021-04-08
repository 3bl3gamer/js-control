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
export function controlSingle(params: {
    startElem: Element;
    moveElem?: EventTarget | null;
    offsetElem?: Element | null | 'no-offset';
    leaveElem?: EventTarget | null;
    callbacks: {
        singleDown?: (e: MouseEvent | TouchEvent, id: 'mouse' | number, x: number, y: number) => boolean | void;
        singleMove?: (e: MouseEvent | TouchEvent, id: 'mouse' | number, x: number, y: number) => void | boolean;
        singleUp?: (e: MouseEvent | TouchEvent, id: 'mouse' | number) => void | boolean;
        singleHover?: (e: MouseEvent, x: number, y: number) => void | boolean;
        singleLeave?: (e: MouseEvent, x: number, y: number) => void | boolean;
        wheelRot?: (e: WheelEvent, deltaX: number, deltaY: number, deltaZ: number, x: number, y: number) => void | boolean;
    };
}): {
    toggle: (on: boolean | null | undefined) => void;
    readonly isOn: boolean;
    on(): void;
    off(): void;
};
/**
 * @param {{
 *   startElem: Element,
 *   offsetElem?: Element|null|'no-offset',
 *   wheelRot: (e:WheelEvent, deltaX:number, deltaY:number, deltaZ:number, x:number, y:number) => void|boolean,
 * }} params
 */
export function controlWheel(params: {
    startElem: Element;
    offsetElem?: Element | null | 'no-offset';
    wheelRot: (e: WheelEvent, deltaX: number, deltaY: number, deltaZ: number, x: number, y: number) => void | boolean;
}): {
    toggle: (on: boolean | null | undefined) => void;
    readonly isOn: boolean;
    on(): void;
    off(): void;
};
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
 *     doubleDown?: (e:TouchEvent, id0:number, x0:number, y0:number, id1:number, x1:number, y1:number, isSwitching:boolean) => void|boolean,
 *     doubleMove?: (e:TouchEvent, id0:number, x0:number, y0:number, id1:number, x1:number, y1:number) => void|boolean,
 *     doubleUp?: (e:TouchEvent, id0:number, id1:number, isSwitching:boolean) => void|boolean,
 *     wheelRot?: (e:WheelEvent, deltaX:number, deltaY:number, deltaZ:number, x:number, y:number) => void|boolean,
 *   },
 * }} params
 */
export function controlDouble(params: {
    startElem: Element;
    moveElem?: EventTarget | null;
    offsetElem?: Element | null;
    leaveElem?: EventTarget | null;
    callbacks: {
        singleDown?: (e: MouseEvent | TouchEvent, id: 'mouse' | number, x: number, y: number, isSwitching: boolean) => boolean | void;
        singleMove?: (e: MouseEvent | TouchEvent, id: 'mouse' | number, x: number, y: number) => void | boolean;
        singleUp?: (e: MouseEvent | TouchEvent, id: 'mouse' | number, isSwitching: boolean) => void | boolean;
        singleHover?: (e: MouseEvent, x: number, y: number) => void | boolean;
        singleLeave?: (e: MouseEvent, x: number, y: number) => void | boolean;
        doubleDown?: (e: TouchEvent, id0: number, x0: number, y0: number, id1: number, x1: number, y1: number, isSwitching: boolean) => void | boolean;
        doubleMove?: (e: TouchEvent, id0: number, x0: number, y0: number, id1: number, x1: number, y1: number) => void | boolean;
        doubleUp?: (e: TouchEvent, id0: number, id1: number, isSwitching: boolean) => void | boolean;
        wheelRot?: (e: WheelEvent, deltaX: number, deltaY: number, deltaZ: number, x: number, y: number) => void | boolean;
    };
}): {
    toggle: (on: boolean | null | undefined) => void;
    readonly isOn: boolean;
    on(): void;
    off(): void;
};
export type Evt = [EventTarget, string, (e: any) => void];
