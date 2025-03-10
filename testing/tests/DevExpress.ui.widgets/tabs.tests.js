import 'generic_light.css!';
import { extend } from 'core/utils/extend';
import { DataSource } from 'data/data_source/data_source';
import holdEvent from 'events/hold';
import { triggerShownEvent } from 'events/visibility_change';
import $ from 'jquery';
import 'ui/responsive_box';
import 'ui/tabs';
import pointerMock from '../../helpers/pointerMock.js';
import { TestAsyncTabsWrapper, TestTabsWrapper } from '../../helpers/wrappers/tabsWrappers.js';
import { getScrollLeftMax } from 'renovation/ui/scroll_view/utils/get_scroll_left_max';
import keyboardMock from '../../helpers/keyboardMock.js';

QUnit.testStart(function() {
    const markup =
        `<style nonce="qunit-test">
            #scrollableTabs .dx-tab {
                display: table-cell;
                padding: 35px;
            }

            .bigtab.dx-tabs-expanded .dx-tab {
                width: 1000px;
            }

            #widthRootStyle {
                width: 300px;
            }
        </style>
        <div id="tabs"></div>
        <div id="widget"></div>
        <div id="widthRootStyle"></div>
        <div id="scrollableTabs"></div>`;

    $('#qunit-fixture').html(markup);
});

const TABS_ITEM_CLASS = 'dx-tab';
const TAB_SELECTED_CLASS = 'dx-tab-selected';
const TABS_SCROLLABLE_CLASS = 'dx-tabs-scrollable';
const TABS_WRAPPER_CLASS = 'dx-tabs-wrapper';
const TABS_NAV_BUTTON_CLASS = 'dx-tabs-nav-button';
const TABS_NAV_BUTTONS_CLASS = 'dx-tabs-nav-buttons';
const TABS_LEFT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-left';
const TABS_RIGHT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-right';
const DISABLED_STATE_CLASS = 'dx-state-disabled';
const FOCUSED_NEXT_TAB_CLASS = 'dx-focused-next-tab';
const BUTTON_NEXT_ICON = 'chevronnext';
const BUTTON_PREV_ICON = 'chevronprev';
const TAB_OFFSET = 30;

const toSelector = cssClass => `.${cssClass}`;

QUnit.module('General', () => {
    QUnit.test('mouseup switch selected tab', function(assert) {
        const tabsElement = $('#tabs').dxTabs({
            items: [
                { text: '0' },
                { text: '1' },
                { text: '2' }
            ]
        });
        const tabsInstance = tabsElement.dxTabs('instance');

        $.each(tabsInstance.option('items'), function(clickedTabIndex) {
            const tabs = $(tabsInstance._itemElements());
            tabs.eq(clickedTabIndex).trigger('dxclick');

            tabs.each(function(tabIndex) {
                const tab = $(this);
                const isClickedTab = tabIndex === clickedTabIndex;

                assert.ok(isClickedTab ? tab.hasClass(TAB_SELECTED_CLASS) : !tab.hasClass(TAB_SELECTED_CLASS), 'tab selected state');
            });

            assert.equal(tabsInstance.option('selectedIndex'), clickedTabIndex, 'tabs selectedIndex');
        });
    });

    QUnit.test('repeated click doesn\'t change selected tab state', function(assert) {
        const tabsElement = $('#tabs').dxTabs({
            items: [
                { text: '0' },
                { text: '1' },
                { text: '2' }
            ]
        });
        const tabsInstance = tabsElement.dxTabs('instance');

        const tabElements = $(tabsInstance._itemElements());
        const tabElement = tabElements.eq(1);

        tabElement.trigger('dxclick');

        assert.ok(tabElement.hasClass(TAB_SELECTED_CLASS));
        assert.equal(tabsInstance.option('selectedIndex'), 1);

        tabElement.trigger('dxclick');
        assert.ok(tabElement.hasClass(TAB_SELECTED_CLASS));
        assert.equal(tabsInstance.option('selectedIndex'), 1);
    });

    QUnit.test('disabled tab can\'t be selected by click', function(assert) {
        const tabsElement = $('#tabs').dxTabs({
            items: [
                { text: '1' },
                {
                    text: '2',
                    disabled: true
                },
                { text: '3' }
            ]
        });
        const tabsInstance = tabsElement.dxTabs('instance');

        const tabElements = $(tabsInstance._itemElements());

        tabElements.eq(2).trigger('dxclick');

        assert.ok(tabElements.eq(2).hasClass(TAB_SELECTED_CLASS));
        assert.equal(tabsInstance.option('selectedIndex'), 2);

        tabElements.eq(1).trigger('dxclick');
        assert.ok(!tabElements.eq(1).hasClass(TAB_SELECTED_CLASS));
        assert.equal(tabsInstance.option('selectedIndex'), 2);
    });

    QUnit.test('regression: wrong selectedIndex in tab mouseup handler', function(assert) {
        let selectedIndex;

        const tabsEl = $('#tabs').dxTabs({
            onSelectionChanged: function() {
                selectedIndex = tabsEl.dxTabs('instance').option('selectedIndex');
            },
            items: [
                { text: '0' },
                { text: '1' }
            ]
        });

        tabsEl.find('.dx-tab').eq(1).trigger('dxclick');
        assert.equal(selectedIndex, 1);

    });

    QUnit.test('select action should not be triggered when disabled item is disabled', function(assert) {
        let selectedIndex;

        const tabsEl = $('#tabs').dxTabs({
            onSelectionChanged: function(e) {
                selectedIndex = tabsEl.dxTabs('instance').option('selectedIndex');
            },
            items: [
                { text: '0' },
                { text: '1', disabled: true }
            ]
        });

        tabsEl.find('.dx-tab').eq(1).trigger('dxclick');
        assert.equal(selectedIndex, undefined);
    });

    QUnit.testInActiveWindow('specific class should be set to the selected item when next item the has focused and disabled states', function(assert) {
        const $element = $('#tabs').dxTabs({
            items: [
                { text: '0' },
                { text: '1', disabled: true },
            ],
            focusStateEnabled: true,
        });
        const $item = $element.find(`.${DISABLED_STATE_CLASS}`).eq(0);
        const keyboard = keyboardMock($element);

        keyboard.press('right');
        assert.ok($($item).hasClass(FOCUSED_NEXT_TAB_CLASS), 'The first item has specific class');

        keyboard.press('left');
        assert.ok($($item).hasClass(FOCUSED_NEXT_TAB_CLASS), 'The first item does not have specific class');
    });
});

