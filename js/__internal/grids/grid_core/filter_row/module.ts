import { getOuterWidth } from '@js/core/utils/size';
import $ from '@js/core/renderer';
import eventsEngine from '@js/events/core/events_engine';
import { isDefined } from '@js/core/utils/type';
import { extend } from '@js/core/utils/extend';
import { normalizeKeyName } from '@js/events/utils/index';
import { each, map } from '@js/core/utils/iterator';
import messageLocalization from '@js/localization/message';
import Editor from '@js/ui/editor/editor';
import Overlay from '@js/ui/overlay/ui.overlay';
import Menu from '@js/ui/menu';
import { selectView } from '@js/ui/shared/accessibility';
import { equalByValue } from '@js/core/utils/common';
import modules from '../modules';
import gridCoreUtils from '../module_utils';

const OPERATION_ICONS = {
  '=': 'filter-operation-equals',
  '<>': 'filter-operation-not-equals',
  '<': 'filter-operation-less',
  '<=': 'filter-operation-less-equal',
  '>': 'filter-operation-greater',
  '>=': 'filter-operation-greater-equal',
  default: 'filter-operation-default',
  // eslint-disable-next-line spellcheck/spell-checker
  notcontains: 'filter-operation-not-contains',
  contains: 'filter-operation-contains',
  startswith: 'filter-operation-starts-with',
  endswith: 'filter-operation-ends-with',
  between: 'filter-operation-between',
};

const OPERATION_DESCRIPTORS = {
  '=': 'equal',
  '<>': 'notEqual',
  '<': 'lessThan',
  '<=': 'lessThanOrEqual',
  '>': 'greaterThan',
  '>=': 'greaterThanOrEqual',
  startswith: 'startsWith',
  contains: 'contains',
  // eslint-disable-next-line spellcheck/spell-checker
  notcontains: 'notContains',
  endswith: 'endsWith',
  between: 'between',
};

const FILTERING_TIMEOUT = 700;
const CORRECT_FILTER_RANGE_OVERLAY_WIDTH = 1;
const FILTER_ROW_CLASS = 'filter-row';
const FILTER_RANGE_OVERLAY_CLASS = 'filter-range-overlay';
const FILTER_RANGE_START_CLASS = 'filter-range-start';
const FILTER_RANGE_END_CLASS = 'filter-range-end';
const MENU_CLASS = 'dx-menu';
const EDITOR_WITH_MENU_CLASS = 'dx-editor-with-menu';
const EDITOR_CONTAINER_CLASS = 'dx-editor-container';
const EDITOR_CELL_CLASS = 'dx-editor-cell';
const FILTER_MENU = 'dx-filter-menu';
const APPLY_BUTTON_CLASS = 'dx-apply-button';
const HIGHLIGHT_OUTLINE_CLASS = 'dx-highlight-outline';
const FOCUSED_CLASS = 'dx-focused';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const FILTER_RANGE_CONTENT_CLASS = 'dx-filter-range-content';
const FILTER_MODIFIED_CLASS = 'dx-filter-modified';

const EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';

const BETWEEN_OPERATION_DATA_TYPES = ['date', 'datetime', 'number'];

const ARIA_SEARCH_BOX = messageLocalization.format('dxDataGrid-ariaSearchBox');

function isOnClickApplyFilterMode(that) {
  return that.option('filterRow.applyFilter') === 'onClick';
}

const getEditorInstance = function ($editorContainer) {
  const $editor = $editorContainer && $editorContainer.children();
  const componentNames = $editor && $editor.data('dxComponents');
  const editor = componentNames && componentNames.length && $editor.data(componentNames[0]);

  if (editor instanceof Editor) {
    return editor;
  }
  return null;
};

