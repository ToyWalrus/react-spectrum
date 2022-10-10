import {AriaLabelingProps, Node, Orientation} from '@react-types/shared';
import {AriaTabListProps, AriaTabPanelProps, mergeProps, useFocusRing, useHover, useTab, useTabList, useTabPanel} from 'react-aria';
import {CollectionProps, Item, useCollection} from './Collection';
import React, {createContext, ForwardedRef, forwardRef, Key, useContext, useEffect, useState} from 'react';
import {RenderProps, StyleRenderProps, useRenderProps} from './utils';
import {useObjectRef} from '@react-aria/utils';
import {useTabListState} from 'react-stately';

interface TabsProps extends RenderProps<TabsRenderProps> {
  /**
   * The orientation of the tabs.
   * @default 'horizontal'
   */
  orientation?: Orientation
}

export interface TabsRenderProps {
  /**
   * The orientation of the tabs.
   * @selector [data-orientation="horizontal | vertical"]
   */
  orientation: Orientation
}

interface TabListProps<T> extends Omit<AriaTabListProps<T>, 'children' | 'orientation'>, StyleRenderProps<TabListRenderProps>, AriaLabelingProps, CollectionProps<T> {}

export interface TabListRenderProps {
  /**
   * The orientation of the tab list.
   * @selector [aria-orientation="horizontal | vertical"]
   */
  orientation: Orientation
}

interface TabProps extends RenderProps<TabRenderProps>, AriaLabelingProps {
  id?: Key
}

export interface TabRenderProps {
  /**
   * Whether the tab is currently hovered with a mouse.
   * @selector [data-hovered]
   */
  isHovered: boolean,
  /**
   * Whether the tab is currently in a pressed state.
   * @selector [data-pressed]
   */
  isPressed: boolean,
  /**
   * Whether the tab is currently selected.
   * @selector [aria-selected=true]
   */
  isSelected: boolean,
  /**
   * Whether the tab is currently focused.
   * @selector :focus
   */
  isFocused: boolean,
  /**
   * Whether the tab is currently keyboard focused.
   * @selector [data-focus-visible]
   */
  isFocusVisible: boolean,
  /**
   * Whether the tab is disabled.
   * @selector [aria-disabled]
   */
  isDisabled: boolean
}

interface TabPanelProps extends AriaTabPanelProps, RenderProps<TabPanelRenderProps> {}
export interface TabPanelRenderProps {
  /**
   * Whether the tab panel is currently focused.
   * @selector :focus
   */
  isFocused: boolean,
  /**
   * Whether the tab panel is currently keyboard focused.
   * @selector [data-focus-visible]
   */
  isFocusVisible: boolean
}

const InternalTabsContext = createContext(null);

function Tabs(props: TabsProps, ref: ForwardedRef<HTMLDivElement>) {
  let {orientation = 'horizontal'} = props;
  let [state, setState] = useState(null);

  let renderProps = useRenderProps({
    ...props,
    defaultClassName: 'react-aria-Tabs',
    values: {
      orientation
    }
  });

  return (
    <div 
      {...renderProps}
      ref={ref}
      data-orientation={orientation}>
      <InternalTabsContext.Provider value={{state, setState, orientation}}>
        {props.children}
      </InternalTabsContext.Provider>
    </div>
  );
}

/**
 * Tabs organize content into multiple sections and allow users to navigate between them.
 */
const _Tabs = forwardRef(Tabs);
export {_Tabs as Tabs};

function TabList<T extends object>(props: TabListProps<T>, ref: ForwardedRef<HTMLDivElement>) {
  let {setState, orientation} = useContext(InternalTabsContext);
  let objectRef = useObjectRef(ref);

  let {portal, collection} = useCollection(props);
  let state = useTabListState({
    ...props,
    collection,
    children: null
  });

  let {tabListProps} = useTabList({
    ...props,
    children: null,
    orientation
  }, state, objectRef);

  useEffect(() => {
    setState(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, state.selectedKey]);

  let renderProps = useRenderProps({
    ...props,
    children: null,
    defaultClassName: 'react-aria-TabList',
    values: {
      orientation
    }
  });

  return (
    <>
      <div {...tabListProps} ref={objectRef} {...renderProps}>
        {[...state.collection].map((item) => (
          <TabInner
            key={item.key}
            item={item}
            state={state} />
        ))}
      </div>
      {portal}
    </>
  );
}

/**
 * A TabList is used within Tabs to group tabs that a user can switch between.
 * The ids of the items within the <TabList> must match up with a corresponding item inside the <TabPanels>.
 */
const _TabList = forwardRef(TabList);
export {_TabList as TabList};

/**
 * A Tab provides a title for an individual item within a TabList.
 */
export function Tab(props: TabProps): JSX.Element {
  return Item(props);
}

function TabInner({item, state}) {
  let {key} = item;
  let ref = React.useRef();
  let {tabProps, isSelected, isDisabled, isPressed} = useTab({key}, state, ref);
  let {focusProps, isFocused, isFocusVisible} = useFocusRing();
  let {hoverProps, isHovered} = useHover({
    isDisabled
  });

  let renderProps = useRenderProps({
    className: item.props.className,
    style: item.props.style,
    children: item.rendered,
    defaultClassName: 'react-aria-Tab',
    values: {
      isSelected,
      isDisabled,
      isFocused,
      isFocusVisible,
      isPressed,
      isHovered
    }
  });

  return (
    <div 
      {...mergeProps(tabProps, focusProps, hoverProps, renderProps)}
      ref={ref}
      data-focus-visible={isFocusVisible || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined} />
  );
}

interface TabPanelsProps<T> extends Omit<CollectionProps<T>, 'disabledKeys'> {}

/**
 * TabPanels is used within Tabs as a container for the content of each tab.
 * The ids of the items within the <TabPanels> must match up with a corresponding item inside the <TabList>.
 */
export function TabPanels<T extends object>(props: TabPanelsProps<T>) {
  const {state} = useContext(InternalTabsContext);
  let {portal, collection} = useCollection(props);
  const selectedItem = collection.getItem(state?.selectedKey);

  return (
    <>
      {selectedItem && <SelectedTabPanel item={selectedItem} />}
      {portal}
    </>
  );
}

/**
 * A TabPanel provides the content for a tab.
 */
export function TabPanel(props: TabPanelProps): JSX.Element {
  return Item(props);
}

function SelectedTabPanel({item}: {item: Node<object>}) {
  const {state} = useContext(InternalTabsContext);
  let ref = React.useRef();
  let {tabPanelProps} = useTabPanel(item.props, state, ref);
  let {focusProps, isFocused, isFocusVisible} = useFocusRing();

  let renderProps = useRenderProps({
    className: item.props.className,
    style: item.props.style,
    children: item.rendered,
    defaultClassName: 'react-aria-TabPanel',
    values: {
      isFocused,
      isFocusVisible
    }
  });

  return (
    <div 
      {...mergeProps(tabPanelProps, focusProps, renderProps)}
      ref={ref}
      data-focus-visible={isFocusVisible || undefined} />
  );
}