QUnit.module('Tab select action', () => {
    QUnit.test('should not be triggered when is already selected', function(assert) {
        let count = 0;

        const $tabs = $('#tabs').dxTabs({
            items: [
                { text: '0' },
                { text: '1' },
                { text: '2' },
                { text: '3' }
            ],
            onSelectionChanged: function(e) {
                count += 1;
            }
        });

        const $tab = $tabs.find(toSelector(TABS_ITEM_CLASS)).eq(1);

        $tab
            .trigger('dxclick')
            .trigger('dxclick');

        assert.equal(count, 1, 'action triggered only once');
    });

    QUnit.test('selectedIndex updated on \'onItemClick\'', function(assert) {
        assert.expect(1);

        const $tabs = $('#tabs');

        $tabs.dxTabs({
            items: [1, 2, 3],
            selectedIndex: 1,
            onItemClick: function() {
                assert.equal(this.option('selectedIndex'), 2, 'selectedIndex changed');
            }
        });

        const $tab = $tabs.find(toSelector(TABS_ITEM_CLASS)).eq(2);

        pointerMock($tab).click();
    });

    QUnit.test('regression: B251795', function(assert) {
        assert.expect(2);

        let itemClickFired = 0;
        let itemSelectFired = 0;

        const $tabs = $('#tabs').dxTabs({
            items: [1, 2, 3],

            selectedIndex: 0,

            onItemClick: function() {
                itemClickFired++;
            },

            onSelectionChanged: function() {
                itemSelectFired++;
            }
        });

        $tabs
            .find('.' + TABS_ITEM_CLASS)
            .eq(1)
            .trigger($.Event('touchend', { touches: [1], targetTouches: [1], changedTouches: [{ identifier: 13 }] }))
            .trigger('mouseup');

        assert.equal(itemClickFired, 0);
        assert.equal(itemSelectFired, 0);
    });

    QUnit.test('Tabs in multiple mode', function(assert) {
        const $element = $('#widget').dxTabs({
            items: [
                { text: 'user' },
                { text: 'analytics' },
                { text: 'customers' },
                { text: 'search' },
                { text: 'favorites' }
            ], width: 400,
            selectionMode: 'multiple',
            selectedIndex: 2
        });
        const instance = $element.dxTabs('instance');

        assert.equal(instance.option('selectedItem').text, 'customers', 'was selected correct item');

        assert.ok(!instance.option('selectOnFocus'), 'option selectOnFocus must be false with turn on multiple mode');

        const $tab = $element.find(toSelector(TABS_ITEM_CLASS)).eq(3);
        pointerMock($tab).click();

        assert.equal(instance.option('selectedItems').length, 2, 'selected two items in multiple mode');
    });
});

