import { UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type {
  FlattenedItem, TreeItem, TreeItems
} from './types';

/**
 * Constant indicating if we're under iOS.
 * 
 * We use this to disable the user selection if running under iOS.
 */
export const iOS = /iPad|iPhone|iPod/.test(navigator.platform);


/**
 * Computes the nesting level given a X offset.
 * 
 * @param offset Position on the X axis.
 * @param indentationWidth Number of pixels by which each nested
 *  level is indented relative to previous level
 * @returns an integer (0 for first level)
 */
function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}


/**
 * The shape of the result of `getProjection()` function.
 */
interface GetProjectionResult {
  /**
   * Minimum nesting level (0 based) that is possible for this item.
   */
  minDepth: number;

  /**
   * Maximum nesting level (0 based) that is possible for this item.
   */
  maxDepth: number;

  /**
   * Computed nesting level (0 based); minDepth <= depth <= maxDepth.
   */
  depth: number;
  parentId: UniqueIdentifier | null;
}


/**
 * Computes the location where the item will be moved given the
 * information from Dnd-Kit and position of the mouse.
 * 
 * @param items The list of items as a flat list.
 * @param activeId The ID of the item being moved
 * @param overId The ID of the item being hovered
 * @param dragOffset Position of the pointer on the X axis
 * @param indentationWidth Number of pixels by which each nested
 *  level is indented relative to previous level
 * @returns 
 */
export function getProjection(
  items: FlattenedItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number
): GetProjectionResult {

  // Locate the two items (active and hovered) in flat list.
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  if (overItemIndex === -1 || activeItemIndex === -1) {
    throw new Error(
      "[getProjection] Assertion error: failed to find items in list"
    )
  }
  const activeItem = items[activeItemIndex];

  // Create a new flat list with the active item moved in place of
  // the item being hovered.
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);

  // Compute the maximum depth based on the previous item:
  // - at most it can be previousItem.depth + 1
  // - at least it will be 0 if overItemIndex is 0.
  const previousItem = newItems[overItemIndex - 1];
  const maxDepth = previousItem ? previousItem.depth + 1 : 0;

  // Compute the minimum depth:
  // - at most it can be the same as the next item
  // - at least will be 0 if we are past last item.
  const nextItem = newItems[overItemIndex + 1]
  const minDepth = nextItem ? nextItem.depth : 0;

  // Compute the depth based on the X position of the pointer.
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;

  // Make sure that the returned depth is inside allowed interval
  // based on neighbouring items.
  let depth = projectedDepth;
  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  // And that's that.
  return { depth, maxDepth, minDepth, parentId: getParentId() };

  // Computes the parent ID based on computed depth
  function getParentId() {
    // A top level item has no parent.
    if (depth === 0 || !previousItem) {
      return null;
    }

    // Same depth as previous means that they will have same parent.
    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    // Deeper than previous => child of previous.
    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    // Shalower than previous => because we do not store a reference
    // to parent item we need to walk the list of visible items
    // upwards, starting from the previous item, until we find
    // an item that is at required depth. At that point we use
    // the same parent as that item.
    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    // This should not happen in well formed lists.
    if (!newParent) {
      console.warn("[getProjection]: a parent should have been found");
      return null;
    } else {
      return newParent;
    }
  }
}


/**
 * Create a flat list of items in top-to-bottom order.
 * 
 * The new array will copy the content of each tree item into the
 * flattened item and will also include information about:
 * - the ID of the parent item;
 * - the depth of the item (0-based integer);
 * - the index of the item inside its parent.
 * 
 * @param items The tree of items
 * @returns An array with one entry for each item in the tree.
 */
export function flattenTree(items: TreeItems): FlattenedItem[] {
  return flatten(items);

  function flatten(
    items: TreeItems,
    parentId: UniqueIdentifier | null = null,
    depth = 0
  ): FlattenedItem[] {
    return items.reduce<FlattenedItem[]>((acc, item, index) => {
      return [
        ...acc,

        // Copy data from source item.
        { ...item, parentId, depth, index },

        // Include children right after the item.
        ...flatten(item.children, item.id, depth + 1),
      ];
    }, []);
  }
}

/**
 * Recreate the tree of items from a flat list.
 * @param flattenedItems The flat list of items where topological
 *  information is stored explicitly.
 * @returns A tree of nested objects.
 */
