import React, { CSSProperties } from 'react';
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { TreeItem, Props as TreeItemProps } from './TreeItem';
import { UniqueIdentifier } from '@dnd-kit/core';
import { iOS } from '../../../original/utilities';

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  isSorting || wasDragging ? false : true;


/**
 * Properties expected by the SortableTreeItem component.
 */
interface Props extends TreeItemProps {
  /**
   * Unique identifier for the item that we're representing here.
   */
  id: UniqueIdentifier;
}


/**
 * A smart component for representing an item in the tree-view.
 * 
 * Uses the `useSortable` dnd-kit hook to create the item and renders
 * the TreeItem with provided data.
 */
export function SortableTreeItem({ id, depth, ...props }: Props) {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
  });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={style}
      depth={depth}
      ghost={isDragging}
      disableSelection={iOS}
      disableInteraction={isSorting}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
    />
  );
}