QUnit.module('Horizontal scrolling', () => {
    const SCROLLABLE_CLASS = 'dx-scrollable';

    QUnit.test('tabs should be wrapped into scrollable if scrollingEnabled=true', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            scrollingEnabled: true,
            width: 100
        });
        const $scrollable = $element.children('.' + SCROLLABLE_CLASS);

        assert.ok($scrollable.length, 'scroll created');
        assert.ok($scrollable.hasClass(TABS_SCROLLABLE_CLASS), 'wrapper class added');
        assert.ok($scrollable.find('.' + TABS_ITEM_CLASS).length, 'items wrapped into scrollable');
    });

    QUnit.test('tabs should be wrapped into scrollable for some disabled items', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2', disabled: true }, { text: 'item 3', disabled: true }, { text: 'item 4', disabled: true }],
            width: 200
        });
        const $scrollable = $element.children('.' + SCROLLABLE_CLASS);

        assert.ok($scrollable.length, 'scroll created');
        assert.ok($scrollable.hasClass(TABS_SCROLLABLE_CLASS), 'wrapper class added');
        assert.ok($scrollable.find('.' + TABS_ITEM_CLASS).length, 'items wrapped into scrollable');
    });

    QUnit.test('tabs should not be wrapped into scrollable for some invisible items', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2', visible: false }, { text: 'item 3', visible: false }, { text: 'item 4', visible: false }],
            width: 200
        });

        assert.notOk(!!$element.children('.' + SCROLLABLE_CLASS).length, 'no scroll for invisible items');
    });

    QUnit.test('scrollable should have correct option scrollByContent', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            scrollingEnabled: true,
            scrollByContent: true,
            width: 100
        });
        const instance = $element.dxTabs('instance');
        const $scrollable = $element.children('.' + SCROLLABLE_CLASS);
        const scrollable = $scrollable.dxScrollable('instance');

        assert.ok(scrollable.option('scrollByContent'), 'scrollByContent was set');

        instance.option('scrollByContent', false);
        assert.ok(!scrollable.option('scrollByContent'), 'scrollByContent was set');
    });

    QUnit.test('tabs should not crash in Firefox after creation', function(assert) {
        $('#tabs').addClass('bigtab').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            scrollingEnabled: true,
            showNavButtons: true
        });

        assert.ok(true, 'widget was inited');
    });

    QUnit.test('nav buttons class should be added if showNavButtons=true', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            showNavButtons: true,
            width: 100
        });

        assert.ok($element.hasClass(TABS_NAV_BUTTONS_CLASS), 'navs class added');
    });

    QUnit.test('nav buttons should be rendered when widget is rendered invisible', function(assert) {
        const $container = $('<div>');

        try {
            const $element = $('<div>').appendTo($container).dxTabs({
                items: [
                    { text: 'user' },
                    { text: 'analytics' },
                    { text: 'customers' },
                    { text: 'search' },
                    { text: 'favorites' }
                ],
                scrollingEnabled: true,
                showNavButtons: true,
                width: 100
            });

            $container.appendTo('#qunit-fixture');
            triggerShownEvent($container);

            assert.equal($element.find('.' + TABS_NAV_BUTTON_CLASS).length, 2, 'nav buttons are rendered');
        } finally {
            $container.remove();
        }
    });

    QUnit.test('right nav button should be rendered if showNavButtons=true and possible to scroll right', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.children().eq(-1);

        assert.ok($button.hasClass(TABS_NAV_BUTTON_CLASS), 'nav class added');
        assert.ok($button.hasClass(TABS_RIGHT_NAV_BUTTON_CLASS), 'right class added');
    });

    QUnit.test('click on right nav button should scroll tabs to right', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS);
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

        $($button).trigger('dxclick');
        assert.equal(scrollable.scrollLeft(), TAB_OFFSET, 'scroll position is correct');
    });

    QUnit.test('hold on right nav button should scroll tabs to right to end', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }, { text: 'item 4' },
                { text: 'item 5' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS);
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

        this.clock = sinon.useFakeTimers();

        $($button).trigger(holdEvent.name);
        this.clock.tick(100);
        $($button).trigger('mouseup');

        assert.equal(scrollable.scrollLeft(), 120, 'scroll position is correct');

        this.clock.restore();
    });

    QUnit.test('left nav button should be rendered if showNavButtons=true and possible to scroll left', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.children().eq(0);

        assert.ok($button.hasClass(TABS_NAV_BUTTON_CLASS), 'nav class added');
        assert.ok($button.hasClass(TABS_LEFT_NAV_BUTTON_CLASS), 'left class added');
    });

    QUnit.test('click on left nav button should scroll tabs to left', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS);
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

        scrollable.update();
        scrollable.scrollTo(TAB_OFFSET);
        $($button).trigger('dxclick');
        assert.equal(scrollable.scrollLeft(), 0, 'scroll position is correct');
    });

    QUnit.test('hold on left nav button should scroll tabs to left to end', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }, { text: 'item 4' },
                { text: 'item 5' }, { text: 'item 6' }, { text: 'item 7' }, { text: 'item 8' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS);
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

        this.clock = sinon.useFakeTimers();

        scrollable.update();
        scrollable.scrollTo(200);

        $($button).trigger(holdEvent.name);
        this.clock.tick(100);
        $($button).trigger('mouseup');

        assert.equal(scrollable.scrollLeft(), 80, 'scroll position is correct');

        this.clock.restore();
    });

    QUnit.test('selected item should be visible after selectedIndex was changed', function(assert) {
        assert.expect(1);
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            selectedIndex: 0,
            scrollingEnabled: true,
            width: 100
        });
        const instance = $element.dxTabs('instance');
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

        scrollable.scrollToElement = function($item) {
            assert.equal($item.get(0), instance.itemElements().eq(3).get(0), 'scrolled to item');
        };
        instance.option('selectedIndex', 3);
    });

    QUnit.test('tabs should not be wrapped into scrollable if all items are visible', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            scrollingEnabled: true,
            width: 250
        });
        const $scrollable = $element.children('.' + SCROLLABLE_CLASS);

        assert.equal($scrollable.length, 0, 'scroll was not created');
    });

    QUnit.test('left button should be disabled if scrollPosition == 0', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS);
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

        assert.ok($button.dxButton('instance').option('disabled'));

        scrollable.scrollTo(10);
        assert.ok(!$button.dxButton('instance').option('disabled'));

        scrollable.scrollTo(0);
        assert.ok($button.dxButton('instance').option('disabled'));
    });

    QUnit.test('right button should be disabled if scrollPosition == scrollWidth', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS);
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');
        const scrollWidth = Math.round(scrollable.scrollWidth());

        assert.ok(!$button.dxButton('instance').option('disabled'));

        scrollable.scrollTo(scrollWidth - scrollable.clientWidth());
        assert.ok($button.dxButton('instance').option('disabled'));

        scrollable.scrollTo(0);
        assert.ok(!$button.dxButton('instance').option('disabled'));
    });

    QUnit.module('Disabled state of navigation buttons', () => {
        [0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.2, 1.25, 1.34, 1.5, 1.875, 2.25, 2.65].forEach((browserZoom) => {
            [true, false].forEach((rtlEnabled) => {
                const cssStyles = {
                    transform: `scale(${browserZoom})`,
                    transformOrigin: '0 0',
                };
                // T1037332
                QUnit.test(`Left button should be disabled in boundary value: ${JSON.stringify(cssStyles)}, rtlEnabled: ${rtlEnabled}`, function(assert) {
                    assert.expect(6);

                    $('#tabs').css(cssStyles);
                    const $element = $('#tabs').dxTabs({
                        items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
                        showNavButtons: true,
                        scrollingEnabled: true,
                        rtlEnabled,
                        width: 100
                    });
                    const leftButton = $element.find(`.${TABS_LEFT_NAV_BUTTON_CLASS}`).dxButton('instance');
                    const rightButton = $element.find(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`).dxButton('instance');
                    const scrollable = $element.find(`.${SCROLLABLE_CLASS}`).dxScrollable('instance');

                    assert.strictEqual(leftButton.option('disabled'), rtlEnabled ? false : true);
                    assert.strictEqual(rightButton.option('disabled'), rtlEnabled ? true : false);

                    scrollable.scrollTo({ left: 10 });
                    assert.strictEqual(leftButton.option('disabled'), false);
                    assert.strictEqual(rightButton.option('disabled'), false);

                    scrollable.scrollTo({ left: 0 });
                    assert.strictEqual(leftButton.option('disabled'), true);
                    assert.strictEqual(rightButton.option('disabled'), false);
                });

                QUnit.test(`Right button should be disabled in boundary value: ${JSON.stringify(cssStyles)}, rtlEnabled: ${rtlEnabled}`, function(assert) {
                    assert.expect(6);

                    $('#tabs').css(cssStyles);
                    const $element = $('#tabs').dxTabs({
                        items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
                        showNavButtons: true,
                        scrollingEnabled: true,
                        rtlEnabled,
                        width: 100
                    });
                    const leftButton = $element.find(`.${TABS_LEFT_NAV_BUTTON_CLASS}`).dxButton('instance');
                    const rightButton = $element.find(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`).dxButton('instance');
                    const scrollable = $element.find(`.${SCROLLABLE_CLASS}`).dxScrollable('instance');

                    assert.strictEqual(leftButton.option('disabled'), rtlEnabled ? false : true);
                    assert.strictEqual(rightButton.option('disabled'), rtlEnabled ? true : false);

                    const maxLeftOffset = getScrollLeftMax($(scrollable.container()).get(0));
                    scrollable.scrollTo({ left: maxLeftOffset });

                    assert.strictEqual(leftButton.option('disabled'), false);
                    assert.strictEqual(rightButton.option('disabled'), true);

                    scrollable.scrollTo({ left: 10 });
                    assert.strictEqual(leftButton.option('disabled'), false);
                    assert.strictEqual(rightButton.option('disabled'), false);
                });
            });
        });
    });

    QUnit.test('button should update disabled state after dxresize', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS);

        $button.dxButton('instance').option('disabled', true);

        $($element).trigger('dxresize');
        assert.ok(!$button.dxButton('instance').option('disabled'));
    });

    QUnit.test('tabs should not be refreshed after dimension changed', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            scrollingEnabled: true,
            visible: true,
            width: 100
        });
        const instance = $element.dxTabs('instance');

        instance.itemElements().data('rendered', true);

        $($element).trigger('dxresize');

        assert.ok(instance.itemElements().data('rendered'), 'tabs was not refreshed');
        assert.equal($element.find('.' + TABS_SCROLLABLE_CLASS).length, 1, 'only one scrollable wrapper should exist');
    });

    QUnit.test('tabs should hide navigation if scrollable is not allowed after resize', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            scrollingEnabled: true,
            visible: true,
            width: 100
        });
        const instance = $element.dxTabs('instance');

        instance.option('width', 700);

        assert.equal($element.find('.' + TABS_NAV_BUTTON_CLASS).length, 0, 'nav buttons was removed');
        assert.equal($element.find('.' + TABS_SCROLLABLE_CLASS).length, 0, 'scrollable was removed');
        assert.equal($element.find('.' + TABS_WRAPPER_CLASS).length, 1, 'indent wrapper was restored');
    });

    QUnit.test('tabs should scroll to the selected item on init', function(assert) {
        const items = [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }, { text: 'item 4' }, { text: 'item 5' }];
        const $element = $('#scrollableTabs').dxTabs({
            items: items,
            scrollingEnabled: true,
            visible: true,
            selectedItem: items[3],
            width: 200
        });

        const $item = $element.find('.' + TABS_ITEM_CLASS).eq(3);
        const itemOffset = Math.round($item.offset().left);
        const contentLeft = Math.round($element.offset().left);
        const contentRight = Math.round(contentLeft + $element.outerWidth());
        const rightBoundary = Math.round(contentRight - $item.outerWidth());

        assert.ok(itemOffset <= rightBoundary, `item offset ${itemOffset} is lower than right boundary ${rightBoundary}`);
        assert.ok(itemOffset > contentLeft, `item offset ${itemOffset} is greater than left boundary ${contentLeft}`);
    });

    QUnit.test('tabs should scroll to the disabled item when it have focus', function(assert) {
        const items = [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3', disabled: true }];
        const $element = $('#scrollableTabs').dxTabs({
            items,
            width: 200,
            showNavButtons: false,
            focusStateEnabled: true,
        });
        const $item = $element.find(`.${DISABLED_STATE_CLASS}`).eq(0);
        const keyboard = keyboardMock($element);

        keyboard.press('right');
        keyboard.press('right');

        const contentLeft = $element.offset().left;
        const contentRight = contentLeft + $element.outerWidth();
        const itemLeft = $item.offset().left;
        const itemRight = itemLeft + $item.outerWidth();

        assert.roughEqual(itemRight, contentRight, 1, 'focused disabled item is in view');
    });
});

