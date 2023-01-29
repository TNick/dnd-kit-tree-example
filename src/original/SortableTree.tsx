import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  Announcements,
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
  MeasuringStrategy,
  DropAnimation,
  Modifier,
  defaultDropAnimation,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  buildTree,
  flattenTree,
  getProjection,
  getChildCount,
  removeItem,
  removeChildrenOf,
  setProperty,
} from './utilities';
import type { FlattenedItem, SensorContext, TreeItems } from './types';
import { sortableTreeKeyboardCoordinates } from './keyboardCoordinates';
import { SortableTreeItem } from './components/TreeItem';


/**
 * Here we configure when and how often DndContext
 * should measure its droppable elements.
 */
const measuring = {
  droppable: {
    // Measure droppable elements before dragging begins,
    // right after dragging has begun, and after it ends.
    strategy: MeasuringStrategy.Always,
  },
};


/**
 * The animation that moves the dragged item to its new
 * or old position.
 */
const dropAnimationConfig: DropAnimation = {
  duration: defaultDropAnimation.duration,
  keyframes({ transform }) {
    return [
      {
        opacity: 1,
        transform: CSS.Transform.toString(transform.initial)
      },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: 'ease-out',
  // This is the animation that makes the item in teh final position
  // visible again
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};


/**
 * Properties expected by the SortableTree component.
 */
interface Props {
  /**
   * Initial set of items.
   */
  defaultItems?: TreeItems;

  /**
   * The items that have children can show/hide their children.
   */
  collapsible?: boolean;

  /**
   * Horizontal padding for each depth level.
   */
  indentationWidth?: number;

  /**
   * If true a blue line indicator replaces the content of the
   * item. If false the item is shown semi-transparent.
   */
  indicator?: boolean;

  /**
   * If true each item has a remove button.
   */
  removable?: boolean;
}


/**
 * Tree-view component.
 */
export function SortableTree({
  collapsible,
  defaultItems = [],
  indicator = false,
  indentationWidth = 50,
  removable,
}: Props) {

  // The items as a tree.
  const [items, setItems] = useState(defaultItems);

  // Tracks the item ID that is being dragged. null if not draggin.
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // The item ID that is beneath the dragged item.
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  // The horizontal offset of the pointer.
  const [offsetLeft, setOffsetLeft] = useState(0);

  const [currentPosition, setCurrentPosition] = useState<{
    parentId: UniqueIdentifier | null;
    overId: UniqueIdentifier;
  } | null>(null);


  // Create a flat list of items that are shown.
  const flattenedItems = useMemo(() => {
    // So we create a flat list from the tree...
    const flattenedTree = flattenTree(items);

    // Get a list of item IDs for collapsed items...
    const collapsedItems = flattenedTree.reduce<UniqueIdentifier[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children.length ? [...acc, id] : acc,
      []
    );

    // Then we remove all the children for collapsed items.
    // If an item is being moved then its children are also
    // hidden.
    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems
    );
  }, [activeId, items]);


  const projected =
    activeId && overId
      ? getProjection(
        flattenedItems,
        activeId,
        overId,
        offsetLeft,
        indentationWidth
      )
      : null;
  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });
  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(sensorContext, indicator, indentationWidth)
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [
    flattenedItems,
  ]);
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  const announcements: Announcements = {
    onDragStart({ active }) {
      return `Picked up ${active.id}.`;
    },
    onDragMove({ active, over }) {
      return getMovementAnnouncement(
        'onDragMove',
        active.id,
        over ? over.id : undefined
      );
    },
    onDragOver({ active, over }) {
      return getMovementAnnouncement(
        'onDragOver',
        active.id,
        over ? over.id : undefined
      );
    },
    onDragEnd({ active, over }) {
      return getMovementAnnouncement(
        'onDragEnd',
        active.id,
        over ? over.id : undefined
      );
    },
    onDragCancel({ active }) {
      return `Moving was cancelled. ${active.id} was dropped in its original position.`;
    },
  };

  return (
    <DndContext
      accessibility={{ announcements }}
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map(({ id, children, collapsed, depth }) => (
          <SortableTreeItem
            key={id}
            id={id}
            value={'' + id}
            depth={id === activeId && projected ? projected.depth : depth}
            indentationWidth={indentationWidth}
            indicator={indicator}
            collapsed={Boolean(collapsed && children.length)}
            onCollapse={
              collapsible && children.length
                ? () => handleCollapse(id)
                : undefined
            }
            onRemove={removable ? () => handleRemove(id) : undefined}
          />
        ))}
        {createPortal(
          <DragOverlay
            dropAnimation={dropAnimationConfig}
            modifiers={indicator ? [adjustTranslate] : undefined}
          >
            {activeId && activeItem ? (
              <SortableTreeItem
                id={activeId}
                depth={activeItem.depth}
                clone
                childCount={getChildCount(items, activeId) + 1}
                value={activeId.toString()}
                indentationWidth={indentationWidth}
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </SortableContext>
    </DndContext>
  );

  // Fires when a drag event that meets the activation constraints
  // for that sensor happens, along with the unique identifier of
  // the draggable element that was picked up.  
  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);

    const activeItem = flattenedItems.find(({ id }) => id === activeId);

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId,
      });
    }

    document.body.style.setProperty('cursor', 'grabbing');
  }

  // Fires anytime as the draggable item is moved.
  // Depending on the activated sensor, this could for example be as
  // the Pointer is moved or the Keyboard movement keys are pressed.
  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  // Fires when a draggable item is moved over a droppable container,
  // along with the unique identifier of that droppable container.
  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over ? over.id : null);
  }

  // Fires after a draggable item is dropped. 
  // This event contains information about the active draggable id
  // along with information on whether the draggable item was dropped over. 
  // If there are no collisions detected when the draggable item is dropped,
  // the over property will be null. If a collision is detected, the over
  // property will contain the id of the droppable over which it was dropped.
  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      setItems(newItems);
    }
  }

  // Fires if a drag operation is cancelled, for example, if the
  // user presses escape while dragging a draggable item.
  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty('cursor', '');
  }

  // The user clicked the delete button.
  function handleRemove(id: UniqueIdentifier) {
    setItems((items) => removeItem(items, id));
  }

  // The user clicked the expand/collapse button.
  function handleCollapse(id: UniqueIdentifier) {
    setItems((items) =>
      setProperty(items, id, 'collapsed', (value) => {
        return !value;
      })
    );
  }

  function getMovementAnnouncement(
    eventName: string,
    activeId: UniqueIdentifier,
    overId?: UniqueIdentifier
  ) {
    if (overId && projected) {
      if (eventName !== 'onDragEnd') {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return;
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId,
          });
        }
      }

      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === overId);
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

      const previousItem = sortedItems[overIndex - 1];

      let announcement;
      const movedVerb = eventName === 'onDragEnd' ? 'dropped' : 'moved';
      const nestedVerb = eventName === 'onDragEnd' ? 'dropped' : 'nested';

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1];
        announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
        } else {
          let previousSibling: FlattenedItem | undefined = previousItem;
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId: UniqueIdentifier | null = previousSibling.parentId;
            previousSibling = sortedItems.find(({ id }) => id === parentId);
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
          }
        }
      }

      return announcement;
    }

    return;
  }
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};
