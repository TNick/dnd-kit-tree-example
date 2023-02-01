import { ReactNode } from "react";

/**
 * The user must provide a unique id for each node in the tree.
 *
 * The ID must be unique amongst all the items in the tree.
 */
export type DndTreeItemId = string | number;


/**
 * Internal representation of a tree item.
 * 
 * T is the type of the user item.
 */
export interface DndTreeItem<T = any> {
    /**
     * The unique identifier of this node.
     */
    id: DndTreeItemId;

    /**
     * Points to the parent item. Is null for top level items.
     */
    parent: DndTreeItem<T> | null;

    /**
     * Expanded/collapsed state of the node.
     */
    collapsed: boolean;

    /**
     * The depth of the item (0 means top-level).
     */
    level: number;

    /**
     * The number of immediate children.
     */
    children: number;

    /**
     * The user item from which this internal item was created.
     */
    source: T;
}


/**
 * Properties provided to the controller that are made available
 * in the context.
 */
export interface DndTreePassthrough<TData, TItem> {
    /**
     * The data is an opaque object form this library's perspective.
     * We use accesor functions to get the information out of it.
     */
    data: TData;

    /**
     * Retrieve the children of a node.
     *
     * @param data The (opaque) data as it was provided to the tree controller
     * @param node The node to retrieve the children of. May be `null`
     *   to retrieve the top level items.
     * @returns an empty array if there are no children or the
     *   list of immediate childrens of the node.
     */
    getNodeChildren: (data: TData, node: TItem | null) => TItem[];

    /**
     * Retrieve the number of immediate children for a node.
     *
     * @param data The (opaque) data as it was provided to the tree controller
     * @param node The node to retrieve the children of. May be `null`
     *   to retrieve the number of top level items.
     */
    getNodeChildrenCount: (data: TData, node: TItem | null) => number;

    /**
     * Retrieve the unique identifier of a node.
     *
     * @param data The (opaque) data as it was provided to the tree controller
     * @param node a node previously retrieved using `getNodeChildren()`.
     */
    getNodeId: (data: TData, node: TItem) => DndTreeItemId;

    /**
     * Get expanded/collapsed stat.
     *
     * @param data The (opaque) data as it was provided to the tree controller
     * @param node a node previously retrieved using `getNodeChildren()`.
     */
    getNodeExpanded: (data: TData, node: TItem) => boolean;
 
    /**
     * Retrieve the components to be rendered inside the item.
     *
     * @param data The (opaque) data as it was provided to the tree controller
     * @param node a node previously retrieved using `getNodeChildren()`.
     */
    getNodeContent: (data: TData, node: TItem) => ReactNode;
   
}