export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
  // Create a fake root item to simplify the search below,
  const root: TreeItem = { id: 'root', children: [] };

  // Parent look-up dictionary.
  const nodes: Record<string, TreeItem> = { [root.id]: root };

  // Clone all flat items and add an empy children member in the result.
  const items = flattenedItems.map(({
    // TreeItem is not being followed because parentId
    // is still part of the item. Not removed because it
    // is used below.
    depth,
    index,
    ...item
  }) => ({ ...item, children: [] }));

  // Go through items and save childrens in parent's array.
  for (const item of items) {
    const { id, children } = item;
    const parentId = item.parentId ?? root.id;

    // Remove parentId as it is no longer required
    // to follow the TreeItem shape. Other members were removed above.
    delete (item as any).parentId;

    // We should already have this item available in
    // nodes give that we walk the list from top to bottom,
    let parent = nodes[parentId] ?? items.find(({ id }) => id === parentId)!;

    // Save the item for future children.
    nodes[id] = { id, children };

    // Append this item to parent's array.
    parent.children.push(item);
  }

  return root.children;
}


/**
 * Locate an item in the tree based on its ID.
 * 
 * The items are searched in the order that they apear
 * in the list (children first, then next item)
 * which is a Depth-First Search.
 * 
 * @param items The tree of items.
 * @param itemId The ID to locate
 * @returns the located instance or undefined
 */
export function findItemDeep(
  items: TreeItems,
  itemId: UniqueIdentifier
): TreeItem | undefined {

  // Go through each item at this leve.
  for (const item of items) {
    const { id, children } = item;

    if (id === itemId) {
      return item;
    }

    if (children.length) {
      // Recurse for children.
      const child = findItemDeep(children, itemId);

      if (child) {
        return child;
      }
    }
  }

  return undefined;
}


/**
 * Returns a clone of the tree with the item removed.
 * 
 * If no such item exists the function fails silently.
 * 
 * @param items The tree of items.
 * @param itemId The ID to locate and delete
 * @returns the new tree with that item removed
 */
export function removeItem(items: TreeItems, id: UniqueIdentifier) {
  const newItems = [];

  for (const item of items) {
    if (item.id === id) {
      continue;
    }

    if (item.children.length) {
      item.children = removeItem(item.children, id);
    }

    newItems.push(item);
  }

  return newItems;
}


/**
 * Returns a clone of the tree with a single property
 * changed for a single item.
 * 
 * Used to change the collapsed/expanded state.
 * 
 * @param items The tree of items.
 * @param id The ID of the item to edit.
 * @param property The key of the property to change.
 * @param setter A callback that gets as argument the old value
 *  and is expected to return the new value.
 * @returns the new tree with that item changed
 */
export function setProperty<T extends keyof TreeItem>(
  items: TreeItems,
  id: UniqueIdentifier,
  property: T,
  setter: (value: TreeItem[T]) => TreeItem[T]
) {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property]);
      continue;
    }

    if (item.children.length) {
      item.children = setProperty(item.children, id, property, setter);
    }
  }

  return [...items];
}


/**
 * Compute the number of children and grandchildren of an item.
 * 
 * If the ID is not found in the tree the method fails
 * silently and returns 0.
 * 
 * @param items The full tree of items
 * @param id The ID of the item to count the children for.
 * @returns the number of children for the item
 */
export function getChildCount(items: TreeItems, id: UniqueIdentifier) {
  const item = findItemDeep(items, id);

  return item ? countChildren(item.children) : 0;

  function countChildren(items: TreeItem[], count = 0): number {
    return items.reduce((acc, { children }) => {
      if (children.length) {
        return countChildren(children, acc + 1);
      }

      return acc + 1;
    }, count);
  }
}


/**
 * Create a clone of the flat array without the children of specified items.
 * 
 * We use this function to create a flat list of items that are expanded
 * (collapsed items show up in this list but not their children).
 * 
 * @param items The flat list of items.
 * @param ids The list of items for which the children shall be removed
 */
export function removeChildrenOf(
  items: FlattenedItem[],
  ids: UniqueIdentifier[]
) {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      // Will not include this item because its parent
      // is in the exclusion list.

      // Additionaly, we will not include the children of this item.
      if (item.children.length) {
        excludeParentIds.push(item.id);
      }

      return false;
    }

    return true;
  });
}
