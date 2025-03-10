import $ from 'jquery';
import devices from 'core/devices';
import { isDefined } from 'core/utils/type.js';
import { deserializeDate } from 'core/utils/date_serialization';
import FileSystemItem from 'file_management/file_system_item';

import FileReaderMock from './fileManager/file_reader.mock.js';

export const Consts = {
    WIDGET_CLASS: 'dx-filemanager',
    WIDGET_WRAPPER_CLASS: 'dx-filemanager-wrapper',
    TOOLBAR_CLASS: 'dx-filemanager-toolbar',
    NATIVE_TOOLBAR_CLASS: 'dx-toolbar',
    GENERAL_TOOLBAR_CLASS: 'dx-filemanager-general-toolbar',
    FILE_TOOLBAR_CLASS: 'dx-filemanager-file-toolbar',
    CONTAINER_CLASS: 'dx-filemanager-container',
    DRAWER_WRAPPER_CLASS: 'dx-drawer-wrapper',
    DRAWER_PANEL_CONTENT_CLASS: 'dx-drawer-panel-content',
    DRAWER_CONTENT_CLASS: 'dx-drawer-content',
    DRAWER_MODE_SHRINK: 'dx-drawer-shrink',
    DRAWER_MODE_OVERLAP: 'dx-drawer-overlap',
    NOTIFICATION_DRAWER_CLASS: 'dx-filemanager-notification-drawer',
    NOTIFICATION_DRAWER_PANEL_CLASS: 'dx-filemanager-notification-drawer-panel',
    ADAPTIVITY_DRAWER_PANEL_CLASS: 'dx-filemanager-adaptivity-drawer-panel',
    PROGRESS_PANEL_CLASS: 'dx-filemanager-progress-panel',
    PROGRESS_PANEL_TITLE_CLASS: 'dx-filemanager-progress-panel-title',
    PROGRESS_PANEL_CONTAINER_CLASS: 'dx-filemanager-progress-panel-container',
    PROGRESS_PANEL_INFOS_CONTAINER_CLASS: 'dx-filemanager-progress-panel-infos-container',
    DIRS_PANEL_CLASS: 'dx-filemanager-dirs-panel',
    DIRS_TREE_CLASS: 'dx-filemanager-dirs-tree',
    ITEMS_VIEW_CLASS: 'dx-filemanager-files-view',
    DIALOG_CLASS: 'dx-filemanager-dialog',
    THUMBNAILS_VIEW_CLASS: 'dx-filemanager-thumbnails',
    THUMBNAILS_VIEW_PORT_CLASS: 'dx-filemanager-thumbnails-view-port',
    THUMBNAILS_ITEM_CLASS: 'dx-filemanager-thumbnails-item',
    THUMBNAILS_ITEM_NAME_CLASS: 'dx-filemanager-thumbnails-item-name',
    THUMBNAILS_ITEM_SPACER_CLASS: 'dx-filemanager-thumbnails-item-spacer',
    THUMBNAILS_ITEM_THUMBNAIL_CLASS: 'dx-filemanager-thumbnails-item-thumbnail',
    THUMBNAILS_ITEM_CONTENT_CLASS: 'dx-filemanager-thumbnails-item-content',
    GRID_DATA_ROW_CLASS: 'dx-data-row',
    FILE_ACTION_BUTTON_CLASS: 'dx-filemanager-file-actions-button',
    FOLDERS_TREE_VIEW_ITEM_CLASS: 'dx-treeview-item',
    FOLDERS_TREE_VIEW_ITEM_TOGGLE_CLASS: 'dx-treeview-toggle-item-visibility',
    FOLDERS_TREE_VIEW_ITEM_TOGGLE_OPENED_CLASS: 'dx-treeview-toggle-item-visibility-opened',
    BREADCRUMBS_CLASS: 'dx-filemanager-breadcrumbs',
    BREADCRUMBS_PARENT_DIRECOTRY_ITEM_CLASS: 'dx-filemanager-breadcrumbs-parent-folder-item',
    BREADCRUMBS_SEPARATOR_ITEM_CLASS: 'dx-filemanager-breadcrumbs-separator-item',
    ITEMS_PANEL_CLASS: 'dx-filemanager-items-panel',
    FOCUSED_ITEM_CLASS: 'dx-filemanager-focused-item',
    CUSTOM_THUMBNAIL_CLASS: 'dx-filemanager-item-custom-thumbnail',
    TOOLBAR_SEPARATOR_ITEM_CLASS: 'dx-filemanager-toolbar-separator-item',
    TOOLBAR_VIEWMODE_ITEM_CLASS: 'dx-filemanager-toolbar-viewmode-item',
    TOOLBAR_HAS_LARGE_ICON_CLASS: 'dx-filemanager-toolbar-has-large-icon',
    TOOLBAR_ITEM_CLASS: 'dx-toolbar-item',
    TOOLBAR_ITEM_WITH_HIDDEN_TEXT_CLASS: 'dx-toolbar-text-auto-hide',
    TOOLBAR_REFRESH_ITEM_ICON_CLASS: 'dx-filemanager-i',
    TOOLBAR_REFRESH_ICON_MAP: {
        default: 'dx-filemanager-i dx-filemanager-i-refresh',
        progress: 'dx-filemanager-i dx-filemanager-i-progress',
        success: 'dx-filemanager-i dx-filemanager-i-done',
        error: 'dx-filemanager-i dx-filemanager-i-danger'
    },
    DETAILS_VIEW_CLASS: 'dx-filemanager-details',
    DETAILS_ITEM_NAME_CLASS: 'dx-filemanager-details-item-name',
    FOLDER_CHOOSER_DIALOG_CLASS: 'dx-filemanager-dialog-folder-chooser-popup',
    NAME_EDITOR_DIALOG_CLASS: 'dx-filemanager-dialog-name-editor-popup',
    DELETE_ITEM_DIALOG_CLASS: 'dx-filemanager-dialog-delete-item-popup',
    NOTIFICATION_POPUP_CLASS: 'dx-filemanager-notification-popup',
    POPUP_NORMAL_CLASS: 'dx-popup-normal',
    POPUP_BOTTOM_CLASS: 'dx-popup-bottom',
    BUTTON_CLASS: 'dx-button',
    BUTTON_HAS_TEXT_CLASS: 'dx-button-has-text',
    BUTTON_TEXT_CLASS: 'dx-button-text',
    BUTTON_OUTLINED_CLASS: 'dx-button-mode-outlined',
    DROP_DOWN_BUTTON_CLASS: 'dx-dropdownbutton',
    DROP_DOWN_BUTTON_ACTION_CLASS: 'dx-dropdownbutton-action',
    TEXT_EDITOR_INPUT_CLASS: 'dx-texteditor-input',
    MENU_ITEM_WITH_TEXT_CLASS: 'dx-menu-item-has-text',
    MENU_ITEM_SELECTED_CLASS: 'dx-menu-item-selected',
    CONTEXT_MENU_CLASS: 'dx-context-menu',
    MENU_ITEM_CLASS: 'dx-menu-item',
    MENU_ITEM_WITH_SUBMENU_CLASS: 'dx-menu-item-has-submenu',
    SUBMENU_CLASS: 'dx-submenu',
    CONTEXT_MENU_SEPARATOR_CLASS: 'dx-menu-separator',
    SELECTION_CLASS: 'dx-selection',
    ITEM_SELECTED_CLASS: 'dx-item-selected',
    FOCUSED_ROW_CLASS: 'dx-row-focused',
    SPLITTER_WRAPPER_CLASS: 'dx-splitter-wrapper',
    SPLITTER_CLASS: 'dx-splitter',
    FOCUSED_STATE_CLASS: 'dx-state-focused',
    DISABLED_STATE_CLASS: 'dx-state-disabled',
    READONLY_STATE_CLASS: 'dx-state-readonly',
    UPLOAD_ICON_CLASS: 'dx-icon-upload',
    DROPDOWN_MENU_BUTTON_CLASS: 'dx-dropdownmenu-button',
    DROPDOWN_MENU_LIST_CLASS: 'dx-dropdownmenu-list',
    DROPDOWN_MENU_CONTENT_CLASS: 'dx-scrollview-content',
    DROPDOWN_MENU_LIST_ITEM_CLASS: 'dx-list-item',
    SCROLLABLE_ClASS: 'dx-scrollable',
    SCROLLABLE_CONTAINER_ClASS: 'dx-scrollable-container',
    EDITING_CONTAINER: 'dx-filemanager-editing-container',
    FILE_UPLOADER_INPUT: 'dx-fileuploader-input',
    FILE_UPLOADER_DROPZONE_PLACEHOLER_CLASS: 'dx-filemanager-fileuploader-dropzone-placeholder',
    OVERLAY_SHADER_CLASS: 'dx-overlay-shader'
};
const showMoreButtonText = '\u22EE';

