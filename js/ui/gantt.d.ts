import { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    Column as TreeListColumn,
} from './tree_list';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    Item as dxToolbarItem,
} from './toolbar';

import {
    Item as dxContextMenuItem,
} from './context_menu';

import {
    template,
} from '../core/templates/template';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    FirstDayOfWeek,
    SingleMultipleOrNone,
    ToolbarItemLocation,
} from '../common';

import {
    HeaderFilterSearchConfig,
} from '../common/grids';

export type GanttPdfExportDateRange = 'all' | 'visible';
export type GanttPdfExportMode = 'all' | 'treeList' | 'chart';
/** @public */
export type GanttPredefinedContextMenuItem = 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails' | 'resourceManager';
/** @public */
export type GanttPredefinedToolbarItem = 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'taskDetails' | 'fullScreen' | 'resourceManager' | 'showResources' | 'showDependencies';
export type GanttRenderScaleType = 'minutes' | 'hours' | 'sixHours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years' | 'fiveYears';
export type GanttScaleType = 'auto' | 'minutes' | 'hours' | 'sixHours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
export type GanttTaskTitlePosition = 'inside' | 'outside' | 'none';

/** @public */
export type ContentReadyEvent = EventInfo<dxGantt>;

/** @public */
export type ContextMenuPreparingEvent = Cancelable & {
    readonly component?: dxGantt;
    readonly element?: DxElement;
    readonly event?: DxEvent<PointerEvent | MouseEvent | TouchEvent>;
    readonly targetKey?: any;
    readonly targetType?: string;
    readonly data?: any;
    readonly items?: Array<any>;
};

/** @public */
export type CustomCommandEvent = {
    readonly component?: dxGantt;
    readonly element?: DxElement;
    readonly name: string;
};

/** @public */
export type DependencyDeletedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
};

/** @public */
export type DependencyDeletingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
};

/** @public */
export type DependencyInsertedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
};

/** @public */
export type DependencyInsertingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
};

/** @public */
export type DisposingEvent = EventInfo<dxGantt>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxGantt>;

/** @public */
export type OptionChangedEvent = EventInfo<dxGantt> & ChangedOptionInfo;

/** @public */
export type ResourceAssignedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
};

/** @public */
export type ResourceAssigningEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
};

/** @public */
export type ResourceDeletedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
};

/** @public */
export type ResourceDeletingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
};

/** @public */
export type ResourceInsertedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
};

/** @public */
export type ResourceInsertingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
};

/** @public */
export type ResourceUnassignedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
};

/** @public */
export type ResourceUnassigningEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
};

/** @public */
export type SelectionChangedEvent = EventInfo<dxGantt> & {
    readonly selectedRowKey?: any;
};

/** @public */
export type TaskClickEvent = NativeEventInfo<dxGantt, PointerEvent | MouseEvent> & {
    readonly key?: any;
    readonly data?: any;
};

/** @public */
export type TaskDblClickEvent = Cancelable & NativeEventInfo<dxGantt, PointerEvent | MouseEvent> & {
    readonly key?: any;
    readonly data?: any;
};

/** @public */
export type TaskDeletedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
};

/** @public */
export type TaskDeletingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
};

/** @public */
export type TaskEditDialogShowingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
    readonly readOnlyFields?: Array<string>;
    readonly hiddenFields?: Array<string>;
};

/** @public */
export type ResourceManagerDialogShowingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: Array<any>;
};

/** @public */
export type TaskInsertedEvent = EventInfo<dxGantt> & {
    readonly values?: any;
    readonly key: any;
};

/** @public */
export type TaskInsertingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
};

/** @public */
export type TaskMovingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly newValues: any;
    readonly values: any;
    readonly key: any;
};

/** @public */
export type TaskUpdatedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
};

/** @public */
export type TaskUpdatingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly newValues: any;
    readonly values: any;
    readonly key: any;
};
/** @public */
export type ScaleCellPreparedEvent = InitializedEventInfo<dxGantt> & {
    readonly scaleIndex: number;
    readonly scaleType: GanttRenderScaleType;
    readonly scaleElement: DxElement;
    readonly separatorElement: DxElement;
    readonly startDate: Date;
    readonly endDate: Date;
};

