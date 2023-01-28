import { CSSProperties } from "react";
import { SortableTree } from "../../original/SortableTree";
import { AppLayout } from "../layout/layout"
import { Controller, useContextData } from "./common"


/**
 * Style for the labels of tree-view properties.
 */
const labelStyle: CSSProperties = {
    padding: "2px",
    minWidth: "150px",
    display: "inline-block",
}

/**
 * Style for the inputs of tree-view properties.
 */
const inputStyle = {
    padding: "2px",
    width: "50px",
    display: "inline-block",
}


/**
 * This is where we pack the controls that can change the
 * properties of the tree.
 */
const Controls = () => {
    const {
        collapsible,
        setCollapsible,
        indicator,
        setIndicator,
        removable,
        setRemovable,
        indentationWidth,
        setIndentationWidth,
    } = useContextData();
    return (
        <>
            <div>
                <label htmlFor="collapsible" style={labelStyle}>collapsible</label>
                <input
                    id="collapsible"
                    type="checkbox"
                    checked={collapsible}
                    onChange={() => {
                        setCollapsible(!collapsible)
                    }}
                />
            </div>
            <div>
                <label htmlFor="indicator" style={labelStyle}>indicator</label>
                <input
                    id="indicator"
                    type="checkbox"
                    checked={indicator}
                    onChange={() => {
                        setIndicator(!indicator)
                    }}
                />
            </div>
            <div>
                <label htmlFor="removable" style={labelStyle}>removable</label>
                <input
                    id="removable"
                    type="checkbox"
                    checked={removable}
                    onChange={() => {
                        setRemovable(!removable)
                    }}
                />
            </div>
            <div>
                <label htmlFor="indentationWidth" style={labelStyle}>indentationWidth</label>
                <input
                    id="indentationWidth"
                    style={inputStyle}
                    type="number"
                    value={indentationWidth}
                    onChange={(ev) => {
                        setIndentationWidth(parseInt(ev.target.value))
                    }}
                />
            </div>
        </>
    )
}


/**
 * This is where we pack the controls that can change the
 * properties of the tree.
 */
const Example = () => {
    const {
        collapsible,
        indicator,
        removable,
        indentationWidth,
        treeOfItems
    } = useContextData();
    return (
        <SortableTree
            collapsible={collapsible}
            indicator={indicator}
            removable={removable}
            defaultItems={treeOfItems}
            indentationWidth={indentationWidth}
        />
    );
}


/**
 * The page showcasing the original example with minimal changes.
 */
export const OriginalPage = () => (
    <Controller>
        <AppLayout
            example={<Example />}
            controls={<Controls />}
        />
    </Controller>
)
