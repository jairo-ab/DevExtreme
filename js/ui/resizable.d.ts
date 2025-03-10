import { UserDefinedElement } from '../core/element';
import DOMComponent, {
    DOMComponentOptions,
} from '../core/dom_component';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

/** @public */
export type ResizeHandle = 'bottom' | 'left' | 'right' | 'top' | 'all';

export interface ResizeInfo {
    readonly width: number;
    readonly height: number;
}

/** @public */
export type DisposingEvent = EventInfo<dxResizable>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxResizable>;

/** @public */
export type OptionChangedEvent = EventInfo<dxResizable> & ChangedOptionInfo;

/** @public */
export type ResizeEvent = NativeEventInfo<dxResizable, MouseEvent | TouchEvent> & ResizeInfo;

/** @public */
export type ResizeStartEvent = NativeEventInfo<dxResizable, MouseEvent | TouchEvent> & ResizeInfo;

/** @public */
export type ResizeEndEvent = NativeEventInfo<dxResizable, MouseEvent | TouchEvent> & ResizeInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
    /**
     * @docid
     * @default undefined
     * @public
     */
    area?: string | UserDefinedElement;
    /**
     * @docid
     * @default "all"
     * @public
     */
    handles?: ResizeHandle | string;
    /**
     * @docid
     * @fires dxResizableOptions.onResize
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default true
     * @public
     */
    keepAspectRatio?: boolean;
    /**
     * @docid
     * @default Infinity
     * @public
     */
    maxHeight?: number;
    /**
     * @docid
     * @default Infinity
     * @public
     */
    maxWidth?: number;
    /**
     * @docid
     * @default 30
     * @public
     */
    minHeight?: number;
    /**
     * @docid
     * @default 30
     * @public
     */
    minWidth?: number;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:dxResizable
     * @action
     * @public
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:dxResizable
     * @action
     * @public
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:dxResizable
     * @action
     * @public
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * @docid
     * @fires dxResizableOptions.onResize
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @inherits DOMComponent
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxResizable extends DOMComponent<dxResizableOptions> { }

/** @public */
export type Properties = dxResizableOptions;

/** @deprecated use Properties instead */
export type Options = dxResizableOptions;

///#DEBUG
type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxResizableOptions.onDisposing
 * @type_function_param1 e:{ui/resizable:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxResizableOptions.onInitialized
 * @type_function_param1 e:{ui/resizable:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxResizableOptions.onOptionChanged
 * @type_function_param1 e:{ui/resizable:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxResizableOptions.onResize
 * @type_function_param1 e:{ui/resizable:ResizeEvent}
 */
onResize?: ((e: ResizeEvent) => void);
/**
 * @skip
 * @docid dxResizableOptions.onResizeEnd
 * @type_function_param1 e:{ui/resizable:ResizeEndEvent}
 */
onResizeEnd?: ((e: ResizeEndEvent) => void);
/**
 * @skip
 * @docid dxResizableOptions.onResizeStart
 * @type_function_param1 e:{ui/resizable:ResizeStartEvent}
 */
onResizeStart?: ((e: ResizeStartEvent) => void);
};
///#ENDDEBUG