QUnit.module('RTL', () => {
    QUnit.test('nav buttons should have correct icons on init', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
            showNavButtons: true,
            scrollingEnabled: true,
            rtlEnabled: true,
            width: 100
        });

        const leftButtonIcon = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS).dxButton('option', 'icon');
        const rightButtonIcon = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS).dxButton('option', 'icon');

        assert.equal(leftButtonIcon, BUTTON_NEXT_ICON, 'Left button icon is OK');
        assert.equal(rightButtonIcon, BUTTON_PREV_ICON, 'Right button icon is OK');
    });

    QUnit.test('nav buttons should have correct icons after rtlEnabled changed', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
            showNavButtons: true,
            scrollingEnabled: true,
            rtlEnabled: true,
            width: 100
        });

        $element.dxTabs('option', 'rtlEnabled', false);

        const leftButtonIcon = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS).dxButton('option', 'icon');
        const rightButtonIcon = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS).dxButton('option', 'icon');

        assert.equal(leftButtonIcon, BUTTON_PREV_ICON, 'Left button icon is OK');
        assert.equal(rightButtonIcon, BUTTON_NEXT_ICON, 'Right button icon is OK');
    });

    QUnit.test('tabs should be scrolled to the right position on init in RTL mode', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
            showNavButtons: true,
            scrollingEnabled: true,
            rtlEnabled: true,
            width: 100
        });

        const scrollable = $element.find('.dx-scrollable').dxScrollable('instance');

        assert.equal(Math.round(scrollable.scrollLeft()), Math.round(scrollable.scrollWidth() - scrollable.clientWidth()), 'items are scrolled');
    });
});

