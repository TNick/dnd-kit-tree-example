import { UniqueIdentifier } from '@dnd-kit/core';
import type {MutableRefObject} from 'react';


/**
 * One item in the tree of items.
 * 
 * The topological information is stored implicitly.
 * 
 * The initial object reference is not used (
 * so collapsed will never change in this item even if the user
 * changes the state of the coresponding item).
 */
export interface TreeItem {
  /**
   * A unique identifier for the item.
   */
  id: UniqueIdentifier;

  /**
   * The list of children items.
   */
  children: TreeItem[];

  /**
   * Expanded/collapsed state of this item.
   */
  collapsed?: boolean;
}


/**
 * A full set of items provided to a tree-view.
 */
export type TreeItems = TreeItem[];


/**
 * An item that explicitly stores the topological information.
 * 
 * Is derived from TreeItem in `flattenTree()` and is used
 * internally to track the state of all items.
 */
export interface FlattenedItem extends TreeItem {
  /**
   * The unique ID of the immediate parent.
   */
  parentId: UniqueIdentifier | null;

  /**
   * 0-based nesting level of the item.
   */
  depth: number;

  /**
   * 0-based index of this item inside the parent item.
   */
  index: number;
}


export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;
