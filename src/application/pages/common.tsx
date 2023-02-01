import { UniqueIdentifier } from "@dnd-kit/core";
import { createContext, ReactNode, useContext, useReducer } from "react"
import { TreeItem, TreeItems } from "../../original/types";
import { originalData } from "../data/original-data";


/**
 * The data placed in context by Controller.
 * 
 * These are the properties accepted by the tree and their setters.
 */
interface ControllerData {
    collapsible: boolean;
    setCollapsible: (value: boolean) => void;

    indicator: boolean;
    setIndicator: (value: boolean) => void;

    removable: boolean;
    setRemovable: (value: boolean) => void;

    indentationWidth: number;
    setIndentationWidth: (value: number) => void;

    treeOfItems: TreeItems;
    setTreeOfItems: (treeOfItems: TreeItems) => void;
    addItemToTree: (
        value: TreeItem,
        parentId: UniqueIdentifier | undefined
    ) => void;
    removeItemFromTree: (itemId: UniqueIdentifier) => void;
    setExpandedState: (itemId: UniqueIdentifier, collapsed: boolean) => void;
}


/**
 * The state of the controller.
 */
type State = Omit<
    ControllerData,
    "setCollapsible" | "setIndicator" | "setRemovable" |
    "setIndentationWidth" | "setTreeOfItems" |
    "addItemToTree" | "removeItemFromTree" |
    "setExpandedState"
>;


/**
 * Our context for Controller data.
 */
const context = createContext<ControllerData | null>(null);
const Provider = context.Provider;


/**
 * Our controller that keeps the information in a context.
 */
export const Controller = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(
        (
            state: State,
            action: {
                type: keyof State,
                value: boolean | number | TreeItems
            }
        ) => {
            return {
                ...state,
                [action.type]: action.value,
            }
        },
        {
            collapsible: true,
            indicator: true,
            removable: true,
            indentationWidth: 50,
            treeOfItems: JSON.parse(JSON.stringify(originalData)),
        }
    )
    return (
        <Provider value={{
            ...state,
            setCollapsible: (value: boolean) => {
                dispatch({ type: "collapsible", value });
            },
            setIndicator: (value: boolean) => {
                dispatch({ type: "indicator", value });
            },
            setRemovable: (value: boolean) => {
                dispatch({ type: "removable", value });
            },
            setIndentationWidth: (value: number) => {
                dispatch({ type: "indentationWidth", value });
            },
            setTreeOfItems: (value: TreeItems) => {
                dispatch({ type: "treeOfItems", value });
            },
            addItemToTree: (value: TreeItem, parentId: UniqueIdentifier | undefined) => {
                if (parentId) {
                    let parent = locateItemById(parentId, state.treeOfItems);
                    if (parent) {
                        parent.children.push(value);
                        dispatch({
                            type: "treeOfItems",
                            value: [...state.treeOfItems,]
                        });
                    } else {
                        throw new Error("Unknown parent");
                    }
                } else {
                    dispatch({
                        type: "treeOfItems",
                        value: [...state.treeOfItems, value]
                    });
                }
            },
            removeItemFromTree: (itemId: UniqueIdentifier) => {
                const newValue = JSON.parse(JSON.stringify(state.treeOfItems));
                console.log("[Controller.removeItemFromTree] itemId %O", itemId);
                removeItemById(itemId, newValue);
                console.log("[Controller.removeItemFromTree] after removeItemFromTree %O", newValue);
                dispatch({
                    type: "treeOfItems",
                    value: newValue
                });
            },
            setExpandedState: (itemId: UniqueIdentifier, collapsed: boolean) => {
                const newValue = JSON.parse(JSON.stringify(state.treeOfItems));
                const item = locateItemById(itemId, newValue);
                if (item) {
                    item.collapsed = collapsed;
                }
                dispatch({
                    type: "treeOfItems",
                    value: newValue
                });
            },
        }}>
            {children}
        </Provider>
    );

    function locateItemById(
        id: UniqueIdentifier, where: TreeItems
    ): TreeItem | undefined {
        for (let i = 0; i < where.length; i++) {
            let item: TreeItem | undefined = where[i];
            if (item.id === id) {
                return item;
            }
            item = locateItemById(id, item.children);
            if (item) {
                return item;
            }
        }
        return undefined;
    }

    function removeItemById(id: UniqueIdentifier, where: TreeItems): boolean {
        console.log("[Controller.removeItemById] itemId %O where %O", id, where);

        for (let i = 0; i < where.length; i++) {
            let item: TreeItem | undefined = where[i];
            if (item) {
                if (item.id === id) {
                    console.log("[Controller.removeItemById] found %O", item);
                    delete where[i];
                    return true;
                }
                if (removeItemById(id, item.children)) {
                    return true;
                }
            }
        }
        return false;
    }
}

/**
 * A simple hook to pick the information from context.
 */
export const useContextData = () => {
    return useContext(context)!;
}