export class FileManagerWrapper {

    constructor($element) {
        this._$element = $element;
    }

    getInstance() {
        return this._$element.dxFileManager('instance');
    }

    getDirsPanel() {
        return this._$element.find(`.${Consts.DIRS_PANEL_CLASS}`);
    }

    getDirsTree() {
        return this.getDirsPanel().find(` .${Consts.DIRS_TREE_CLASS}`);
    }

    getItemsView() {
        return this._$element.find(`.${Consts.ITEMS_VIEW_CLASS}`);
    }

    getItemsViewPanel() {
        return this._$element.find(`.${Consts.ITEMS_PANEL_CLASS}`);
    }

    getFolderNodes(inDialog) {
        if(inDialog) {
            return this.getFolderChooserDialog().find(`.${Consts.DIALOG_CLASS} .${Consts.FOLDERS_TREE_VIEW_ITEM_CLASS}`);
        }
        return this._$element.find(`.${Consts.CONTAINER_CLASS} .${Consts.FOLDERS_TREE_VIEW_ITEM_CLASS}`);
    }

    getFolderNode(index, inDialog) {
        return this.getFolderNodes(inDialog).eq(index);
    }

    getFolderNodeText(index, inDialog) {
        const text = this.getFolderNode(index, inDialog).text() || '';
        return text.replace(showMoreButtonText, '');
    }