const ColumnHeadersViewFilterRowExtender = (function () {
  const getRangeTextByFilterValue = function (that, column) {
    let result = '';
    let rangeEnd = '';
    const filterValue = getColumnFilterValue(that, column);
    const formatOptions = gridCoreUtils.getFormatOptionsByColumn(column, 'filterRow');

    if (Array.isArray(filterValue)) {
      result = gridCoreUtils.formatValue(filterValue[0], formatOptions);
      rangeEnd = gridCoreUtils.formatValue(filterValue[1], formatOptions);

      if (rangeEnd !== '') {
        result += ` - ${rangeEnd}`;
      }
    } else if (isDefined(filterValue)) {
      result = gridCoreUtils.formatValue(filterValue, formatOptions);
    }

    return result;
  };

  function getColumnFilterValue(that, column) {
    if (column) {
      return isOnClickApplyFilterMode(that) && column.bufferedFilterValue !== undefined ? column.bufferedFilterValue : column.filterValue;
    }
  }

  const getColumnSelectedFilterOperation = function (that, column) {
    if (column) {
      return isOnClickApplyFilterMode(that) && column.bufferedSelectedFilterOperation !== undefined ? column.bufferedSelectedFilterOperation : column.selectedFilterOperation;
    }
  };

  const isValidFilterValue = function (filterValue, column) {
    if (column && BETWEEN_OPERATION_DATA_TYPES.includes(column.dataType) && Array.isArray(filterValue)) {
      return false;
    }

    return filterValue !== undefined;
  };

  const getFilterValue = function (that, columnIndex, $editorContainer) {
    const column = that._columnsController.columnOption(columnIndex);
    const filterValue = getColumnFilterValue(that, column);
    const isFilterRange = $editorContainer.closest(`.${that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS)}`).length;
    const isRangeStart = $editorContainer.hasClass(that.addWidgetPrefix(FILTER_RANGE_START_CLASS));

    if (filterValue && Array.isArray(filterValue) && getColumnSelectedFilterOperation(that, column) === 'between') {
      if (isRangeStart) {
        return filterValue[0];
      }
      return filterValue[1];
    }

    return !isFilterRange && isValidFilterValue(filterValue, column) ? filterValue : null;
  };

  const normalizeFilterValue = function (that, filterValue, column, $editorContainer) {
    if (getColumnSelectedFilterOperation(that, column) === 'between') {
      const columnFilterValue = getColumnFilterValue(that, column);
      if ($editorContainer.hasClass(that.addWidgetPrefix(FILTER_RANGE_START_CLASS))) {
        return [filterValue, Array.isArray(columnFilterValue) ? columnFilterValue[1] : undefined];
      }
      return [Array.isArray(columnFilterValue) ? columnFilterValue[0] : columnFilterValue, filterValue];
    }

    return filterValue;
  };

  const updateFilterValue = function (that, options) {
    const value = options.value === '' ? null : options.value;
    const $editorContainer = options.container;
    const column = that._columnsController.columnOption(options.column.index);
    const filterValue = getFilterValue(that, column.index, $editorContainer);

    if (!isDefined(filterValue) && !isDefined(value)) return;

    that._applyFilterViewController.setHighLight($editorContainer, filterValue !== value);

    const columnOptionName = isOnClickApplyFilterMode(that) ? 'bufferedFilterValue' : 'filterValue';
    const normalizedValue = normalizeFilterValue(that, value, column, $editorContainer);
    const isBetween = getColumnSelectedFilterOperation(that, column) === 'between';
    const notFireEvent = options.notFireEvent || isBetween && Array.isArray(normalizedValue) && normalizedValue.includes(undefined);
    that._columnsController.columnOption(column.index, columnOptionName, normalizedValue, notFireEvent);
  };

  return {
    _updateEditorValue(column, $editorContainer) {
      const that = this;
      const editor = getEditorInstance($editorContainer);

      editor && editor.option('value', getFilterValue(that, column.index, $editorContainer));
    },

    _columnOptionChanged(e) {
      const that = this;
      const { optionNames } = e;
      let $cell;
      let $editorContainer;
      let $editorRangeElements;
      let $menu;

      if (gridCoreUtils.checkChanges(optionNames, ['filterValue', 'bufferedFilterValue', 'selectedFilterOperation', 'bufferedSelectedFilterOperation', 'filterValues', 'filterType']) && e.columnIndex !== undefined) {
        const visibleIndex = that._columnsController.getVisibleIndex(e.columnIndex);
        const column = that._columnsController.columnOption(e.columnIndex);
        // @ts-expect-error
        $cell = that._getCellElement(that.element().find(`.${that.addWidgetPrefix(FILTER_ROW_CLASS)}`).index(), visibleIndex) || $();
        $editorContainer = $cell.find(`.${EDITOR_CONTAINER_CLASS}`).first();

        if (optionNames.filterValue || optionNames.bufferedFilterValue) {
          that._updateEditorValue(column, $editorContainer);

          const overlayInstance = $cell.find(`.${that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS)}`).data('dxOverlay');
          if (overlayInstance) {
            $editorRangeElements = overlayInstance.$content().find(`.${EDITOR_CONTAINER_CLASS}`);

            that._updateEditorValue(column, $editorRangeElements.first());
            that._updateEditorValue(column, $editorRangeElements.last());
          }
          if (!overlayInstance || !overlayInstance.option('visible')) {
            that._updateFilterRangeContent($cell, getRangeTextByFilterValue(that, column));
          }
        }
        if (optionNames.selectedFilterOperation || optionNames.bufferedSelectedFilterOperation) {
          if (visibleIndex >= 0 && column) {
            $menu = $cell.find(`.${MENU_CLASS}`);

            if ($menu.length) {
              that._updateFilterOperationChooser($menu, column, $editorContainer);

              if (getColumnSelectedFilterOperation(that, column) === 'between') {
                that._renderFilterRangeContent($cell, column);
              } else if ($editorContainer.find(`.${FILTER_RANGE_CONTENT_CLASS}`).length) {
                that._renderEditor($editorContainer, that._getEditorOptions($editorContainer, column));
                that._hideFilterRange();
              }
            }
          }
        }
        return;
      }

      that.callBase(e);
    },

    _renderCore() {
      this._filterRangeOverlayInstance = null;
      return this.callBase.apply(this, arguments);
    },

    _resizeCore() {
      this.callBase.apply(this, arguments);
      this._filterRangeOverlayInstance && this._filterRangeOverlayInstance.repaint();
    },

    isFilterRowVisible() {
      return this._isElementVisible(this.option('filterRow'));
    },

    isVisible() {
      return this.callBase() || this.isFilterRowVisible();
    },

    init() {
      this.callBase();
      this._applyFilterViewController = this.getController('applyFilter');
    },

    _initFilterRangeOverlay($cell, column) {
      const that = this;
      const sharedData = {};
      const $editorContainer = $cell.find('.dx-editor-container');
      const filterRangeOverlayClass = that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS);
      const $overlay = $('<div>').addClass(filterRangeOverlayClass).appendTo($cell);

      return that._createComponent($overlay, Overlay, {
        height: 'auto',
        shading: false,
        showTitle: false,
        focusStateEnabled: false,
        hideOnOutsideClick: true,
        wrapperAttr: { class: filterRangeOverlayClass },
        animation: false,
        position: {
          my: 'top',
          at: 'top',
          of: $editorContainer.length && $editorContainer || $cell,
          offset: '0 -1',
        },
        contentTemplate(contentElement) {
          let editorOptions;
          let $editor = $('<div>').addClass(`${EDITOR_CONTAINER_CLASS} ${that.addWidgetPrefix(FILTER_RANGE_START_CLASS)}`).appendTo(contentElement);

          column = that._columnsController.columnOption(column.index);
          editorOptions = that._getEditorOptions($editor, column);
          editorOptions.sharedData = sharedData;
          that._renderEditor($editor, editorOptions);
          eventsEngine.on($editor.find(EDITORS_INPUT_SELECTOR), 'keydown', (e) => {
            let $prevElement = $cell.find('[tabindex]').not(e.target).first();

            if (normalizeKeyName(e) === 'tab' && e.shiftKey) {
              e.preventDefault();
              that._hideFilterRange();

              if (!$prevElement.length) {
                $prevElement = $cell.prev().find('[tabindex]').last();
              }
              // @ts-expect-error
              eventsEngine.trigger($prevElement, 'focus');
            }
          });

          $editor = $('<div>').addClass(`${EDITOR_CONTAINER_CLASS} ${that.addWidgetPrefix(FILTER_RANGE_END_CLASS)}`).appendTo(contentElement);
          editorOptions = that._getEditorOptions($editor, column);

          editorOptions.sharedData = sharedData;
          that._renderEditor($editor, editorOptions);
          eventsEngine.on($editor.find(EDITORS_INPUT_SELECTOR), 'keydown', (e) => {
            if (normalizeKeyName(e) === 'tab' && !e.shiftKey) {
              e.preventDefault();
              that._hideFilterRange();
              // @ts-expect-error
              eventsEngine.trigger($cell.next().find('[tabindex]').first(), 'focus');
            }
          });

          return $(contentElement).addClass(that.getWidgetContainerClass());
        },
        onShown(e) {
          const $editor = e.component.$content().find(`.${EDITOR_CONTAINER_CLASS}`).first();
          // @ts-expect-error
          eventsEngine.trigger($editor.find(EDITORS_INPUT_SELECTOR), 'focus');
        },
        onHidden() {
          column = that._columnsController.columnOption(column.index);

          $cell.find(`.${MENU_CLASS}`).parent().addClass(EDITOR_WITH_MENU_CLASS);
          if (getColumnSelectedFilterOperation(that, column) === 'between') {
            that._updateFilterRangeContent($cell, getRangeTextByFilterValue(that, column));
            that.component.updateDimensions();
          }
        },
      });
    },

    _updateFilterRangeOverlay(options) {
      const overlayInstance = this._filterRangeOverlayInstance;

      overlayInstance && overlayInstance.option(options);
    },

    _showFilterRange($cell, column) {
      const that = this;
      const $overlay = $cell.children(`.${that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS)}`);
      let overlayInstance = $overlay.length && $overlay.data('dxOverlay');

      if (!overlayInstance && column) {
        overlayInstance = that._initFilterRangeOverlay($cell, column);
      }

      if (!overlayInstance.option('visible')) {
        that._filterRangeOverlayInstance && that._filterRangeOverlayInstance.hide();
        that._filterRangeOverlayInstance = overlayInstance;

        that._updateFilterRangeOverlay({ width: getOuterWidth($cell, true) + CORRECT_FILTER_RANGE_OVERLAY_WIDTH });
        that._filterRangeOverlayInstance && that._filterRangeOverlayInstance.show();
      }
    },

    _hideFilterRange() {
      const overlayInstance = this._filterRangeOverlayInstance;

      overlayInstance && overlayInstance.hide();
    },

    getFilterRangeOverlayInstance() {
      return this._filterRangeOverlayInstance;
    },

    _createRow(row) {
      const $row = this.callBase(row);

      if (row.rowType === 'filter') {
        $row.addClass(this.addWidgetPrefix(FILTER_ROW_CLASS));

        if (!this.option('useLegacyKeyboardNavigation')) {
          eventsEngine.on($row, 'keydown', (event) => selectView('filterRow', this, event));
        }
      }

      return $row;
    },

    _getRows() {
      const result = this.callBase();

      if (this.isFilterRowVisible()) {
        result.push({ rowType: 'filter' });
      }

      return result;
    },

    _renderFilterCell(cell, options) {
      const that = this;
      const { column } = options;
      const $cell = $(cell);

      if (that.component.option('showColumnHeaders')) {
        that.setAria('describedby', column.headerId, $cell);
      }
      that.setAria('label', messageLocalization.format('dxDataGrid-ariaFilterCell'), $cell);

      $cell.addClass(EDITOR_CELL_CLASS);
      const $container = $('<div>').appendTo($cell);
      const $editorContainer = $('<div>').addClass(EDITOR_CONTAINER_CLASS).appendTo($container);

      if (getColumnSelectedFilterOperation(that, column) === 'between') {
        that._renderFilterRangeContent($cell, column);
      } else {
        const editorOptions = that._getEditorOptions($editorContainer, column);
        that._renderEditor($editorContainer, editorOptions);
      }

      const { alignment } = column;
      if (alignment && alignment !== 'center') {
        $cell.find(EDITORS_INPUT_SELECTOR).first().css('textAlign', column.alignment);
      }

      if (column.filterOperations && column.filterOperations.length) {
        that._renderFilterOperationChooser($container, column, $editorContainer);
      }
    },

    _renderCellContent($cell, options) { // TODO _getCellTemplate
      const that = this;
      const { column } = options;

      if (options.rowType === 'filter') {
        if (column.command) {
          $cell.html('&nbsp;');
        } else if (column.allowFiltering) {
          that.renderTemplate($cell, that._renderFilterCell.bind(that), options).done(() => {
            that._updateCell($cell, options);
          });
          return;
        }
      }

      this.callBase.apply(this, arguments);
    },

    _getEditorOptions($editorContainer, column) {
      const that = this;
      const accessibilityOptions = {
        editorOptions: {
          inputAttr: that._getFilterInputAccessibilityAttributes(column),
        },
      };
      const result = extend(accessibilityOptions, column, {
        value: getFilterValue(that, column.index, $editorContainer),
        parentType: 'filterRow',
        showAllText: that.option('filterRow.showAllText'),
        updateValueTimeout: that.option('filterRow.applyFilter') === 'onClick' ? 0 : FILTERING_TIMEOUT,
        width: null,
        setValue(value, notFireEvent) {
          updateFilterValue(that, {
            column,
            value,
            container: $editorContainer,
            notFireEvent,
          });
        },
      });

      if (getColumnSelectedFilterOperation(that, column) === 'between') {
        if ($editorContainer.hasClass(that.addWidgetPrefix(FILTER_RANGE_START_CLASS))) {
          result.placeholder = that.option('filterRow.betweenStartText');
        } else {
          result.placeholder = that.option('filterRow.betweenEndText');
        }
      }

      return result;
    },
    _getFilterInputAccessibilityAttributes(column) {
      const columnAriaLabel = messageLocalization.format('dxDataGrid-ariaFilterCell');
      if (this.component.option('showColumnHeaders')) {
        return {
          'aria-label': columnAriaLabel,
          'aria-describedby': column.headerId,
        };
      }
      return { 'aria-label': columnAriaLabel };
    },

    _renderEditor($editorContainer, options) {
      $editorContainer.empty();
      const $element = $('<div>').appendTo($editorContainer);
      const editorController = this.getController('editorFactory');
      const dataSource = this.getController('data').dataSource();
      const filterRowController = this.getController('applyFilter');

      if (options.lookup && this.option('syncLookupFilterValues')) {
        filterRowController.setCurrentColumnForFiltering(options);
        const filter = this.getController('data').getCombinedFilter();
        filterRowController.setCurrentColumnForFiltering(null);

        const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(options, dataSource, filter);
        const lookupOptions = {
          ...options,
          lookup: {
            ...options.lookup,
            dataSource: lookupDataSource,
          },
        };
        return editorController.createEditor($element, lookupOptions);
      }
      return editorController.createEditor($element, options);
    },

    _renderFilterRangeContent($cell, column) {
      const that = this;
      const $editorContainer = $cell.find(`.${EDITOR_CONTAINER_CLASS}`).first();

      $editorContainer.empty();
      const $filterRangeContent = $('<div>')
        .addClass(FILTER_RANGE_CONTENT_CLASS)
        .attr('tabindex', this.option('tabIndex'));

      eventsEngine.on($filterRangeContent, 'focusin', () => {
        that._showFilterRange($cell, column);
      });

      $filterRangeContent.appendTo($editorContainer);

      that._updateFilterRangeContent($cell, getRangeTextByFilterValue(that, column));
    },

    _updateFilterRangeContent($cell, value) {
      const $filterRangeContent = $cell.find(`.${FILTER_RANGE_CONTENT_CLASS}`);

      if ($filterRangeContent.length) {
        if (value === '') {
          $filterRangeContent.html('&nbsp;');
        } else {
          $filterRangeContent.text(value);
        }
      }
    },

    _updateFilterOperationChooser($menu, column, $editorContainer) {
      const that = this;
      let isCellWasFocused;
      const restoreFocus = function () {
        const menu = Menu.getInstance($menu);
        menu && menu.option('focusedElement', null);
        isCellWasFocused && that._focusEditor($editorContainer);
      };

      that._createComponent($menu, Menu, {
        integrationOptions: {},
        activeStateEnabled: false,
        selectionMode: 'single',
        cssClass: `${that.getWidgetContainerClass()} ${CELL_FOCUS_DISABLED_CLASS} ${FILTER_MENU}`,
        showFirstSubmenuMode: 'onHover',
        hideSubmenuOnMouseLeave: true,
        elementAttr: { 'aria-label': ARIA_SEARCH_BOX },
        items: [{
          disabled: !(column.filterOperations && column.filterOperations.length),
          icon: OPERATION_ICONS[getColumnSelectedFilterOperation(that, column) || 'default'],
          selectable: false,
          items: that._getFilterOperationMenuItems(column),
        }],
        onItemClick(properties) {
          const selectedFilterOperation = properties.itemData.name;
          const columnSelectedFilterOperation = getColumnSelectedFilterOperation(that, column);
          let notFocusEditor = false;
          const isOnClickMode = isOnClickApplyFilterMode(that);
          const options = {};

          if (properties.itemData.items || (selectedFilterOperation && selectedFilterOperation === columnSelectedFilterOperation)) {
            return;
          }

          if (selectedFilterOperation) {
            options[isOnClickMode ? 'bufferedSelectedFilterOperation' : 'selectedFilterOperation'] = selectedFilterOperation;

            if (selectedFilterOperation === 'between' || columnSelectedFilterOperation === 'between') {
              notFocusEditor = selectedFilterOperation === 'between';
              options[isOnClickMode ? 'bufferedFilterValue' : 'filterValue'] = null;
            }
          } else {
            options[isOnClickMode ? 'bufferedFilterValue' : 'filterValue'] = null;
            options[isOnClickMode ? 'bufferedSelectedFilterOperation' : 'selectedFilterOperation'] = column.defaultSelectedFilterOperation || null;
          }

          that._columnsController.columnOption(column.index, options);
          that._applyFilterViewController.setHighLight($editorContainer, true);

          if (!selectedFilterOperation) {
            const editor = getEditorInstance($editorContainer);
            // @ts-expect-error
            if (editor && editor.NAME === 'dxDateBox' && !editor.option('isValid')) {
              editor.reset();
              editor.option('isValid', true);
            }
          }

          if (!notFocusEditor) {
            that._focusEditor($editorContainer);
          } else {
            that._showFilterRange($editorContainer.closest(`.${EDITOR_CELL_CLASS}`), column);
          }
        },
        onSubmenuShowing() {
          isCellWasFocused = that._isEditorFocused($editorContainer);
          that.getController('editorFactory').loseFocus();
        },
        onSubmenuHiding() {
          // @ts-expect-error
          eventsEngine.trigger($menu, 'blur');
          restoreFocus();
        },
        onContentReady(e) {
          eventsEngine.on($menu, 'blur', () => {
            const menu = e.component;
            menu._hideSubmenuAfterTimeout();
            restoreFocus();
          });
        },
        rtlEnabled: that.option('rtlEnabled'),
      });
    },

    _isEditorFocused($container) {
      return $container.hasClass(FOCUSED_CLASS) || $container.parents(`.${FOCUSED_CLASS}`).length;
    },

    _focusEditor($container) {
      this.getController('editorFactory').focus($container);
      // @ts-expect-error
      eventsEngine.trigger($container.find(EDITORS_INPUT_SELECTOR), 'focus');
    },

    _renderFilterOperationChooser($container, column, $editorContainer) {
      const that = this;
      let $menu;

      if (that.option('filterRow.showOperationChooser')) {
        $container.addClass(EDITOR_WITH_MENU_CLASS);
        $menu = $('<div>').prependTo($container);
        that._updateFilterOperationChooser($menu, column, $editorContainer);
      }
    },

    _getFilterOperationMenuItems(column) {
      const that = this;
      let result = [{}];
      const filterRowOptions = that.option('filterRow');
      const operationDescriptions = filterRowOptions && filterRowOptions.operationDescriptions || {};

      if (column.filterOperations && column.filterOperations.length) {
        const availableFilterOperations = column.filterOperations.filter((value) => isDefined(OPERATION_DESCRIPTORS[value]));
        result = map(availableFilterOperations, (value) => {
          const descriptionName = OPERATION_DESCRIPTORS[value];

          return {
            name: value,
            selected: (getColumnSelectedFilterOperation(that, column) || column.defaultFilterOperation) === value,
            text: operationDescriptions[descriptionName],
            icon: OPERATION_ICONS[value],
          };
        });

        result.push({
          name: null,
          text: filterRowOptions && filterRowOptions.resetOperationText,
          icon: OPERATION_ICONS.default,
        });
      }

      return result;
    },

    _handleDataChanged(e) {
      this.callBase.apply(this, arguments);

      if (e.operationTypes?.filtering || e.operationTypes?.fullReload) {
        this.updateLookupDataSource(e.operationTypes?.filtering);
      }
    },

    updateLookupDataSource(filterChanged) {
      if (!this.option('syncLookupFilterValues')) {
        return;
      }

      if (!this.element()) {
        return;
      }

      const columns = this._columnsController.getVisibleColumns();
      const dataSource = this._dataController.dataSource();
      const applyFilterViewController = this._applyFilterViewController;
      const rowIndex = this.element().find(`.${this.addWidgetPrefix(FILTER_ROW_CLASS)}`).index();

      if (rowIndex === -1) {
        return;
      }

      columns.forEach((column, index) => {
        if (!column.lookup || column.calculateCellValue !== column.defaultCalculateCellValue) {
          return;
        }

        const $cell = this._getCellElement(rowIndex, index);
        const editor = getEditorInstance($cell?.find('.dx-editor-container'));

        if (editor) {
          applyFilterViewController.setCurrentColumnForFiltering(column);
          const filter = this._dataController.getCombinedFilter() || null;
          applyFilterViewController.setCurrentColumnForFiltering(null);

          const editorDataSource = editor.option('dataSource');
          const shouldUpdateFilter = !filterChanged
                        || !equalByValue(editorDataSource.__dataGridSourceFilter, filter);

          if (shouldUpdateFilter) {
            const lookupDataSource = gridCoreUtils.getWrappedLookupDataSource(column, dataSource, filter);
            editor.option('dataSource', lookupDataSource);
          }
        }
      });
    },

    optionChanged(args) {
      const that = this;

      switch (args.name) {
        case 'filterRow':
        case 'showColumnLines':
          this._invalidate(true, true);
          args.handled = true;
          break;
        case 'syncLookupFilterValues':
          if (args.value) {
            this.updateLookupDataSource();
          } else {
            this.render();
          }
          args.handled = true;
          break;
        default:
          that.callBase(args);
          break;
      }
    },
  };
}());