QUnit.module('Live Update', {
    beforeEach: function() {
        this.itemRenderedSpy = sinon.spy();
        this.itemDeletedSpy = sinon.spy();
        this.data = [{
            id: 0,
            text: '0',
            content: '0 tab content'
        },
        {
            id: 1,
            text: '1',
            content: '1 tab content'
        }];
        this.createTabs = (dataSourceOptions, tabOptions) => {
            const dataSource = new DataSource($.extend({
                paginate: false,
                pushAggregationTimeout: 0,
                load: () => this.data,
                key: 'id'
            }, dataSourceOptions));

            return $('#tabs').dxTabs(
                extend(tabOptions, {
                    dataSource,
                    onContentReady: e => {
                        e.component.option('onItemRendered', this.itemRenderedSpy);
                        e.component.option('onItemDeleted', this.itemDeletedSpy);
                    }
                })).dxTabs('instance');
        };
    }
}, function() {
    QUnit.test('update item', function(assert) {
        const store = this.createTabs().getDataSource().store();

        const pushData = [{ type: 'update', data: {
            id: 1,
            text: '1 Updated',
            content: '1 tab content'
        }, key: 1 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check updated item');
    });

    QUnit.test('add item', function(assert) {
        const store = this.createTabs().getDataSource().store();

        const pushData = [{ type: 'insert', data: {
            id: 2,
            text: '2 Inserted',
            content: '2 tab content'
        } }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check added item');
        assert.ok($(this.itemRenderedSpy.firstCall.args[0].itemElement).parent().hasClass(TABS_WRAPPER_CLASS), 'check item container');
    });

    QUnit.test('remove item', function(assert) {
        const store = this.createTabs().getDataSource().store();

        const pushData = [{ type: 'remove', key: 1 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 0, 'items are not refreshed after remove');
        assert.equal(this.itemDeletedSpy.callCount, 1, 'removed items count');
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData.text, '1', 'check removed item');
    });

    QUnit.test('repaintChangesOnly, update item instance', function(assert) {
        const dataSource = this.createTabs({}, { repaintChangesOnly: true }).getDataSource();

        this.data[0] = {
            id: 0,
            text: '0 Updated',
            content: '0 tab content'
        };
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.text, '0 Updated', 'check updated item');
    });

    QUnit.test('repaintChangesOnly, add item', function(assert) {
        const dataSource = this.createTabs({}, { repaintChangesOnly: true }).getDataSource();

        this.data.push({
            id: 2,
            text: '2 Inserted',
            content: '2 tab content'
        });
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.text, '2 Inserted', 'check added item');
        assert.ok($(this.itemRenderedSpy.firstCall.args[0].itemElement).parent().hasClass(TABS_WRAPPER_CLASS), 'check item container');
    });

    QUnit.test('Show nav buttons when new item is added', function(assert) {
        this.data = this.data.map(item => `item ${item.text}`);

        const tabs = this.createTabs({}, {
            repaintChangesOnly: true,
            showNavButtons: true,
            width: 100
        });
        const store = tabs.getDataSource().store();

        store.push([{
            type: 'insert',
            data: {
                id: 2,
                text: '2 Inserted',
                content: '2 tab content'
            }
        }]);

        const $element = tabs.$element();
        assert.equal($element.find(`.${TABS_LEFT_NAV_BUTTON_CLASS}`).length, 1, 'left nav button is shown');
        assert.equal($element.find(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`).length, 1, 'right nav button is shown');
    });

    QUnit.test('Hide nav buttons when item is removed', function(assert) {
        this.data = this.data.map(item => `item ${item.text}`);
        this.data.push({
            id: 2,
            text: 'item 2',
            content: '2 tab content'
        });

        const tabs = this.createTabs({}, {
            repaintChangesOnly: true,
            showNavButtons: true,
            width: 120
        });
        const store = tabs.getDataSource().store();

        store.push([{
            type: 'remove',
            key: 2
        }]);

        const $element = tabs.$element();
        assert.equal($element.find(`.${TABS_LEFT_NAV_BUTTON_CLASS}`).length, 0, 'left nav button is hidden');
        assert.equal($element.find(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`).length, 0, 'right nav button is hidden');
    });

    QUnit.test('Enable scrolling when new item is added', function(assert) {
        this.data = this.data.map(item => `item ${item.text}`);

        const tabs = this.createTabs({}, {
            repaintChangesOnly: true,
            showNavButtons: false,
            width: 100
        });
        const store = tabs.getDataSource().store();

        store.push([{
            type: 'insert',
            data: {
                id: 2,
                text: '2 Inserted',
                content: '2 tab content'
            }
        }]);

        const $element = tabs.$element();
        assert.equal($element.find(`.${TABS_SCROLLABLE_CLASS}`).length, 1, 'scrolling is enabled');
    });

    QUnit.test('Disable scrolling when item is removed', function(assert) {
        this.data = this.data.map(item => `item ${item.text}`);
        this.data.push({
            id: 2,
            text: 'item 2',
            content: '2 tab content'
        });

        const tabs = this.createTabs({}, {
            repaintChangesOnly: true,
            showNavButtons: false,
            width: 120
        });
        const store = tabs.getDataSource().store();

        store.push([{
            type: 'remove',
            key: 2
        }]);

        const $element = tabs.$element();
        assert.equal($element.find(`.${TABS_SCROLLABLE_CLASS}`).length, 0, 'scrolling is disabled');
    });
});

QUnit.module('Async templates', {
    beforeEach() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('render tabs', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 290 });
        this.clock.tick(10);
        testWrapper.checkTabsWithoutScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    QUnit.test('render tabs. use default and custom templates', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), {
            width: 180,
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3', template: 'item' }],
            itemTemplate: null
        });

        this.clock.tick(10);
        testWrapper.checkTabsWithoutScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    QUnit.test('render tabs with scrollable. use default and custom templates', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), {
            width: 100,
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3', template: 'item' }],
            showNavButtons: false,
            itemTemplate: null
        });

        this.clock.tick(10);
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    QUnit.test('render tabs with scrollable and navigation buttons. use default and custom templates', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), {
            width: 100,
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3', template: 'item' }],
            showNavButtons: true,
            itemTemplate: null
        });

        this.clock.tick(10);
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });

    QUnit.test('render tabs with scrollable', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 150, showNavButtons: false });
        this.clock.tick(10);
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    QUnit.test('render tabs with scrollable and navigation buttons', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 150, showNavButtons: true });
        this.clock.tick(10);
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });

    QUnit.test('Add scrollable when width is changed from large to small', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 220, showNavButtons: false });
        this.clock.tick(10);
        testWrapper.width = 150;
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    QUnit.test('Add scrollable and navigation buttons when width is changed from large to small', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 220, showNavButtons: true });
        this.clock.tick(10);
        testWrapper.width = 150;
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });

    QUnit.test('Remove scrollable when width is changed from small to large', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 150, showNavButtons: false });
        this.clock.tick(10);
        testWrapper.width = 290;
        testWrapper.checkTabsWithoutScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    QUnit.test('Remove scrollable and navigation buttons when width is changed from small to large', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 150, showNavButtons: true });
        this.clock.tick(10);
        testWrapper.width = 290;
        testWrapper.checkTabsWithoutScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    [false, true].forEach(repaintChangesOnly => {
        QUnit.test(`Add scrollable when items are changed from 5 to 10, repaintChangesOnly: ${repaintChangesOnly}`, function() {
            const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 290, showNavButtons: false, repaintChangesOnly });

            this.clock.tick(10);
            testWrapper.setItemsByCount(10);
            this.clock.tick(10);

            testWrapper.checkTabsWithScrollable();
            testWrapper.checkNavigationButtons(false);
        });

        QUnit.test(`Add scrollable and navigation buttons when items are changed from 5 to 10, repaintChangesOnly: ${repaintChangesOnly}`, function() {
            const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 290, showNavButtons: true, repaintChangesOnly });

            this.clock.tick(10);
            testWrapper.setItemsByCount(10);
            this.clock.tick(10);

            testWrapper.checkTabsWithScrollable();
            testWrapper.checkNavigationButtons(true);
        });

        QUnit.test(`Remove scrollable when items are changed from 10 to 5, repaintChangesOnly: ${repaintChangesOnly}`, function() {
            const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 290, showNavButtons: false, repaintChangesOnly, itemsCount: 10 });

            this.clock.tick(10);
            testWrapper.setItemsByCount(5);
            this.clock.tick(10);

            testWrapper.checkTabsWithoutScrollable();
            testWrapper.checkNavigationButtons(false);
        });

        QUnit.test(`Remove scrollable and navigation buttons when items are changed from 10 to 5, repaintChangesOnly: ${repaintChangesOnly}`, function() {
            const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 290, showNavButtons: true, repaintChangesOnly, itemsCount: 10 });

            this.clock.tick(10);
            testWrapper.setItemsByCount(5);
            this.clock.tick(10);

            testWrapper.checkTabsWithoutScrollable();
            testWrapper.checkNavigationButtons(false);
        });
    });
});