    getFolderToggles(inDialog) {
        if(inDialog) {
            return this.getFolderChooserDialog().find(`.${Consts.DIALOG_CLASS} .${Consts.FOLDERS_TREE_VIEW_ITEM_TOGGLE_CLASS}`);
        }
        return this._$element.find(`.${Consts.CONTAINER_CLASS} .${Consts.FOLDERS_TREE_VIEW_ITEM_TOGGLE_CLASS}`);
    }

    getFolderToggle(index, inDialog) {
        return this.getFolderToggles(inDialog).eq(index);
    }

    isFolderNodeToggleOpened(text, inDialog) {
        let result = null;
        const targetNode = this.getFolderNodes(inDialog).filter(function() { return $(this).text() === text; }).eq(0).parent();
        if(targetNode.length) {
            const itemToggle = targetNode.children(`.${Consts.FOLDERS_TREE_VIEW_ITEM_TOGGLE_CLASS}`);
            if(itemToggle.length) {
                result = itemToggle.hasClass(Consts.FOLDERS_TREE_VIEW_ITEM_TOGGLE_OPENED_CLASS);
            }
        }
        return result;
    }

    getTreeViewScrollableContainer() {
        return this.getDirsTree().find(`.${Consts.SCROLLABLE_CONTAINER_ClASS}`);
    }

    getFocusedItemText() {
        return this._$element.find(`.${Consts.CONTAINER_CLASS} .${Consts.FOCUSED_ITEM_CLASS} span`).text();
    }

    getFolderActionButton(index) {
        const $folderNode = this.getFolderNode(index);
        return this._findActionButton($folderNode);
    }

    getBreadcrumbsWrapper() {
        return new FileManagerBreadcrumbsWrapper(this._$element.find(`.${Consts.BREADCRUMBS_CLASS}`));
    }

    getBreadcrumbsPath() {
        return this.getBreadcrumbsWrapper().getPath();
    }

    getBreadcrumbsItems() {
        return this.getBreadcrumbsWrapper().getItems();
    }

    getBreadcrumbsItemByText(text) {
        return this.getBreadcrumbsWrapper().getItemByText(text);
    }

    getBreadcrumbsParentDirectoryItem() {
        return this.getBreadcrumbsWrapper().getParentDirectoryItem();
    }

    getToolbar() {
        return this._$element.find(`.${Consts.TOOLBAR_CLASS}`);
    }

    getGeneralToolbar() {
        return this.getToolbar().children().first();
    }

    getFileSelectionToolbar() {
        return this.getToolbar().children().first().next();
    }

    getAllItemsOfToolbar(isFileSelection) {
        const toolbarElement = isFileSelection ? this.getFileSelectionToolbar() : this.getGeneralToolbar();
        return toolbarElement.find(`.${Consts.TOOLBAR_ITEM_CLASS}`);
    }

