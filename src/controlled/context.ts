import { createContext, useContext } from "react";
import { DndTreeItem, DndTreePassthrough } from "./defs";


/**
 * The data exposed in the context by the controller.
 */
export interface DndTreeContextData<TData, TItem>
    extends DndTreePassthrough<TData, TItem> {

    /// The list of visible items.
    flat: DndTreeItem<TItem>[];
}


/**
 * The context used by the DndTree.
 */
export const dndTreeContext = createContext<DndTreeContextData<
    any,
    any
> | null>(null);


/**
 * The provider used by the controller.
 */
export const DndTreeProvider = dndTreeContext.Provider;


/**
 * A hook that gets the DndTree data from context.
 */
export function useDndTree<TData, TItem>(): DndTreeContextData<TData, TItem> {
    return useContext(dndTreeContext)!;
}