const DataControllerFilterRowExtender = {
  skipCalculateColumnFilters() {
    return false;
  },

  _calculateAdditionalFilter() {
    if (this.skipCalculateColumnFilters()) {
      return this.callBase();
    }

    const filters = [this.callBase()];
    const columns = this._columnsController.getVisibleColumns(null, true);
    const filterRowController = this.getController('applyFilter');

    each(columns, function () {
      const shouldSkip = filterRowController.getCurrentColumnForFiltering()?.index === this.index;
      if (this.allowFiltering && this.calculateFilterExpression && isDefined(this.filterValue) && !shouldSkip) {
        const filter = this.createFilterExpression(this.filterValue, this.selectedFilterOperation || this.defaultFilterOperation, 'filterRow');
        filters.push(filter);
      }
    });

    return gridCoreUtils.combineFilters(filters);
  },
};

const ApplyFilterViewController = modules.ViewController.inherit({
  _getHeaderPanel() {
    if (!this._headerPanel) {
      this._headerPanel = this.getView('headerPanel');
    }
    return this._headerPanel;
  },

  setHighLight($element, value) {
    if (isOnClickApplyFilterMode(this)) {
      $element
            && $element.toggleClass(HIGHLIGHT_OUTLINE_CLASS, value)
            && $element.closest(`.${EDITOR_CELL_CLASS}`).toggleClass(FILTER_MODIFIED_CLASS, value);
      this._getHeaderPanel().enableApplyButton(value);
    }
  },

  applyFilter() {
    const columnsController = this.getController('columns');
    const columns = columnsController.getColumns();

    columnsController.beginUpdate();
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.bufferedFilterValue !== undefined) {
        columnsController.columnOption(i, 'filterValue', column.bufferedFilterValue);
        column.bufferedFilterValue = undefined;
      }
      if (column.bufferedSelectedFilterOperation !== undefined) {
        columnsController.columnOption(i, 'selectedFilterOperation', column.bufferedSelectedFilterOperation);
        column.bufferedSelectedFilterOperation = undefined;
      }
    }
    columnsController.endUpdate();
    this.removeHighLights();
  },

  removeHighLights() {
    if (isOnClickApplyFilterMode(this)) {
      const columnHeadersViewElement = this.getView('columnHeadersView').element();
      columnHeadersViewElement.find(`.${this.addWidgetPrefix(FILTER_ROW_CLASS)} .${HIGHLIGHT_OUTLINE_CLASS}`).removeClass(HIGHLIGHT_OUTLINE_CLASS);
      columnHeadersViewElement.find(`.${this.addWidgetPrefix(FILTER_ROW_CLASS)} .${FILTER_MODIFIED_CLASS}`).removeClass(FILTER_MODIFIED_CLASS);
      this._getHeaderPanel().enableApplyButton(false);
    }
  },

  setCurrentColumnForFiltering(column) {
    this._currentColumn = column;
  },

  getCurrentColumnForFiltering() {
    return this._currentColumn;
  },
});