    getToolbarElements() {
        return this._$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_TEXT_CLASS}, .${Consts.TOOLBAR_CLASS} .${Consts.NATIVE_TOOLBAR_CLASS} .${Consts.DROP_DOWN_BUTTON_CLASS}`)
            .filter(':visible');
    }

    getToolbarElementsInSection(sectionName) {
        const visibleToolbarSection = this.getToolbar().find(`.${Consts.NATIVE_TOOLBAR_CLASS}:visible .${Consts.NATIVE_TOOLBAR_CLASS}-${sectionName}`);
        return visibleToolbarSection.find(`.${Consts.BUTTON_CLASS}:not(.${Consts.DROP_DOWN_BUTTON_ACTION_CLASS}), .${Consts.DROP_DOWN_BUTTON_CLASS}`);
    }

    getGeneralToolbarElements() {
        return this.getGeneralToolbar().find(`.${Consts.BUTTON_CLASS}:not(.${Consts.DROP_DOWN_BUTTON_ACTION_CLASS}), .${Consts.DROP_DOWN_BUTTON_CLASS}`);
    }

    getFileSelectionToolbarElements() {
        return this.getFileSelectionToolbar().find(`.${Consts.BUTTON_CLASS}:not(.${Consts.DROP_DOWN_BUTTON_ACTION_CLASS}), .${Consts.DROP_DOWN_BUTTON_CLASS}`);
    }

    getToolbarButton(text) {
        return this._$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('${text}')`);
    }

    getToolbarRefreshButton(isFileSelectionToolbar) {
        return this._$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}[title='Refresh']`).eq(isFileSelectionToolbar ? 1 : 0);
    }

    getToolbarRefreshButtonState(isFileSelectionToolbar) {
        const refreshIcon = this.getToolbarRefreshButton(isFileSelectionToolbar).find(`.${Consts.TOOLBAR_REFRESH_ITEM_ICON_CLASS}`);
        return {
            isDefault: refreshIcon.hasClass(Consts.TOOLBAR_REFRESH_ICON_MAP.default),
            isProgress: refreshIcon.hasClass(Consts.TOOLBAR_REFRESH_ICON_MAP.progress),
            isSuccess: refreshIcon.hasClass(Consts.TOOLBAR_REFRESH_ICON_MAP.success),
            isError: refreshIcon.hasClass(Consts.TOOLBAR_REFRESH_ICON_MAP.error)
        };
    }

    getToolbarSeparators() {
        return this._$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.TOOLBAR_SEPARATOR_ITEM_CLASS}:visible`);
    }

    getToolbarDropDownButton() {
        return this._$element.find(`.${Consts.DROP_DOWN_BUTTON_CLASS}`);
    }

    getToolbarDropDownMenuButton() {
        return this._$element.find(`.${Consts.DROPDOWN_MENU_BUTTON_CLASS}`);
    }

    getToolbarDropDownMenuItem(childIndex) {
        return $(`.${Consts.DROPDOWN_MENU_LIST_CLASS} .${Consts.DROPDOWN_MENU_CONTENT_CLASS} .${Consts.DROPDOWN_MENU_LIST_ITEM_CLASS}`).eq(childIndex);
    }

    getToolbarViewSwitcherListItem(childIndex) {
        return $(`.${Consts.POPUP_NORMAL_CLASS} .${Consts.DROPDOWN_MENU_CONTENT_CLASS} .${Consts.DROPDOWN_MENU_LIST_ITEM_CLASS}`).eq(childIndex);
    }

    getToolbarNavigationPaneToggleButton() {
        return this.getToolbarElementsInSection('before').not(`.${Consts.BUTTON_HAS_TEXT_CLASS}`);
    }

    getCustomThumbnails() {
        return this._$element.find(`.${Consts.CUSTOM_THUMBNAIL_CLASS}`);
    }

    getDetailsItemList() {
        return this.getItemsView();
    }

    getThumbnailsViewPort() {
        return this._$element.find(`.${Consts.THUMBNAILS_VIEW_PORT_CLASS}`);
    }

    getThumbnailsItems() {
        return this._$element.find(`.${Consts.THUMBNAILS_ITEM_CLASS}`);
    }

    getThumbnailsItemName(index) {
        return this.getThumbnailsItems().eq(index).find(`.${Consts.THUMBNAILS_ITEM_NAME_CLASS}`).text();
    }

    getThumbnailsSelectedItems() {
        return this.getThumbnailsItems().filter(`.${Consts.ITEM_SELECTED_CLASS}`);
    }

    findThumbnailsItem(itemName) {
        return this.getThumbnailsItems().filter(`:contains('${itemName}')`);
    }

    getThumbnailsItemContent(itemName) {
        return this.findThumbnailsItem(itemName).find(`.${Consts.THUMBNAILS_ITEM_CONTENT_CLASS}`);
    }

    isThumbnailsItemSelected(itemName) {
        return this.findThumbnailsItem(itemName).is(`.${Consts.ITEM_SELECTED_CLASS}`);
    }

    isThumbnailsItemFocused(itemName) {
        return this.findThumbnailsItem(itemName).is(`.${Consts.FOCUSED_STATE_CLASS}`);
    }

    getThumbnailsViewScrollable() {
        return this.getThumbnailsViewPort().find(`.${Consts.SCROLLABLE_ClASS}`);
    }

    getThumbnailsViewScrollableContainer() {
        return this.getThumbnailsViewScrollable().find(`.${Consts.SCROLLABLE_CONTAINER_ClASS}`);
    }

    findDetailsItem(itemName) {
        return this._$element.find(`.${Consts.GRID_DATA_ROW_CLASS} > td:contains('${itemName}')`);
    }

    getDetailsViewScrollable() {
        return this.getDetailsItemList().find(`.${Consts.SCROLLABLE_ClASS}`);
    }

    getDetailsViewScrollableContainer() {
        return this.getDetailsViewScrollable().find(`.${Consts.SCROLLABLE_CONTAINER_ClASS}`);
    }

    getDetailsItemsNames() {
        return this._$element.find(`.${Consts.DETAILS_ITEM_NAME_CLASS}`);
    }

    getDetailsItemNamesTexts() {
        return this.getDetailsItemsNames()
            .map((_, name) => $(name).text())
            .get();
    }

    getDetailsItemName(index) {
        return this.getDetailsItemsNames().eq(index).text();
    }

    getDetailsItemDateModified(index) {
        return this.getDetailsCell('Date Modified', index).text();
    }

    getDetailsItemSize(index) {
        return this.getDetailsCell('File Size', index).text();
    }

    getRowActionButtonInDetailsView(index) {
        const $row = this.getRowInDetailsView(index);
        return this._findActionButton($row);
    }

    getSelectCheckBoxInDetailsView(index) {
        return this.getRowInDetailsView(index).find('td').eq(0);
    }

    getRowNameCellInDetailsView(index) {
        return this.getDetailsCell('Name', index - 1);
    }

    getRowsInDetailsView() {
        return this._$element.find(`.${Consts.GRID_DATA_ROW_CLASS}`);
    }

    getRowInDetailsView(index) {
        return this._$element.find(`.${Consts.GRID_DATA_ROW_CLASS}[aria-rowindex=${index}]`);
    }

    getColumnCellsInDetailsView(index) {
        return this._$element.find(`.${Consts.GRID_DATA_ROW_CLASS} > td:nth-child(${index})`);
    }

    getColumnHeaderInDetailsView(index) {
        return this._$element.find('[id*=dx-col]').eq(index);
    }

    getDetailsColumnsHeaders() {
        return this.getDetailsItemList().find('.dx-header-row > td');
    }

    getDetailsCell(columnCaption, rowIndex) {
        const $itemList = this.getDetailsItemList();
        const columnIndex = $itemList.find(`.dx-header-row > td:contains('${columnCaption}')`).index();
        const $row = this.getRowInDetailsView(rowIndex + 1);
        return $row.children('td').eq(columnIndex);
    }

    getDetailsCellText(columnCaption, rowIndex) {
        return this.getDetailsCell(columnCaption, rowIndex).text();
    }

    getDetailsCellValue(rowIndex, columnIndex) {
        columnIndex += isDesktopDevice() ? 1 : 0;
        return this.getRowInDetailsView(rowIndex)
            .find(`td:nth-child(${columnIndex})`)
            .text()
            .replace(showMoreButtonText, '');
    }

    getDetailsOverlayShader() {
        return this.getDetailsItemList().find(`.${Consts.OVERLAY_SHADER_CLASS}`);
    }

    getSelectAllCheckBox() {
        const $itemList = this.getDetailsItemList();
        return $itemList.find('.dx-header-row > td.dx-command-select .dx-select-checkbox');
    }

    getSelectAllCheckBoxState() {
        const $checkBox = this.getSelectAllCheckBox();
        if($checkBox.is('.dx-checkbox-indeterminate')) {
            return 'indeterminate';
        } else if($checkBox.is('.dx-checkbox-checked')) {
            return 'checked';
        } else {
            return 'clear';
        }
    }

    getRowSelectCheckBox(index) {
        return this.getRowInDetailsView(index).find('td.dx-command-select .dx-select-checkbox:visible');
    }

    isDetailsRowSelected(index) {
        return this.getRowInDetailsView(index).is(`.${Consts.SELECTION_CLASS}`);
    }

    isDetailsRowFocused(index) {
        return this.getRowInDetailsView(index).is(`.${Consts.FOCUSED_ROW_CLASS}`);
    }

    getContextMenuItemsWithSeparators() {
        return $(`.${Consts.CONTEXT_MENU_CLASS} .${Consts.MENU_ITEM_CLASS}, .${Consts.CONTEXT_MENU_CLASS} .${Consts.CONTEXT_MENU_SEPARATOR_CLASS}`).filter(':visible');
    }

    getContextMenuItems(visible) {
        const selector = `.${Consts.CONTEXT_MENU_CLASS} .${Consts.MENU_ITEM_CLASS}`;

        return visible ? $(selector).filter(':visible') : $(selector);
    }

    getContextMenuItem(text) {
        return this.getContextMenuItems(true).filter(`:contains('${text}')`);
    }

    getContextMenuSubMenuItems() {
        return $(`.${Consts.CONTEXT_MENU_CLASS} .${Consts.MENU_ITEM_WITH_SUBMENU_CLASS} .${Consts.SUBMENU_CLASS} .${Consts.MENU_ITEM_CLASS}`);
    }

    _findActionButton($container) {
        return $container.find(`.${Consts.FILE_ACTION_BUTTON_CLASS} .${Consts.BUTTON_CLASS}`);
    }

    getNavPaneDrawerPanelContent() {
        return this._$element.find(`.${Consts.CONTAINER_CLASS} .${Consts.DRAWER_PANEL_CONTENT_CLASS}`);
    }

    getProgressPaneDrawerPanelContent() {
        return this._$element.find(`.${Consts.NOTIFICATION_DRAWER_CLASS} > .${Consts.DRAWER_WRAPPER_CLASS} > .${Consts.DRAWER_PANEL_CONTENT_CLASS}`);
    }

    getProgressDrawer() {
        return this._$element.find(`.${Consts.NOTIFICATION_DRAWER_CLASS}`);
    }

    getItemsPanel() {
        return this._$element.find(`.${Consts.CONTAINER_CLASS} .${Consts.DRAWER_CONTENT_CLASS}`);
    }

    moveSplitter(delta, pointerType) {
        const $splitter = this.getSplitter();
        const $drawerContent = this.getNavPaneDrawerPanelContent();
        if(!pointerType) {
            pointerType = 'mouse';
        }

        $splitter.trigger($.Event('dxpointerdown', { pointerType }));
        const contentRect = $drawerContent[0].getBoundingClientRect();
        $splitter.trigger($.Event('dxpointermove', {
            pointerType,
            pageX: contentRect.right - parseFloat($splitter.css('margin-left')) + delta
        }));

        $splitter.trigger($.Event('dxpointerup', { pointerType }));
    }

    isSplitterActive() {
        return !this.getSplitter().hasClass(Consts.DISABLED_STATE_CLASS);
    }

    getSplitter() {
        return this._$element.find(`.${Consts.SPLITTER_CLASS}`);
    }

    getSplitterPosition() {
        const $splitterWrapper = this._$element.find(`.${Consts.SPLITTER_WRAPPER_CLASS}`);
        return $splitterWrapper.get(0).offsetLeft + parseFloat(this.getSplitter().css('margin-left'));
    }

    getNotificationPopup() {
        return $(`.${Consts.NOTIFICATION_POPUP_CLASS} .${Consts.POPUP_NORMAL_CLASS}`);
    }

    getFolderChooserDialog() {
        return $(`.${Consts.FOLDER_CHOOSER_DIALOG_CLASS} .${Consts.POPUP_NORMAL_CLASS}`).filter(':visible');
    }

    getNameEditorDialog() {
        return $(`.${Consts.NAME_EDITOR_DIALOG_CLASS} .${Consts.POPUP_NORMAL_CLASS}`).filter(':visible');
    }

    getDeleteItemDialog() {
        return $(`.${Consts.DELETE_ITEM_DIALOG_CLASS} .${Consts.POPUP_NORMAL_CLASS}`).filter(':visible');
    }

    getDialogTextInput() {
        return this.getNameEditorDialog().find(`.${Consts.DIALOG_CLASS} .${Consts.TEXT_EDITOR_INPUT_CLASS}`);
    }

    getDialogButton(text) {
        return $(`.${Consts.POPUP_BOTTOM_CLASS} .${Consts.BUTTON_CLASS}:contains('${text}')`);
    }

    getUploadInput() {
        return $(`.${Consts.EDITING_CONTAINER} .${Consts.FILE_UPLOADER_INPUT}`);
    }

    setUploadInputFile(files) {
        const $input = this.getUploadInput();
        $input.val(files[0].name);
        $input.prop('files', files);
        $input.trigger('change');
    }

    getUploaderDropZonePlaceholder() {
        return this._$element.find(`.${Consts.FILE_UPLOADER_DROPZONE_PLACEHOLER_CLASS}`);
    }

    triggerDragEvent($element, eventType, elementOffset) {
        const offsetValue = eventType === 'dragenter' ? 1 : -1;
        $element = $($element);
        if(!isDefined(elementOffset)) {
            elementOffset = { top: offsetValue, left: offsetValue };
        } else {
            elementOffset.top = !isDefined(elementOffset.top) ? offsetValue : elementOffset.top;
            elementOffset.left = !isDefined(elementOffset.left) ? offsetValue : elementOffset.left;
        }
        $element.trigger($.Event(eventType, {
            clientX: $element.offset().left + elementOffset.left - this.getDocumentScrollLeft(),
            clientY: $element.offset().top + elementOffset.top - this.getDocumentScrollTop()
        }));
    }

    getDocumentScrollTop() {
        return document.documentElement.scrollTop || document.body.scrollTop;
    }

    getDocumentScrollLeft() {
        return document.documentElement.scrollLeft || document.body.scrollLeft;
    }

}

