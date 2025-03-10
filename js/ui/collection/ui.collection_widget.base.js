import { getOuterWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { ensureDefined, deferRenderer, noop } from '../../core/utils/common';
import { findTemplates } from '../../core/utils/template_manager';
import { getPublicElement } from '../../core/element';
import domAdapter from '../../core/dom_adapter';
import { isPlainObject, isFunction, isDefined } from '../../core/utils/type';
import { when } from '../../core/utils/deferred';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import Action from '../../core/action';
import Guid from '../../core/guid';
import Widget from '../widget/ui.widget';
import { addNamespace, isCommandKeyPressed } from '../../events/utils/index';
import pointerEvents from '../../events/pointer';
import DataHelperMixin from '../../data_helper';
import CollectionWidgetItem from './item';
import { focusable } from '../widget/selectors';
import messageLocalization from '../../localization/message';
import holdEvent from '../../events/hold';
import { compileGetter } from '../../core/utils/data';
import { name as clickEventName } from '../../events/click';
import { name as contextMenuEventName } from '../../events/contextmenu';
import { BindableTemplate } from '../../core/templates/bindable_template';

const COLLECTION_CLASS = 'dx-collection';
const ITEM_CLASS = 'dx-item';
const CONTENT_CLASS_POSTFIX = '-content';
const ITEM_CONTENT_PLACEHOLDER_CLASS = 'dx-item-content-placeholder';
const ITEM_DATA_KEY = 'dxItemData';
const ITEM_INDEX_KEY = 'dxItemIndex';
const ITEM_TEMPLATE_ID_PREFIX = 'tmpl-';
const ITEMS_OPTIONS_NAME = 'dxItem';
const SELECTED_ITEM_CLASS = 'dx-item-selected';
const ITEM_RESPONSE_WAIT_CLASS = 'dx-item-response-wait';
const EMPTY_COLLECTION = 'dx-empty-collection';
const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

const ITEM_PATH_REGEX = /^([^.]+\[\d+\]\.)+([\w.]+)$/;
const ANONYMOUS_TEMPLATE_NAME = 'item';

const FOCUS_UP = 'up';
const FOCUS_DOWN = 'down';
const FOCUS_LEFT = 'left';
const FOCUS_RIGHT = 'right';
const FOCUS_PAGE_UP = 'pageup';
const FOCUS_PAGE_DOWN = 'pagedown';
const FOCUS_LAST = 'last';
const FOCUS_FIRST = 'first';

const CollectionWidget = Widget.inherit({

    _activeStateUnit: '.' + ITEM_CLASS,

    _supportedKeys: function() {
        const space = function(e) {
            e.preventDefault();
            this._enterKeyHandler(e);
        };
        const move = function(location, e) {
            if(!isCommandKeyPressed(e)) {
                e.preventDefault();
                e.stopPropagation();
                this._moveFocus(location, e);
            }
        };
        return extend(this.callBase(), {
            space: space,
            enter: this._enterKeyHandler,
            leftArrow: move.bind(this, FOCUS_LEFT),
            rightArrow: move.bind(this, FOCUS_RIGHT),
            upArrow: move.bind(this, FOCUS_UP),
            downArrow: move.bind(this, FOCUS_DOWN),
            pageUp: move.bind(this, FOCUS_UP),
            pageDown: move.bind(this, FOCUS_DOWN),
            home: move.bind(this, FOCUS_FIRST),
            end: move.bind(this, FOCUS_LAST)
        });
    },

    _enterKeyHandler: function(e) {
        const $itemElement = $(this.option('focusedElement'));

        if(!$itemElement.length) {
            return;
        }

        const itemData = this._getItemData($itemElement);
        if(itemData?.onClick) {
            this._itemEventHandlerByHandler($itemElement, itemData.onClick, {
                event: e
            });
        }

        this._itemClickHandler(extend({}, e, {
            target: $itemElement.get(0),
            currentTarget: $itemElement.get(0)
        }));
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name CollectionWidgetOptions.selectOnFocus
            * @type boolean
            * @hidden
            */
            selectOnFocus: false,

            /**
            * @name CollectionWidgetOptions.loopItemFocus
            * @type boolean
            * @hidden
            */
            loopItemFocus: true,

            items: [],

            itemTemplate: 'item',

            onItemRendered: null,

            onItemClick: null,

            onItemHold: null,

            itemHoldTimeout: 750,

            onItemContextMenu: null,

            onFocusedItemChanged: null,

            noDataText: messageLocalization.format('dxCollectionWidget-noDataText'),

            encodeNoDataText: false,

            dataSource: null,
            _dataController: null,

            _itemAttributes: {},
            itemTemplateProperty: 'template',
            focusOnSelectedItem: true,
            /**
            * @name CollectionWidgetOptions.focusedElement
            * @type DxElement
            * @default null
            * @hidden
            */
            focusedElement: null,

            displayExpr: undefined,
            disabledExpr: function(data) { return data ? data.disabled : undefined; },
            visibleExpr: function(data) { return data ? data.visible : undefined; }

        });
    },

    _init: function() {
        this._compileDisplayGetter();
        this._initDataController();
        this.callBase();

        this._cleanRenderedItems();
        this._refreshDataSource();
    },

    _compileDisplayGetter: function() {
        const displayExpr = this.option('displayExpr');
        this._displayGetter = displayExpr ? compileGetter(this.option('displayExpr')) : undefined;
    },

    _initTemplates: function() {
        this._initItemsFromMarkup();

        this._initDefaultItemTemplate();
        this.callBase();
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _initDefaultItemTemplate: function() {
        const fieldsMap = this._getFieldsMap();
        this._templateManager.addDefaultTemplates({
            item: new BindableTemplate((function($container, data) {
                if(isPlainObject(data)) {
                    this._prepareDefaultItemTemplate(data, $container);
                } else {
                    if(fieldsMap && isFunction(fieldsMap.text)) {
                        data = fieldsMap.text(data);
                    }
                    $container.text(String(ensureDefined(data, '')));
                }
            }).bind(this), this._getBindableFields(), this.option('integrationOptions.watchMethod'), fieldsMap)
        });
    },

    _getBindableFields: function() {
        return ['text', 'html'];
    },

    _getFieldsMap: function() {
        if(this._displayGetter) {
            return { text: this._displayGetter };
        }
    },

    _prepareDefaultItemTemplate: function(data, $container) {
        if(isDefined(data.text)) {
            $container.text(data.text);
        }

        if(isDefined(data.html)) {
            $container.html(data.html);
        }
    },

    _initItemsFromMarkup: function() {
        const rawItems = findTemplates(this.$element(), ITEMS_OPTIONS_NAME);

        if(!rawItems.length || this.option('items').length) {
            return;
        }

        const items = rawItems.map(({ element, options }) => {
            const isTemplateRequired = /\S/.test(element.innerHTML) && !options.template;

            if(isTemplateRequired) {
                options.template = this._prepareItemTemplate(element);
            } else {
                $(element).remove();
            }

            return options;
        });

        this.option('items', items);
    },

    _prepareItemTemplate: function(item) {
        const templateId = ITEM_TEMPLATE_ID_PREFIX + new Guid();
        const $template = $(item)
            .detach()
            .clone()
            .removeAttr('data-options')
            .addClass(TEMPLATE_WRAPPER_CLASS);

        this._saveTemplate(templateId, $template);

        return templateId;
    },

    _dataSourceOptions: function() {
        return { paginate: false };
    },

    _cleanRenderedItems: function() {
        this._renderedItemsCount = 0;
    },

    _focusTarget: function() {
        return this.$element();
    },

    _focusInHandler: function(e) {
        this.callBase.apply(this, arguments);

        if(!this._isFocusTarget(e.target)) {
            return;
        }

        const $focusedElement = $(this.option('focusedElement'));
        if($focusedElement.length) {
            this._setFocusedItem($focusedElement);
        } else {
            const $activeItem = this._getActiveItem();
            if($activeItem.length) {
                this.option('focusedElement', getPublicElement($activeItem));
            }
        }
    },

    _focusOutHandler: function() {
        this.callBase.apply(this, arguments);

        const $target = $(this.option('focusedElement'));

        this._updateFocusedItemState($target, false);
    },

    _findActiveTarget($element) {
        return $element.find(this._activeStateUnit);
    },

    _getActiveItem: function(last) {
        const $focusedElement = $(this.option('focusedElement'));

        if($focusedElement.length) {
            return $focusedElement;
        }

        let index = this.option('focusOnSelectedItem') ? this.option('selectedIndex') : 0;

        const activeElements = this._getActiveElement();
        const lastIndex = activeElements.length - 1;

        if(index < 0) {
            index = last ? lastIndex : 0;
        }

        return activeElements.eq(index);
    },

    _moveFocus: function(location) {
        const $items = this._getAvailableItems();
        let $newTarget;

        switch(location) {
            case FOCUS_PAGE_UP:
            case FOCUS_UP:
                $newTarget = this._prevItem($items);
                break;
            case FOCUS_PAGE_DOWN:
            case FOCUS_DOWN:
                $newTarget = this._nextItem($items);
                break;
            case FOCUS_RIGHT:
                $newTarget = this.option('rtlEnabled') ? this._prevItem($items) : this._nextItem($items);
                break;
            case FOCUS_LEFT:
                $newTarget = this.option('rtlEnabled') ? this._nextItem($items) : this._prevItem($items);
                break;
            case FOCUS_FIRST:
                $newTarget = $items.first();
                break;
            case FOCUS_LAST:
                $newTarget = $items.last();
                break;
            default:
                return false;
        }

        if($newTarget.length !== 0) {
            this.option('focusedElement', getPublicElement($newTarget));
        }
    },

    _getVisibleItems: function($itemElements) {
        $itemElements = $itemElements || this._itemElements();
        return $itemElements.filter(':visible');
    },

    _getAvailableItems: function($itemElements) {
        return this._getVisibleItems($itemElements);
    },

    _prevItem: function($items) {
        const $target = this._getActiveItem();
        const targetIndex = $items.index($target);
        const $last = $items.last();
        let $item = $($items[targetIndex - 1]);
        const loop = this.option('loopItemFocus');

        if($item.length === 0 && loop) {
            $item = $last;
        }

        return $item;
    },

    _nextItem: function($items) {
        const $target = this._getActiveItem(true);
        const targetIndex = $items.index($target);
        const $first = $items.first();
        let $item = $($items[targetIndex + 1]);
        const loop = this.option('loopItemFocus');

        if($item.length === 0 && loop) {
            $item = $first;
        }

        return $item;
    },

    _selectFocusedItem: function($target) {
        this.selectItem($target);
    },

    _updateFocusedItemState: function(target, isFocused, needCleanItemId) {
        const $target = $(target);

        if($target.length) {
            this._refreshActiveDescendant();
            this._refreshItemId($target, needCleanItemId);
            this._toggleFocusClass(isFocused, $target);
        }

        this._updateParentActiveDescendant();
    },

    _refreshActiveDescendant: function($target) {
        this.setAria('activedescendant', isDefined(this.option('focusedElement')) ? this.getFocusedItemId() : null, $target);
    },

    _refreshItemId: function($target, needCleanItemId) {
        if(!needCleanItemId && this.option('focusedElement')) {
            this.setAria('id', this.getFocusedItemId(), $target);
        } else {
            this.setAria('id', null, $target);
        }
    },

    _isDisabled($element) {
        return $element && $($element).attr('aria-disabled') === 'true';
    },

    _setFocusedItem: function($target) {
        if(!$target || !$target.length) {
            return;
        }

        this._updateFocusedItemState($target, true);
        this.onFocusedItemChanged(this.getFocusedItemId());

        const { selectOnFocus } = this.option();
        const isTargetDisabled = this._isDisabled($target);

        if(selectOnFocus && !isTargetDisabled) {
            this._selectFocusedItem($target);
        }
    },

    _findItemElementByItem: function(item) {
        let result = $();
        const that = this;

        this.itemElements().each(function() {
            const $item = $(this);
            if($item.data(that._itemDataKey()) === item) {
                result = $item;
                return false;
            }
        });

        return result;
    },

    _getIndexByItem: function(item) {
        return this.option('items').indexOf(item);
    },

    _itemOptionChanged: function(item, property, value, oldValue) {
        const $item = this._findItemElementByItem(item);
        if(!$item.length) {
            return;
        }
        if(!this.constructor.ItemClass.getInstance($item).setDataField(property, value)) {
            this._refreshItem($item, item);
        }

        const isDisabling = property === 'disabled' && value;

        if(isDisabling) {
            this._resetItemFocus($item);
        }
    },

    _resetItemFocus($item) {
        if($item.is(this.option('focusedElement'))) {
            this.option('focusedElement', null);
        }
    },

    _refreshItem: function($item) {
        const itemData = this._getItemData($item);
        const index = $item.data(this._itemIndexKey());
        this._renderItem(this._renderedItemsCount + index, itemData, null, $item);
    },

    _updateParentActiveDescendant: noop,

    _optionChanged: function(args) {
        if(args.name === 'items') {
            const matches = args.fullName.match(ITEM_PATH_REGEX);

            if(matches && matches.length) {
                const property = matches[matches.length - 1];
                const itemPath = args.fullName.replace('.' + property, '');
                const item = this.option(itemPath);

                this._itemOptionChanged(item, property, args.value, args.previousValue);
                return;
            }
        }

        switch(args.name) {
            case 'items':
            case '_itemAttributes':
            case 'itemTemplateProperty':
            case 'useItemTextAsTitle':
                this._cleanRenderedItems();
                this._invalidate();
                break;
            case 'dataSource':
                this._refreshDataSource();
                this._renderEmptyMessage();
                break;
            case 'noDataText':
            case 'encodeNoDataText':
                this._renderEmptyMessage();
                break;
            case 'itemTemplate':
                this._invalidate();
                break;
            case 'onItemRendered':
                this._createItemRenderAction();
                break;
            case 'onItemClick':
                break;
            case 'onItemHold':
            case 'itemHoldTimeout':
                this._attachHoldEvent();
                break;
            case 'onItemContextMenu':
                this._attachContextMenuEvent();
                break;
            case 'onFocusedItemChanged':
                this.onFocusedItemChanged = this._createActionByOption('onFocusedItemChanged');
                break;
            case 'selectOnFocus':
            case 'loopItemFocus':
            case 'focusOnSelectedItem':
                break;
            case 'focusedElement':
                this._updateFocusedItemState(args.previousValue, false, true);
                this._setFocusedItem($(args.value));
                break;
            case 'displayExpr':
                this._compileDisplayGetter();
                this._initDefaultItemTemplate();
                this._invalidate();
                break;
            case 'visibleExpr':
            case 'disabledExpr':
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    _invalidate: function() {
        this.option('focusedElement', null);

        return this.callBase.apply(this, arguments);
    },

    _loadNextPage: function() {
        this._expectNextPageLoading();

        return this._dataController.loadNextPage();
    },

    _expectNextPageLoading: function() {
        this._startIndexForAppendedItems = 0;
    },

    _expectLastItemLoading: function() {
        this._startIndexForAppendedItems = -1;
    },

    _forgetNextPageLoading: function() {
        this._startIndexForAppendedItems = null;
    },

    _dataSourceChangedHandler: function(newItems) {
        const items = this.option('items');
        if(this._initialized && items && this._shouldAppendItems()) {
            this._renderedItemsCount = items.length;
            if(!this._isLastPage() || this._startIndexForAppendedItems !== -1) {
                this.option().items = items.concat(newItems.slice(this._startIndexForAppendedItems));
            }

            this._forgetNextPageLoading();
            this._refreshContent();
        } else {
            this.option('items', newItems.slice());
        }
    },

    _refreshContent: function() {
        this._prepareContent();
        this._renderContent();
    },

    _dataSourceLoadErrorHandler: function() {
        this._forgetNextPageLoading();
        this.option('items', this.option('items'));
    },

    _shouldAppendItems: function() {
        return this._startIndexForAppendedItems != null && this._allowDynamicItemsAppend();
    },

    _allowDynamicItemsAppend: function() {
        return false;
    },

    _clean: function() {
        this._cleanFocusState();
        this._cleanItemContainer();
        this._inkRipple && delete this._inkRipple;
        this._resetActiveState();
    },

    _cleanItemContainer: function() {
        $(this._itemContainer()).empty();
    },

    _dispose: function() {
        this.callBase();

        clearTimeout(this._itemFocusTimeout);
    },

    _refresh: function() {
        this._cleanRenderedItems();

        this.callBase.apply(this, arguments);
    },

    _itemContainer: function() {
        return this.$element();
    },

    _itemClass: function() {
        return ITEM_CLASS;
    },

    _itemContentClass: function() {
        return this._itemClass() + CONTENT_CLASS_POSTFIX;
    },

    _selectedItemClass: function() {
        return SELECTED_ITEM_CLASS;
    },

    _itemResponseWaitClass: function() {
        return ITEM_RESPONSE_WAIT_CLASS;
    },

    _itemSelector: function() {
        return '.' + this._itemClass();
    },

    _itemDataKey: function() {
        return ITEM_DATA_KEY;
    },

    _itemIndexKey: function() {
        return ITEM_INDEX_KEY;
    },

    _itemElements: function() {
        return this._itemContainer().find(this._itemSelector());
    },

    _initMarkup: function() {
        this.callBase();
        this.onFocusedItemChanged = this._createActionByOption('onFocusedItemChanged');

        this.$element().addClass(COLLECTION_CLASS);
        this._prepareContent();
    },

    _prepareContent: deferRenderer(function() {
        this._renderContentImpl();
    }),

    _renderContent: function() {
        this._fireContentReadyAction();
    },

    _render: function() {
        this.callBase();

        this._attachClickEvent();
        this._attachHoldEvent();
        this._attachContextMenuEvent();
    },

    _attachClickEvent: function() {
        const itemSelector = this._itemSelector();
        const clickEventNamespace = addNamespace(clickEventName, this.NAME);
        const pointerUpEventNamespace = addNamespace(pointerEvents.up, this.NAME);
        const that = this;

        const pointerUpAction = new Action(function(args) {
            const event = args.event;
            that._itemPointerDownHandler(event);
        });

        eventsEngine.off(this._itemContainer(), clickEventNamespace, itemSelector);
        eventsEngine.off(this._itemContainer(), pointerUpEventNamespace, itemSelector);
        eventsEngine.on(this._itemContainer(), clickEventNamespace, itemSelector, (function(e) { this._itemClickHandler(e); }).bind(this));
        eventsEngine.on(this._itemContainer(), pointerUpEventNamespace, itemSelector, function(e) {
            pointerUpAction.execute({
                element: $(e.target),
                event: e
            });
        });
    },

    _itemClickHandler: function(e, args, config) {
        this._itemDXEventHandler(e, 'onItemClick', args, config);
    },

    _itemPointerDownHandler: function(e) {
        if(!this.option('focusStateEnabled')) {
            return;
        }

        this._itemFocusHandler = function() {
            clearTimeout(this._itemFocusTimeout);
            this._itemFocusHandler = null;

            if(e.isDefaultPrevented()) {
                return;
            }

            const $target = $(e.target);
            const $closestItem = $target.closest(this._itemElements());
            const $closestFocusable = this._closestFocusable($target);

            if($closestItem.length && this._isFocusTarget($closestFocusable?.get(0))) {
                this.option('focusedElement', getPublicElement($closestItem));
            }
        }.bind(this);

        this._itemFocusTimeout = setTimeout(this._forcePointerDownFocus.bind(this));
    },

    _closestFocusable: function($target) {
        if($target.is(focusable)) {
            return $target;
        } else {
            $target = $target.parent();

            while($target.length && !domAdapter.isDocument($target.get(0)) && !domAdapter.isDocumentFragment($target.get(0))) {
                if($target.is(focusable)) {
                    return $target;
                }
                $target = $target.parent();
            }
        }
    },

    _forcePointerDownFocus: function() {
        this._itemFocusHandler && this._itemFocusHandler();
    },

    _updateFocusState: function() {
        this.callBase.apply(this, arguments);

        this._forcePointerDownFocus();
    },

    _attachHoldEvent: function() {
        const $itemContainer = this._itemContainer();
        const itemSelector = this._itemSelector();
        const eventName = addNamespace(holdEvent.name, this.NAME);

        eventsEngine.off($itemContainer, eventName, itemSelector);
        eventsEngine.on($itemContainer, eventName, itemSelector, { timeout: this._getHoldTimeout() }, this._itemHoldHandler.bind(this));
    },

    _getHoldTimeout: function() {
        return this.option('itemHoldTimeout');
    },

    _shouldFireHoldEvent: function() {
        return this.hasActionSubscription('onItemHold');
    },

    _itemHoldHandler: function(e) {
        if(this._shouldFireHoldEvent()) {
            this._itemDXEventHandler(e, 'onItemHold');
        } else {
            e.cancel = true;
        }
    },

    _attachContextMenuEvent: function() {
        const $itemContainer = this._itemContainer();
        const itemSelector = this._itemSelector();
        const eventName = addNamespace(contextMenuEventName, this.NAME);

        eventsEngine.off($itemContainer, eventName, itemSelector);
        eventsEngine.on($itemContainer, eventName, itemSelector, this._itemContextMenuHandler.bind(this));
    },

    _shouldFireContextMenuEvent: function() {
        return this.hasActionSubscription('onItemContextMenu');
    },

    _itemContextMenuHandler: function(e) {
        if(this._shouldFireContextMenuEvent()) {
            this._itemDXEventHandler(e, 'onItemContextMenu');
        } else {
            e.cancel = true;
        }
    },

    _renderContentImpl: function() {
        const items = this.option('items') || [];
        if(this._renderedItemsCount) {
            this._renderItems(items.slice(this._renderedItemsCount));
        } else {
            this._renderItems(items);
        }
    },

    _renderItems: function(items) {
        if(items.length) {
            each(items, function(index, itemData) {
                this._renderItem(this._renderedItemsCount + index, itemData);
            }.bind(this));
        }

        this._renderEmptyMessage();
    },

    _renderItem: function(index, itemData, $container, $itemToReplace) {
        const itemIndex = index?.item ?? index;
        $container = $container || this._itemContainer();
        const $itemFrame = this._renderItemFrame(itemIndex, itemData, $container, $itemToReplace);
        this._setElementData($itemFrame, itemData, itemIndex);
        $itemFrame.attr(this.option('_itemAttributes'));
        this._attachItemClickEvent(itemData, $itemFrame);
        const $itemContent = this._getItemContent($itemFrame);

        const renderContentPromise = this._renderItemContent({
            index: itemIndex,
            itemData: itemData,
            container: getPublicElement($itemContent),
            contentClass: this._itemContentClass(),
            defaultTemplateName: this.option('itemTemplate')
        });

        const that = this;
        when(renderContentPromise).done(function($itemContent) {
            that._postprocessRenderItem({
                itemElement: $itemFrame,
                itemContent: $itemContent,
                itemData: itemData,
                itemIndex: itemIndex
            });

            that._executeItemRenderAction(index, itemData, getPublicElement($itemFrame));
        });

        return $itemFrame;
    },

    _getItemContent: function($itemFrame) {
        const $itemContent = $itemFrame.find('.' + ITEM_CONTENT_PLACEHOLDER_CLASS);
        $itemContent.removeClass(ITEM_CONTENT_PLACEHOLDER_CLASS);
        return $itemContent;
    },

    _attachItemClickEvent: function(itemData, $itemElement) {
        if(!itemData || !itemData.onClick) {
            return;
        }

        eventsEngine.on($itemElement, clickEventName, (function(e) {
            this._itemEventHandlerByHandler($itemElement, itemData.onClick, {
                event: e
            });
        }).bind(this));
    },

    _renderItemContent: function(args) {
        const itemTemplateName = this._getItemTemplateName(args);
        const itemTemplate = this._getTemplate(itemTemplateName);

        this._addItemContentClasses(args);
        const $templateResult = $(this._createItemByTemplate(itemTemplate, args));
        if(!$templateResult.hasClass(TEMPLATE_WRAPPER_CLASS)) {
            return args.container;
        }

        return this._renderItemContentByNode(args, $templateResult);
    },

    _renderItemContentByNode: function(args, $node) {
        $(args.container).replaceWith($node);
        args.container = getPublicElement($node);
        this._addItemContentClasses(args);

        return $node;
    },

    _addItemContentClasses: function(args) {
        const classes = [
            ITEM_CLASS + CONTENT_CLASS_POSTFIX,
            args.contentClass
        ];

        $(args.container).addClass(classes.join(' '));
    },

    _appendItemToContainer: function($container, $itemFrame, index) {
        $itemFrame.appendTo($container);
    },

    _renderItemFrame: function(index, itemData, $container, $itemToReplace) {
        const $itemFrame = $('<div>');
        new (this.constructor.ItemClass)($itemFrame, this._itemOptions(), itemData || {});

        if($itemToReplace && $itemToReplace.length) {
            $itemToReplace.replaceWith($itemFrame);
        } else {
            this._appendItemToContainer.call(this, $container, $itemFrame, index);
        }

        if(this.option('useItemTextAsTitle')) {
            const displayValue = this._displayGetter ? this._displayGetter(itemData) : itemData;
            $itemFrame.attr('title', displayValue);
        }

        return $itemFrame;
    },

    _itemOptions: function() {
        const that = this;
        return {
            watchMethod: function() {
                return that.option('integrationOptions.watchMethod');
            },
            owner: that,
            fieldGetter: function(field) {
                const expr = that.option(field + 'Expr');
                const getter = compileGetter(expr);

                return getter;
            }
        };
    },

    _postprocessRenderItem: noop,

    _executeItemRenderAction: function(index, itemData, itemElement) {
        this._getItemRenderAction()({
            itemElement: itemElement,
            itemIndex: index,
            itemData: itemData
        });
    },

    _setElementData: function(element, data, index) {
        element
            .addClass([ITEM_CLASS, this._itemClass()].join(' '))
            .data(this._itemDataKey(), data)
            .data(this._itemIndexKey(), index);
    },

    _createItemRenderAction: function() {
        return (this._itemRenderAction = this._createActionByOption('onItemRendered', {
            element: this.element(),
            excludeValidators: ['disabled', 'readOnly'],
            category: 'rendering'
        }));
    },

    _getItemRenderAction: function() {
        return this._itemRenderAction || this._createItemRenderAction();
    },

    _getItemTemplateName: function(args) {
        const data = args.itemData;
        const templateProperty = args.templateProperty || this.option('itemTemplateProperty');
        const template = data && data[templateProperty];

        return template || args.defaultTemplateName;
    },

    _createItemByTemplate: function(itemTemplate, renderArgs) {
        return itemTemplate.render({
            model: renderArgs.itemData,
            container: renderArgs.container,
            index: renderArgs.index,
            onRendered: this._onItemTemplateRendered(itemTemplate, renderArgs)
        });
    },

    _onItemTemplateRendered: function() {
        return noop;
    },

    _emptyMessageContainer: function() {
        return this._itemContainer();
    },

    _renderEmptyMessage: function(items) {
        items = items || this.option('items');
        const noDataText = this.option('noDataText');
        const hideNoData = !noDataText || (items && items.length) || this._dataController.isLoading();

        if(hideNoData && this._$noData) {
            this._$noData.remove();
            this._$noData = null;
            this.setAria('label', undefined);
        }

        if(!hideNoData) {
            this._$noData = this._$noData || $('<div>').addClass('dx-empty-message');
            this._$noData.appendTo(this._emptyMessageContainer());

            if(this.option('encodeNoDataText')) {
                this._$noData.text(noDataText);
            } else {
                this._$noData.html(noDataText);
            }
        }
        this.$element().toggleClass(EMPTY_COLLECTION, !hideNoData);
    },

    _itemDXEventHandler: function(dxEvent, handlerOptionName, actionArgs, actionConfig) {
        this._itemEventHandler(dxEvent.target, handlerOptionName, extend(actionArgs, {
            event: dxEvent
        }), actionConfig);
    },

    _itemEventHandler: function(initiator, handlerOptionName, actionArgs, actionConfig) {
        const action = this._createActionByOption(handlerOptionName, extend({
            validatingTargetName: 'itemElement'
        }, actionConfig));
        return this._itemEventHandlerImpl(initiator, action, actionArgs);
    },

    _itemEventHandlerByHandler: function(initiator, handler, actionArgs, actionConfig) {
        const action = this._createAction(handler, extend({
            validatingTargetName: 'itemElement'
        }, actionConfig));
        return this._itemEventHandlerImpl(initiator, action, actionArgs);
    },

    _itemEventHandlerImpl: function(initiator, action, actionArgs) {
        const $itemElement = this._closestItemElement($(initiator));
        const args = extend({}, actionArgs);

        return action(extend(actionArgs, this._extendActionArgs($itemElement), args));
    },

    _extendActionArgs: function($itemElement) {
        return {
            itemElement: getPublicElement($itemElement),
            itemIndex: this._itemElements().index($itemElement),
            itemData: this._getItemData($itemElement)
        };
    },

    _closestItemElement: function($element) {
        return $($element).closest(this._itemSelector());
    },

    _getItemData: function(itemElement) {
        return $(itemElement).data(this._itemDataKey());
    },

    _getSummaryItemsWidth: function(items, includeMargin) {
        let result = 0;

        if(items) {
            each(items, function(_, item) {
                result += getOuterWidth(item, includeMargin || false);
            });
        }

        return result;
    },

    /**
    * @name CollectionWidget.getFocusedItemId
    * @publicName getFocusedItemId()
    * @return string
    * @hidden
    */
    getFocusedItemId: function() {
        if(!this._focusedItemId) {
            this._focusedItemId = 'dx-' + new Guid();
        }

        return this._focusedItemId;
    },

    /**
    * @name CollectionWidget.itemElements
    * @publicName itemElements()
    * @return Array<Element>
    * @hidden
    */
    itemElements: function() {
        return this._itemElements();
    },

    /**
    * @name CollectionWidget.itemsContainer
    * @publicName itemsContainer()
    * @return Element
    * @hidden
    */
    itemsContainer: function() {
        return this._itemContainer();
    }

}).include(DataHelperMixin);

CollectionWidget.ItemClass = CollectionWidgetItem;

export default CollectionWidget;