QUnit.module('Render in the ResponsiveBox. Flex strategy', () => {
    const itemTemplate = () => $('<div>').width(150).height(150).css('border', '1px solid black');
    const createResponsiveBox = ({ cols, rows, items }) => $('#widget').dxResponsiveBox({
        width: 300,
        cols,
        rows,
        itemTemplate,
        screenByWidth: () => 'md',
        items
    });

    QUnit.test('render tabs with scrollable and navigation buttons', function() {
        createResponsiveBox({
            cols: [{ ratio: 1 }, { ratio: 1 }],
            rows: [{ ratio: 1 }],
            items: [
                {
                    location: { col: 0, row: 0 },
                    template: () => $('<div id=\'tabsInTemplate\'>')
                },
                {
                    location: { col: 1, row: 0 }
                }
            ]
        });
        const testWrapper = new TestTabsWrapper($('#tabsInTemplate'), {
            itemsCount: 10,
            showNavButtons: true
        });
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });

    QUnit.test('render tabs with scrollable and navigation buttons. ResponsiveBox item has colSpan', function() {
        createResponsiveBox({
            cols: [{ ratio: 1 }, { ratio: 1 }, { ratio: 1 }],
            rows: [{ ratio: 1 }],
            items: [
                {
                    location: { col: 0, row: 0, colspan: 2 },
                    template: () => $('<div id=\'tabsInTemplate\'>')
                },
                {
                    location: { col: 1, row: 0 }
                },
                {
                    location: { col: 2, row: 0 }
                }
            ]
        });
        const testWrapper = new TestTabsWrapper($('#tabsInTemplate'), {
            itemsCount: 10,
            showNavButtons: true
        });
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });

    QUnit.test('render tabs with scrollable and navigation buttons. ResponsiveBox row has ratio = 2', function() {
        createResponsiveBox({
            cols: [{ ratio: 2 }, { ratio: 1 }],
            rows: [{ ratio: 1 }],
            items: [
                {
                    location: { col: 0, row: 0 },
                    template: () => $('<div id=\'tabsInTemplate\'>')
                },
                {
                    location: { col: 1, row: 0 }
                }
            ]
        });
        const testWrapper = new TestTabsWrapper($('#tabsInTemplate'), {
            itemsCount: 10,
            showNavButtons: true
        });
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });

    QUnit.test('render tabs with scrollable and navigation buttons. ResponsiveBox in one column', function() {
        createResponsiveBox({
            cols: [{ ratio: 1 }],
            rows: [{ ratio: 1 }, { ratio: 1 }],
            items: [
                {
                    location: { col: 0, row: 0 }
                },
                {
                    location: { col: 0, row: 1 },
                    template: () => $('<div id=\'tabsInTemplate\'>')
                }
            ]
        });
        const testWrapper = new TestTabsWrapper($('#tabsInTemplate'), {
            itemsCount: 10,
            showNavButtons: true
        });
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });
});