export const filterRowModule = {
  defaultOptions() {
    return {
      syncLookupFilterValues: true,
      filterRow: {
        visible: false,
        showOperationChooser: true,
        showAllText: messageLocalization.format('dxDataGrid-filterRowShowAllText'),
        resetOperationText: messageLocalization.format('dxDataGrid-filterRowResetOperationText'),
        applyFilter: 'auto',
        applyFilterText: messageLocalization.format('dxDataGrid-applyFilterText'),
        operationDescriptions: {
          equal: messageLocalization.format('dxDataGrid-filterRowOperationEquals'),
          notEqual: messageLocalization.format('dxDataGrid-filterRowOperationNotEquals'),
          lessThan: messageLocalization.format('dxDataGrid-filterRowOperationLess'),
          lessThanOrEqual: messageLocalization.format('dxDataGrid-filterRowOperationLessOrEquals'),
          greaterThan: messageLocalization.format('dxDataGrid-filterRowOperationGreater'),
          greaterThanOrEqual: messageLocalization.format('dxDataGrid-filterRowOperationGreaterOrEquals'),
          startsWith: messageLocalization.format('dxDataGrid-filterRowOperationStartsWith'),
          contains: messageLocalization.format('dxDataGrid-filterRowOperationContains'),
          notContains: messageLocalization.format('dxDataGrid-filterRowOperationNotContains'),

          endsWith: messageLocalization.format('dxDataGrid-filterRowOperationEndsWith'),
          between: messageLocalization.format('dxDataGrid-filterRowOperationBetween'),
          isBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsBlank'),
          isNotBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsNotBlank'),
        },
        betweenStartText: messageLocalization.format('dxDataGrid-filterRowOperationBetweenStartText'),
        betweenEndText: messageLocalization.format('dxDataGrid-filterRowOperationBetweenEndText'),
      },
    };
  },
  controllers: {
    applyFilter: ApplyFilterViewController,
  },
  extenders: {
    controllers: {
      data: DataControllerFilterRowExtender,
      columnsResizer: {
        _startResizing() {
          const that = this;

          that.callBase.apply(that, arguments);

          if (that.isResizing()) {
            const overlayInstance = that._columnHeadersView.getFilterRangeOverlayInstance();

            if (overlayInstance) {
              const cellIndex = overlayInstance.$element().closest('td').index();

              if (cellIndex === that._targetPoint.columnIndex || cellIndex === that._targetPoint.columnIndex + 1) {
                overlayInstance.$content().hide();
              }
            }
          }
        },

        _endResizing() {
          const that = this;
          let $cell;

          if (that.isResizing()) {
            const overlayInstance = that._columnHeadersView.getFilterRangeOverlayInstance();

            if (overlayInstance) {
              $cell = overlayInstance.$element().closest('td');
              that._columnHeadersView._updateFilterRangeOverlay({ width: getOuterWidth($cell, true) + CORRECT_FILTER_RANGE_OVERLAY_WIDTH });
              overlayInstance.$content().show();
            }
          }

          that.callBase.apply(that, arguments);
        },
      },
      editing: {
        updateFieldValue(options) {
          if (options.column.lookup) {
            this._needUpdateLookupDataSource = true;
          }

          return this.callBase.apply(this, arguments);
        },
        _afterSaveEditData(cancel) {
          if (this._needUpdateLookupDataSource && !cancel) {
            this.getView('columnHeadersView')?.updateLookupDataSource();
          }
          this._needUpdateLookupDataSource = false;

          return this.callBase.apply(this, arguments);
        },
        _afterCancelEditData() {
          this._needUpdateLookupDataSource = false;
          return this.callBase.apply(this, arguments);
        },
      },
    },
    views: {
      columnHeadersView: ColumnHeadersViewFilterRowExtender,
      headerPanel: {
        _getToolbarItems() {
          const items = this.callBase();
          const filterItem = this._prepareFilterItem(items);

          return filterItem.concat(items);
        },

        _prepareFilterItem() {
          const that = this;
          const filterItem: object[] = [];

          if (that._isShowApplyFilterButton()) {
            const hintText = that.option('filterRow.applyFilterText');
            const columns = that._columnsController.getColumns();
            const disabled = !columns.filter((column) => column.bufferedFilterValue !== undefined).length;
            const onInitialized = function (e) {
              $(e.element).addClass(that._getToolbarButtonClass(APPLY_BUTTON_CLASS));
            };
            const onClickHandler = function () {
              that._applyFilterViewController.applyFilter();
            };
            const toolbarItem = {
              widget: 'dxButton',
              options: {
                icon: 'apply-filter',
                disabled,
                onClick: onClickHandler,
                hint: hintText,
                text: hintText,
                onInitialized,
              },
              showText: 'inMenu',
              name: 'applyFilterButton',
              location: 'after',
              locateInMenu: 'auto',
              sortIndex: 10,
            };

            filterItem.push(toolbarItem);
          }

          return filterItem;
        },

        _isShowApplyFilterButton() {
          const filterRowOptions = this.option('filterRow');
          return filterRowOptions && filterRowOptions.visible && filterRowOptions.applyFilter === 'onClick';
        },

        init() {
          this.callBase();
          this._dataController = this.getController('data');
          this._applyFilterViewController = this.getController('applyFilter');
        },

        enableApplyButton(value) {
          this.setToolbarItemDisabled('applyFilterButton', !value);
        },

        isVisible() {
          return this.callBase() || this._isShowApplyFilterButton();
        },

        optionChanged(args) {
          if (args.name === 'filterRow') {
            this._invalidate();
            args.handled = true;
          } else {
            this.callBase(args);
          }
        },
      },
    },
  },
};