/** @public */
export type TaskContentTemplateData = {
    readonly cellSize: any;
    readonly isMilestone: boolean;
    readonly taskData: any;
    readonly taskHTML: any;
    readonly taskPosition: any;
    readonly taskResources: Array<any>;
    readonly taskSize: any;
};

/** @public */
export type ProgressTooltipTemplateData = {
    readonly progress: number;
};

/** @public */
export type TimeTooltipTemplateData = {
    readonly start: Date;
    readonly end: Date;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxGanttOptions extends WidgetOptions<dxGantt> {
    /**
     * @docid
     * @default true
     * @public
     */
    allowSelection?: boolean;
    /**
     * @docid
     * @type Array<dxGanttColumn|string>
     * @default undefined
     * @public
     */
    columns?: Array<Column | string>;
    /**
     * @docid
     * @default null
     * @public
     */
    dependencies?: {
      /**
       * @docid
       * @default null
       * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | Function;
      /**
       * @docid
       * @default "predecessorId"
       */
      predecessorIdExpr?: string | Function;
      /**
       * @docid
       * @default "successorId"
       */
      successorIdExpr?: string | Function;
      /**
       * @docid
       * @default "type"
       */
      typeExpr?: string | Function;
    };
    /**
     * @docid
     * @public
     */
    editing?: {
      /**
       * @docid
       * @default true
       */
      allowDependencyAdding?: boolean;
      /**
       * @docid
       * @default true
       */
      allowDependencyDeleting?: boolean;
      /**
       * @docid
       * @default true
       */
      allowResourceAdding?: boolean;
      /**
       * @docid
       * @default true
       */
      allowResourceDeleting?: boolean;
      /**
       * @docid
       * @default true
       */
      allowResourceUpdating?: boolean;
      /**
       * @docid
       * @default true
       */
      allowTaskAdding?: boolean;
      /**
       * @docid
       * @default true
       */
      allowTaskDeleting?: boolean;
      /**
       * @docid
       * @default true
       */
      allowTaskResourceUpdating?: boolean;
      /**
       * @docid
       * @default true
       */
      allowTaskUpdating?: boolean;
      /**
       * @docid
       * @default false
       */
      enabled?: boolean;
    };
    /**
     * @docid
     * @public
     */
    validation?: {
      /**
       * @docid
       * @default false
       */
      validateDependencies?: boolean;
      /**
       * @docid
       * @default false
       */
      autoUpdateParentTasks?: boolean;
      /**
       * @docid
       * @default false
       */
       enablePredecessorGap?: boolean;
    };
    /**
     * @docid
     * @public
     */
     sorting?: dxGanttSorting;
    /**
     * @docid
     * @public
     */
    filterRow?: dxGanttFilterRow;
    /**
     * @docid
     * @public
     */
     headerFilter?: dxGanttHeaderFilter;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @action
     * @public
     */
    onCustomCommand?: ((e: CustomCommandEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field event:event
     * @type_function_param1_field items:Array<object>
     * @action
     * @public
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onTaskInserting?: ((e: TaskInsertingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onTaskInserted?: ((e: TaskInsertedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onTaskDeleting?: ((e: TaskDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onTaskDeleted?: ((e: TaskDeletedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onTaskUpdating?: ((e: TaskUpdatingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onTaskUpdated?: ((e: TaskUpdatedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onTaskMoving?: ((e: TaskMovingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @type_function_param1_field readOnlyFields:Array<string>
     * @type_function_param1_field hiddenFields:Array<string>
     * @action
     * @public
     */
    onTaskEditDialogShowing?: ((e: TaskEditDialogShowingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @type_function_param1_field values:Array<any>
     * @action
     * @public
     */
    onResourceManagerDialogShowing?: ((e: ResourceManagerDialogShowingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onDependencyInserting?: ((e: DependencyInsertingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onDependencyInserted?: ((e: DependencyInsertedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onDependencyDeleting?: ((e: DependencyDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onDependencyDeleted?: ((e: DependencyDeletedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onResourceInserting?: ((e: ResourceInsertingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onResourceInserted?: ((e: ResourceInsertedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onResourceDeleting?: ((e: ResourceDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onResourceDeleted?: ((e: ResourceDeletedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onResourceAssigning?: ((e: ResourceAssigningEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onResourceAssigned?: ((e: ResourceAssignedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onResourceUnassigning?: ((e: ResourceUnassigningEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @action
     * @public
     */
    onResourceUnassigned?: ((e: ResourceUnassignedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onTaskClick?: ((e: TaskClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onTaskDblClick?: ((e: TaskDblClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxGantt
     * @type_function_param1_field scaleType:Enums.GanttRenderScaleType
     * @action
     * @public
     */
    onScaleCellPrepared?: ((e: ScaleCellPreparedEvent) => void);

    /**
     * @docid
     * @default null
     * @public
     */
    resourceAssignments?: {
      /**
       * @docid
       * @default null
       * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | Function;
      /**
       * @docid
       * @default "resourceId"
       */
      resourceIdExpr?: string | Function;
      /**
       * @docid
       * @default "taskId"
       */
      taskIdExpr?: string | Function;
    };
    /**
     * @docid
     * @default null
     * @public
     */
    resources?: {
      /**
       * @docid
       * @default "color"
       */
      colorExpr?: string | Function;
      /**
       * @docid
       * @default null
       * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | Function;
      /**
       * @docid
       * @default "text"
       */
      textExpr?: string | Function;
    };
    /**
     * @docid
     * @default "auto"
     * @public
     */
    scaleType?: GanttScaleType;
    /**
     * @docid
     * @public
     */
    scaleTypeRange?: {
        /**
         * @docid
         * @default "minutes"
         */
        min?: GanttScaleType;
        /**
         * @docid
         * @default "years"
         */
        max?: GanttScaleType;
    };
    /**
     * @docid
     * @default undefined
     * @public
     */
    selectedRowKey?: any;
    /**
     * @docid
     * @default true
     * @public
     */
    showResources?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
     showDependencies?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showRowLines?: boolean;
    /**
     * @docid
     * @default 300
     * @public
     */
    taskListWidth?: number;
    /**
     * @docid
     * @default "inside"
     * @public
     */
    taskTitlePosition?: GanttTaskTitlePosition;
    /**
     * @docid
     * @default undefined
     * @public
     */
    firstDayOfWeek?: FirstDayOfWeek;
    /**
     * @docid
     * @default null
     * @public
     */
    tasks?: {
      /**
       * @docid
       * @default "color"
       */
      colorExpr?: string | Function;
      /**
       * @docid
       * @default null
       * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * @docid
       * @default "end"
       */
      endExpr?: string | Function;
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | Function;
      /**
       * @docid
       * @default "parentId"
       */
      parentIdExpr?: string | Function;
      /**
       * @docid
       * @default "progress"
       */
      progressExpr?: string | Function;
      /**
       * @docid
       * @default "start"
       */
      startExpr?: string | Function;
      /**
       * @docid
       * @default "title"
       */
      titleExpr?: string | Function;
    };
    /**
     * @docid
     * @default null
     * @public
     */
    toolbar?: dxGanttToolbar;
    /**
     * @docid
     * @public
     */
    contextMenu?: dxGanttContextMenu;
    /**
     * @docid
     * @default undefined
     * @public
     */
    stripLines?: Array<dxGanttStripLine>;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @public
     */
    taskTooltipContentTemplate?: template | ((container: DxElement, task: any) => string | UserDefinedElement);
    /**
     * @docid
     * @type_function_param2 item:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    taskTimeTooltipContentTemplate?: template | ((container: DxElement, item: TimeTooltipTemplateData) => string | UserDefinedElement);
    /**
     * @docid
     * @type_function_param2 item:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    taskProgressTooltipContentTemplate?: template | ((container: DxElement, item: ProgressTooltipTemplateData) => string | UserDefinedElement);
    /**
     * @docid
     * @type_function_param2 item:object
     * @type_function_param2_field cellSize:object
     * @type_function_param2_field taskData:object
     * @type_function_param2_field taskHTML:object
     * @type_function_param2_field taskPosition:object
     * @type_function_param2_field taskResources:Array<object>
     * @type_function_param2_field taskSize:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    taskContentTemplate?: template | ((container: DxElement, item: TaskContentTemplateData) => string | UserDefinedElement);
    /**
     * @docid
     * @default 0
     * @public
     */
    rootValue?: any;
    /**
     * @docid
     * @default null
     * @public
     */
    startDateRange?: Date;
    /**
     * @docid
     * @default null
     * @public
     */
    endDateRange?: Date;
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxGantt extends Widget<dxGanttOptions> {
    /**
     * @docid
     * @publicName getTaskData(key)
     * @param1 key:object
     * @return Object
     * @public
     */
    getTaskData(key: any): any;
    /**
     * @docid
     * @publicName getDependencyData(key)
     * @param1 key:object
     * @return Object
     * @public
     */
    getDependencyData(key: any): any;
    /**
     * @docid
     * @publicName getResourceData(key)
     * @param1 key:object
     * @return Object
     * @public
     */
    getResourceData(key: any): any;
    /**
     * @docid
     * @publicName getResourceAssignmentData(key)
     * @param1 key:object
     * @return Object
     * @public
     */
    getResourceAssignmentData(key: any): any;
    /**
     * @docid
     * @publicName insertTask(data)
     * @param1 data:object
     * @public
     */
    insertTask(data: any): void;
    /**
     * @docid
     * @publicName deleteTask(key)
     * @param1 key:object
     * @public
     */
    deleteTask(key: any): void;
    /**
     * @docid
     * @publicName updateTask(key, data)
     * @param1 key:object
     * @param2 data:object
     * @public
     */
    updateTask(key: any, data: any): void;
    /**
     * @docid
     * @publicName insertDependency(data)
     * @param1 data:object
     * @public
     */
    insertDependency(data: any): void;
    /**
     * @docid
     * @publicName deleteDependency(key)
     * @param1 key:object
     * @public
     */
    deleteDependency(key: any): void;
    /**
     * @docid
     * @publicName insertResource(data, taskKeys)
     * @param1 data:object
     * @param2 taskKeys?:Array<object>
     * @public
     */
    insertResource(data: any, taskKeys?: Array<any>): void;
    /**
     * @docid
     * @publicName deleteResource(key)
     * @param1 key:object
     * @public
     */
    deleteResource(key: any): void;
    /**
     * @docid
     * @publicName assignResourceToTask(resourceKey, taskKey)
     * @param1 resourceKey:object
     * @param2 taskKey:object
     * @public
     */
    assignResourceToTask(resourceKey: any, taskKey: any): void;
    /**
     * @docid
     * @publicName unassignResourceFromTask(resourceKey, taskKey)
     * @param1 resourceKey:object
     * @param2 taskKey:object
     * @public
     */
    unassignResourceFromTask(resourceKey: any, taskKey: any): void;
    /**
     * @docid
     * @publicName getTaskResources(key)
     * @param1 key:object
     * @return Array<object>
     * @public
     */
    getTaskResources(key: any): Array<any>;
    /**
     * @docid
     * @publicName getVisibleTaskKeys()
     * @return Array<object>
     * @public
     */
    getVisibleTaskKeys(): Array<any>;
    /**
     * @docid
     * @publicName getVisibleDependencyKeys()
     * @return Array<object>
     * @public
     */
    getVisibleDependencyKeys(): Array<any>;
    /**
     * @docid
     * @publicName getVisibleResourceKeys()
     * @return Array<object>
     * @public
     */
    getVisibleResourceKeys(): Array<any>;
    /**
     * @docid
     * @publicName getVisibleResourceAssignmentKeys()
     * @return Array<object>
     * @public
     */
    getVisibleResourceAssignmentKeys(): Array<any>;
    /**
     * @docid
     * @publicName updateDimensions()
     * @public
     */
    updateDimensions(): void;
    /**
     * @docid
     * @publicName scrollToDate(date)
     * @public
     */
    scrollToDate(date: Date | Number | string): void;
    /**
     * @docid
     * @publicName showResourceManagerDialog()
     * @public
     */
    showResourceManagerDialog(): void;
    /**
     * @docid
     * @publicName expandAll()
     * @public
     */
    expandAll(): void;
    /**
     * @docid
     * @publicName collapseAll()
     * @public
     */
    collapseAll(): void;
    /**
     * @docid
     * @publicName expandAllToLevel(level)
     * @public
     */
    expandAllToLevel(level: Number): void;
    /**
     * @docid
     * @publicName expandToTask(key)
     * @param1 key:object
     * @public
     */
    expandToTask(key: any): void;
    /**
     * @docid
     * @publicName collapseTask(key)
     * @param1 key:object
     * @public
     */
    collapseTask(key: any): void;
    /**
     * @docid
     * @publicName expandTask(key)
     * @param1 key:object
     * @public
     */
    expandTask(key: any): void;
    /**
     * @docid
     * @publicName refresh()
     * @return Promise<void>
     * @public
     */
    refresh(): DxPromise<void>;
    /**
     * @docid
     * @publicName showResources(value)
     * @public
     */
     showResources(value: boolean): void;
     /**
     * @docid
     * @publicName showDependencies(value)
     * @public
     */
      showDependencies(value: boolean): void;
     /**
     * @docid
     * @publicName zoomIn()
     * @public
     */
      zoomIn(): void;
      /**
     * @docid
     * @publicName zoomOut()
     * @public
     */
      zoomOut(): void;
     /**
     * @docid
     * @publicName unassignAllResourcesFromTask(taskKey)
     * @param1 taskKey:object
     * @public
     */
      unassignAllResourcesFromTask(taskKey: any): void;
     /**
     * @docid
     * @publicName showTaskDetailsDialog(taskKey)
     * @param1 taskKey:object
     * @public
     */
      showTaskDetailsDialog(taskKey: any): void;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttToolbar {
    /**
     * @docid
     * @type Array<dxGanttToolbarItem,Enums.GanttPredefinedToolbarItem>
     * @public
     */
    items?: Array<ToolbarItem | GanttPredefinedToolbarItem>;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttContextMenu {
    /**
     * @docid
     * @default true
     * @public
     */
    enabled?: boolean;
    /**
     * @docid
     * @type Array<dxGanttContextMenuItem,Enums.GanttPredefinedContextMenuItem>
     * @public
     */
    items?: Array<ContextMenuItem | GanttPredefinedContextMenuItem>;
}

/**
 * @public
 * @namespace DevExpress.ui.dxGantt
 */
export type ToolbarItem = dxGanttToolbarItem;

/**
 * @deprecated Use ToolbarItem instead
 * @namespace DevExpress.ui
 */
export interface dxGanttToolbarItem extends dxToolbarItem {
    /**
     * @docid
     * @public
     */
    name?: GanttPredefinedToolbarItem | string;
    /**
     * @docid
     * @default "before"
     * @public
     */
    location?: ToolbarItemLocation;
}

/**
 * @public
 * @namespace DevExpress.ui.dxGantt
 */
export type ContextMenuItem = dxGanttContextMenuItem;

/**
 * @deprecated Use ContextMenuItem instead
 * @namespace DevExpress.ui
 */
export interface dxGanttContextMenuItem extends dxContextMenuItem {
    /**
     * @docid
     * @type Enums.GanttPredefinedContextMenuItem|string
     * @public
     */
    name?: GanttPredefinedContextMenuItem | string;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttStripLine {
    /**
     * @docid
     * @default undefined
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    end?: Date | number | string | (() => Date | number | string);
    /**
     * @docid
     * @default undefined
     * @public
     */
    start?: Date | number | string | (() => Date | number | string);
    /**
     * @docid
     * @default undefined
     * @public
     */
    title?: string;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttSorting {
    /**
     * @docid
     * @default "Sort Ascending"
     */
    ascendingText?: string;
    /**
     * @docid
     * @default "Clear Sorting"
     */
    clearText?: string;
    /**
     * @docid
     * @default "Sort Descending"
     */
    descendingText?: string;
    /**
     * @docid
     * @default "single"
     */
    mode?: SingleMultipleOrNone | string;
    /**
     * @docid
     * @default false
     */
    showSortIndexes?: boolean;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttFilterRow {
    /**
     * @docid
     * @default "End"
     */
    betweenEndText?: string;
    /**
     * @docid
     * @default "Start"
     */
    betweenStartText?: string;
    /**
     * @docid
     */
    operationDescriptions?: dxGanttFilterRowOperationDescriptions;
    /**
     * @docid
     * @default "Reset"
     */
    resetOperationText?: string;
    /**
     * @docid
     * @default "(All)"
     */
    showAllText?: string;
    /**
     * @docid
     * @default true
     */
    showOperationChooser?: boolean;
    /**
     * @docid
     * @default false
     */
    visible?: boolean;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttFilterRowOperationDescriptions {
    /**
     * @docid
     * @default "Between"
     */
    between?: string;
    /**
     * @docid
     * @default "Contains"
     */
    contains?: string;
    /**
     * @docid
     * @default "Ends with"
     */
    endsWith?: string;
    /**
     * @docid
     * @default "Equals"
     */
    equal?: string;
    /**
     * @docid
     * @default "Greater than"
     */
    greaterThan?: string;
    /**
     * @docid
     * @default "Greater than or equal to"
     */
    greaterThanOrEqual?: string;
    /**
     * @docid
     * @default "Less than"
     */
    lessThan?: string;
    /**
     * @docid
     * @default "Less than or equal to"
     */
    lessThanOrEqual?: string;
    /**
     * @docid
     * @default "Does not contain"
     */
    notContains?: string;
    /**
     * @docid
     * @default "Does not equal"
     */
    notEqual?: string;
    /**
     * @docid
     * @default "Starts with"
     */
    startsWith?: string;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttHeaderFilter {
    /**
     * @docid
     * @default false
     * @deprecated
     */
    allowSearch?: boolean;
    /**
     * @docid
     * @default true
     */
    allowSelectAll?: boolean;
    /**
     * @docid
     * @default 315 &for(Material)
     * @default 325
     */
    height?: number;
    /**
     * @docid
     */
    search?: HeaderFilterSearchConfig;
    /**
     * @docid
     * @default 500
     * @deprecated
     */
    searchTimeout?: number;
    /**
     * @docid
     */
    texts?: dxGanttHeaderFilterTexts;
    /**
     * @docid
     * @default false
     */
    visible?: boolean;
    /**
     * @docid
     * @default 252
     */
    width?: number;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttHeaderFilterTexts {
    /**
     * @docid
     * @default "Cancel"
     */
    cancel?: string;
    /**
     * @docid
     * @default "(Blanks)"
     */
    emptyValue?: string;
    /**
     * @docid
     * @default "Ok"
     */
    ok?: string;
}

/** @public */
export type Properties = dxGanttOptions;

/** @deprecated use Properties instead */
export type Options = dxGanttOptions;

/** @public */
export type Column<TRowData = any, TKey = any> = dxGanttColumn<TRowData, TKey>;

/**
 * @namespace DevExpress.ui
 * @deprecated Use the Column type instead
 */
export type dxGanttColumn<TRowData = any, TKey = any> = Omit<dxGanttColumnBlank<TRowData, TKey>, 'allowEditing' | 'allowFixing' | 'allowHiding' | 'allowReordering' | 'allowResizing' | 'allowSearch' | 'buttons' | 'columns' | 'editCellTemplate' | 'editorOptions' | 'fixed' | 'fixedPosition' | 'formItem' | 'hidingPriority' | 'isBand' | 'lookup' | 'name' | 'ownerBand' | 'renderAsync' | 'setCellValue' | 'showEditorAlways' | 'showInColumnChooser' | 'type' | 'validationRules' >;

/**
 * @docid dxGanttColumn
 * @export dxGanttColumn
 * @inherits dxTreeListColumn
 * @namespace DevExpress.ui
 */
 interface dxGanttColumnBlank<TRowData = any, TKey = any> extends TreeListColumn<TRowData, TKey> {
    /**
     * @hidden
     * @docid dxGanttColumn.allowEditing
     */
     allowEditing: any;
    /**
     * @hidden
     * @docid dxGanttColumn.allowFixing
     */
     allowFixing: any;
    /**
     * @hidden
     * @docid dxGanttColumn.allowHiding
     */
     allowHiding: any;
    /**
     * @hidden
     * @docid dxGanttColumn.allowReordering
     */
     allowReordering: any;
    /**
     * @hidden
     * @docid dxGanttColumn.allowResizing
     */
     allowResizing: any;
    /**
     * @hidden
     * @docid dxGanttColumn.allowSearch
     */
     allowSearch: any;
    /**
     * @hidden
     * @docid dxGanttColumn.buttons
     */
    buttons: any;
    /**
     * @hidden
     * @docid dxGanttColumn.columns
     */
    columns: any;
    /**
     * @hidden
     * @docid dxGanttColumn.editorOptions
     */
    editorOptions: any;
    /**
     * @hidden
     * @type template
     * @docid dxGanttColumn.editCellTemplate
     */
    editCellTemplate: any;
    /**
     * @hidden
     * @docid dxGanttColumn.fixed
     */
    fixed: any;
    /**
     * @hidden
     * @docid dxGanttColumn.fixedPosition
     */
    fixedPosition: any;
    /**
     * @hidden
     * @docid dxGanttColumn.formItem
     */
     formItem: any;
    /**
     * @hidden
     * @docid dxGanttColumn.hidingPriority
     */
     hidingPriority: any;
    /**
     * @hidden
     * @docid dxGanttColumn.isBand
     */
     isBand: any;
    /**
     * @hidden
     * @docid dxGanttColumn.lookup
     */
     lookup: any;
    /**
     * @hidden
     * @docid dxGanttColumn.name
     */
     name: any;
    /**
     * @hidden
     * @docid dxGanttColumn.ownerBand
     */
     ownerBand: any;
    /**
     * @hidden
     * @docid dxGanttColumn.renderAsync
     */
     renderAsync: any;
    /**
     * @hidden
     * @docid dxGanttColumn.setCellValue
     */
     setCellValue: any;
    /**
     * @hidden
     * @docid dxGanttColumn.showEditorAlways
     */
     showEditorAlways: any;
    /**
     * @hidden
     * @docid dxGanttColumn.showInColumnChooser
     */
     showInColumnChooser: any;
    /**
     * @hidden
     * @docid dxGanttColumn.validationRules
     */
     validationRules: any;
    /**
     * @hidden
     * @docid dxGanttColumn.type
     */
    type: any;
 }

///#DEBUG
type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxGanttOptions.onContentReady
 * @type_function_param1 e:{ui/gantt:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onContextMenuPreparing
 * @type_function_param1 e:{ui/gantt:ContextMenuPreparingEvent}
 */
onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onCustomCommand
 * @type_function_param1 e:{ui/gantt:CustomCommandEvent}
 */
onCustomCommand?: ((e: CustomCommandEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onDependencyDeleted
 * @type_function_param1 e:{ui/gantt:DependencyDeletedEvent}
 */
onDependencyDeleted?: ((e: DependencyDeletedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onDependencyDeleting
 * @type_function_param1 e:{ui/gantt:DependencyDeletingEvent}
 */
onDependencyDeleting?: ((e: DependencyDeletingEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onDependencyInserted
 * @type_function_param1 e:{ui/gantt:DependencyInsertedEvent}
 */
onDependencyInserted?: ((e: DependencyInsertedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onDependencyInserting
 * @type_function_param1 e:{ui/gantt:DependencyInsertingEvent}
 */
onDependencyInserting?: ((e: DependencyInsertingEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onDisposing
 * @type_function_param1 e:{ui/gantt:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onInitialized
 * @type_function_param1 e:{ui/gantt:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onOptionChanged
 * @type_function_param1 e:{ui/gantt:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onResourceAssigned
 * @type_function_param1 e:{ui/gantt:ResourceAssignedEvent}
 */
onResourceAssigned?: ((e: ResourceAssignedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onResourceAssigning
 * @type_function_param1 e:{ui/gantt:ResourceAssigningEvent}
 */
onResourceAssigning?: ((e: ResourceAssigningEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onResourceDeleted
 * @type_function_param1 e:{ui/gantt:ResourceDeletedEvent}
 */
onResourceDeleted?: ((e: ResourceDeletedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onResourceDeleting
 * @type_function_param1 e:{ui/gantt:ResourceDeletingEvent}
 */
onResourceDeleting?: ((e: ResourceDeletingEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onResourceInserted
 * @type_function_param1 e:{ui/gantt:ResourceInsertedEvent}
 */
onResourceInserted?: ((e: ResourceInsertedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onResourceInserting
 * @type_function_param1 e:{ui/gantt:ResourceInsertingEvent}
 */
onResourceInserting?: ((e: ResourceInsertingEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onResourceManagerDialogShowing
 * @type_function_param1 e:{ui/gantt:ResourceManagerDialogShowingEvent}
 */
onResourceManagerDialogShowing?: ((e: ResourceManagerDialogShowingEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onResourceUnassigned
 * @type_function_param1 e:{ui/gantt:ResourceUnassignedEvent}
 */
onResourceUnassigned?: ((e: ResourceUnassignedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onResourceUnassigning
 * @type_function_param1 e:{ui/gantt:ResourceUnassigningEvent}
 */
onResourceUnassigning?: ((e: ResourceUnassigningEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onScaleCellPrepared
 * @type_function_param1 e:{ui/gantt:ScaleCellPreparedEvent}
 */
onScaleCellPrepared?: ((e: ScaleCellPreparedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onSelectionChanged
 * @type_function_param1 e:{ui/gantt:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onTaskClick
 * @type_function_param1 e:{ui/gantt:TaskClickEvent}
 */
onTaskClick?: ((e: TaskClickEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onTaskDblClick
 * @type_function_param1 e:{ui/gantt:TaskDblClickEvent}
 */
onTaskDblClick?: ((e: TaskDblClickEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onTaskDeleted
 * @type_function_param1 e:{ui/gantt:TaskDeletedEvent}
 */
onTaskDeleted?: ((e: TaskDeletedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onTaskDeleting
 * @type_function_param1 e:{ui/gantt:TaskDeletingEvent}
 */
onTaskDeleting?: ((e: TaskDeletingEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onTaskEditDialogShowing
 * @type_function_param1 e:{ui/gantt:TaskEditDialogShowingEvent}
 */
onTaskEditDialogShowing?: ((e: TaskEditDialogShowingEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onTaskInserted
 * @type_function_param1 e:{ui/gantt:TaskInsertedEvent}
 */
onTaskInserted?: ((e: TaskInsertedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onTaskInserting
 * @type_function_param1 e:{ui/gantt:TaskInsertingEvent}
 */
onTaskInserting?: ((e: TaskInsertingEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onTaskMoving
 * @type_function_param1 e:{ui/gantt:TaskMovingEvent}
 */
onTaskMoving?: ((e: TaskMovingEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onTaskUpdated
 * @type_function_param1 e:{ui/gantt:TaskUpdatedEvent}
 */
onTaskUpdated?: ((e: TaskUpdatedEvent) => void);
/**
 * @skip
 * @docid dxGanttOptions.onTaskUpdating
 * @type_function_param1 e:{ui/gantt:TaskUpdatingEvent}
 */
onTaskUpdating?: ((e: TaskUpdatingEvent) => void);
};
///#ENDDEBUG