export class FileManagerProgressPanelWrapper {

    constructor($element) {
        this._$element = $element;
    }

    getInfosContainer() {
        return this._$element.find('.dx-filemanager-progress-panel-infos-container');
    }

    getInfos() {
        return this.getInfosContainer().find('.dx-filemanager-progress-panel-info')
            .map((_, info) => new FileManagerProgressPanelInfoWrapper($(info)))
            .get();
    }

    getSeparators() {
        return this.getInfosContainer().find('.dx-filemanager-progress-panel-separator');
    }

    findProgressBoxes($container) {
        return $container
            .children('.dx-filemanager-progress-box')
            .map((_, element) => new FileManagerProgressPanelProgressBoxWrapper($(element)))
            .get();
    }

    findError($container) {
        return $container.find('.dx-filemanager-progress-box-error');
    }

    get $closeButton() {
        return this._$element.find('.dx-filemanager-progress-panel-close-button');
    }

}

export class FileManagerProgressPanelInfoWrapper {

    constructor($element) {
        this._$element = $element;
    }

    get common() {
        const $common = this._$element.find('.dx-filemanager-progress-panel-common');
        return new FileManagerProgressPanelProgressBoxWrapper($common);
    }

    get details() {
        return this._$element
            .find('.dx-filemanager-progress-panel-details > .dx-filemanager-progress-box')
            .map((_, detailsInfo) => new FileManagerProgressPanelProgressBoxWrapper($(detailsInfo)))
            .get();
    }

}

