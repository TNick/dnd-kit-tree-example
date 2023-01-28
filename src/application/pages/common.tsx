import { createContext, ReactNode, useContext, useReducer } from "react"
import { TreeItems } from "../../original/types";
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
}


/**
 * The state of the controller.
 */
type State = Omit<
    ControllerData,
    "setCollapsible" | "setIndicator" | "setRemovable" | 
    "setIndentationWidth" | "setTreeOfItems"
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
            treeOfItems: originalData
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
            }
        }}>
            {children}
        </Provider>
    )
}

/**
 * A simple hook to pick the information from context.
 */
export const useContextData = () => {
    return useContext(context)!;
}