export class FileManagerProgressPanelProgressBoxWrapper {

    constructor($element) {
        this._$element = $element;
    }

    get $element() {
        return this._$element;
    }

    get $commonText() {
        return this._$element.find('.dx-filemanager-progress-box-common');
    }

    get commonText() {
        return this.$commonText.text();
    }

    get $progressBar() {
        return this._$element.find('.dx-filemanager-progress-box-progress-bar');
    }

    get progressBar() {
        return this.$progressBar.dxProgressBar('instance');
    }

    get progressBarStatusText() {
        return this.$progressBar.find('.dx-progressbar-status').text();
    }

    get progressBarValue() {
        return this.progressBar.option('value');
    }

    get $closeButton() {
        return this._$element.find('.dx-filemanager-progress-box-close-button');
    }

    get closeButton() {
        return this.$closeButton.dxButton('instance');
    }

    get closeButtonVisible() {
        return this.closeButton.option('visible');
    }

    get $image() {
        return this._$element.find('.dx-filemanager-progress-box-image');
    }

    get $error() {
        return this._$element.find('.dx-filemanager-progress-box-error');
    }

    get errorText() {
        return this.$error.text();
    }

    get hasError() {
        return this.$error.length !== 0;
    }

}

export class FileManagerBreadcrumbsWrapper {

    constructor($element) {
        this._$element = $element;
    }

    getItems() {
        return this._$element.find(`.${Consts.MENU_ITEM_WITH_TEXT_CLASS}:not(.${Consts.BREADCRUMBS_SEPARATOR_ITEM_CLASS})`);
    }

    getItemByText(text) {
        return this.getItems().filter(function() {
            const content = $(this).text();
            return content === text;
        }).first();
    }

    getPath() {
        let result = '';
        const $elements = this.getItems();
        $elements.each((_, element) => {
            const name = $(element).text();
            result = result ? `${result}/${name}` : name;
        });
        return result;
    }

    getParentDirectoryItem() {
        return this._$element.find(`.${Consts.BREADCRUMBS_PARENT_DIRECOTRY_ITEM_CLASS}`);
    }

}

export const stringify = obj => {
    if(Array.isArray(obj)) {
        const content = obj
            .map(item => stringify(item))
            .join(',\n');
        return `[ ${content} ]`;
    }

    if(typeof obj !== 'object') {
        return JSON.stringify(obj);
    }

    const props = Object
        .keys(obj)
        .map(key => `${key}: ${stringify(obj[key])}`)
        .join(', ');
    return `{ ${props} }`;
};

export const createTestFileSystem = () => {
    return [
        {
            name: 'Folder 1',
            isDirectory: true,
            hasSubDirectories: true,
            items: [
                {
                    name: 'Folder 1.1',
                    isDirectory: true,
                    hasSubDirectories: true,
                    items: [
                        {
                            name: 'Folder 1.1.1',
                            isDirectory: true,
                            hasSubDirectories: true,
                            items: [
                                {
                                    name: 'Folder 1.1.1.1',
                                    isDirectory: true,
                                    hasSubDirectories: true,
                                    items: [
                                        {
                                            name: 'Folder 1.1.1.1.1',
                                            isDirectory: true,
                                            hasSubDirectories: false,
                                            items: [
                                                {
                                                    name: 'Special deep file.txt',
                                                    isDirectory: false,
                                                    size: 600
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: 'File 1-1.txt',
                            isDirectory: false
                        },
                        {
                            name: 'File 1-2.txt',
                            isDirectory: false
                        },
                        {
                            name: 'File 1-3.png',
                            isDirectory: false
                        },
                        {
                            name: 'File 1-4.jpg',
                            isDirectory: false
                        }]
                },
                {
                    name: 'Folder 1.2',
                    isDirectory: true,
                    hasSubDirectories: false
                },
                {
                    name: 'File 1-1.txt',
                    isDirectory: false
                },
                {
                    name: 'File 1-2.jpg',
                    isDirectory: false
                }]
        },
        {
            name: 'Folder 2',
            isDirectory: true,
            hasSubDirectories: false,
            items: [
                {
                    name: 'File 2-1.jpg',
                    isDirectory: false
                }]
        },
        {
            name: 'Folder 3',
            isDirectory: true,
            hasSubDirectories: false
        },
        {
            name: 'File 1.txt',
            isDirectory: false
        },
        {
            name: 'File 2.jpg',
            isDirectory: false
        },
        {
            name: 'File 3.xml',
            isDirectory: false
        }
    ];
};

export const createHugeFileSystem = (rootFilesCount = 10, rootDirsCount = 2, ...filesCount) => {
    const result = [];
    const getFiles = amount =>
        [...new Array(amount).keys()].map(i => ({
            name: `File ${i}.txt`,
            isDirectory: false
        }));
    for(let i = 0; i < rootDirsCount; i++) {
        result.push({
            name: `Folder ${i + 1}`,
            isDirectory: true,
            hasDubDirectories: false,
            items: getFiles((filesCount && filesCount[i]) || 100)
        });
    }
    result.push(...getFiles(rootFilesCount));
    return result;
};

export const createUploaderFiles = (count, size) => {
    const result = [];

    for(let i = 0; i < count; i++) {
        const fileSize = (size !== null && size !== undefined) ? size : (300000 + i * 200000);
        const fileName = `Upload file ${i}.txt`;
        const content = generateString(fileSize, i.toString());

        const file = createFileObject(fileName, content);
        result.push(file);
    }

    return result;
};

export const createSampleFileItems = () => {
    const filesPathInfo = [
        { key: 'Root', name: 'Root' },
        { key: 'Root/Files', name: 'Files' },
    ];

    const itemData = [
        { id: 'Root\\Files\\Documents', name: 'Documents', dateModified: '2019-02-14T07:44:15.4265625Z', isDirectory: true, size: 0, pathInfo: filesPathInfo },
        { id: 'Root\\Files\\Images', name: 'Images', dateModified: '2019-02-14T07:44:15.4885105Z', isDirectory: true, size: 0, pathInfo: filesPathInfo },
        { id: 'Root\\Files\\Music', name: 'Music', dateModified: '2019-02-14T07:44:15.4964648Z', isDirectory: true, size: 0, pathInfo: filesPathInfo },
        { id: 'Root\\Files\\Description.rtf', name: 'Description.rtf', dateModified: '2017-02-09T09:38:46.3772529Z', isDirectory: false, size: 1, pathInfo: filesPathInfo },
        { id: 'Root\\Files\\Article.txt', name: 'Article.txt', dateModified: '2017-02-09T09:38:46.3772529Z', isDirectory: false, size: 1, pathInfo: filesPathInfo }
    ];

    const fileSystemItems = [
        createFileSystemItem(filesPathInfo, itemData[0]),
        createFileSystemItem(filesPathInfo, itemData[1]),
        createFileSystemItem(filesPathInfo, itemData[2]),
        createFileSystemItem(filesPathInfo, itemData[3]),
        createFileSystemItem(filesPathInfo, itemData[4])
    ];

    return { filesPathInfo, itemData, fileSystemItems };
};

const createFileSystemItem = (parentPath, dataObj) => {
    const item = new FileSystemItem(parentPath, dataObj.name, dataObj.isDirectory);
    item.dateModified = deserializeDate(dataObj.dateModified);
    item.size = dataObj.size;
    item.dataItem = dataObj;
    if(dataObj.isDirectory) {
        item.hasSubDirectories = true;
    }
    return item;
};

export const createFileObject = (fileName, content) => {
    const result = new window.Blob([content], { type: 'application/octet-stream' });
    result.name = fileName;
    result.lastModified = (new Date()).getTime();
    result._dxContent = content;
    return result;
};

export const generateString = (size, content) => {
    if(!size) {
        return '';
    }

    let result = content;

    if(result === undefined) {
        result = 'A';
    }

    if(result.length < size) {
        const count = Math.ceil(size / result.length);
        result = new Array(count + 1).join(result);
    }

    if(result.length > size) {
        result = result.substr(0, size);
    }

    return result;
};

export const createUploadInfo = (file, chunkIndex, customData, chunkSize) => {
    chunkIndex = chunkIndex || 0;
    customData = customData || {};
    chunkSize = chunkSize || 200000;

    const bytesUploaded = chunkIndex * chunkSize;
    const chunkCount = getFileChunkCount(file, chunkSize);
    const chunkBlob = file.slice(bytesUploaded, Math.min(file.size, bytesUploaded + chunkSize));

    return { bytesUploaded, chunkCount, customData, chunkBlob, chunkIndex };
};

export const getFileChunkCount = (file, chunkSize) => {
    return file.size === 0 ? 1 : Math.ceil(file.size / chunkSize);
};

export const stubFileReader = object => {
    if(!(object['_createFileReader'].restore && object['_createFileReader'].restore.sinon)) {
        sinon.stub(object, '_createFileReader').callsFake(() => new FileReaderMock());
    }
};

export const isDesktopDevice = () => {
    return devices.real().deviceType === 'desktop';
};

export const getDropFileEvent = file => $.Event($.Event('drop', { dataTransfer: { files: [file] } }));

export const createEditingEvents = () => {
    return {
        onDirectoryCreating: sinon.spy(),
        onDirectoryCreated: sinon.spy(),
        onItemRenaming: sinon.spy(),
        onItemRenamed: sinon.spy(),
        onItemDeleting: sinon.spy(),
        onItemDeleted: sinon.spy(),
        onItemMoving: sinon.spy(),
        onItemMoved: sinon.spy(),
        onItemCopying: sinon.spy(),
        onItemCopied: sinon.spy(),
        onFileUploading: sinon.spy(),
        onFileUploaded: sinon.spy(),
        onItemDownloading: sinon.spy()
    };
};
