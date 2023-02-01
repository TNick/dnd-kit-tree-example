import { UniqueIdentifier } from "@dnd-kit/core";
import { FormGroup, List } from "@mui/material";
import { useCallback, useState } from "react";
import { useDndTree } from "../../controlled/context";
import { DndTreeController } from "../../controlled/controller";
import { DndTreeItemId } from "../../controlled/defs";
import { SortableTreeItem } from "../../mui/components/TreeItem";
import { TreeItem, TreeItems } from "../../original/types";
import { originalData } from "../data/original-data";
import { AppLayout } from "../layout/layout";
import { Controller, useContextData } from "./common";


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
        <FormGroup>

        </FormGroup>
    )
}


/**
 * This is an example list that takes the information from context.
 */
const ExampleUi = () => {
    const {
        removeItemFromTree,
        setExpandedState,
    } = useContextData();

    const {
        data,
        flat,
        getNodeContent
    } = useDndTree<TreeItem[], TreeItem>();

    return (
        <List>
            {flat.map(i => (
                <SortableTreeItem
                    key={i.id}
                    id={i.id}
                    depth={i.level}
                    indentationWidth={50}
                    value={getNodeContent(data, i.source)}
                    onRemove={() => removeItemFromTree(i.id)}
                    onCollapse={i.children ? () => setExpandedState(i.id, !i.collapsed) : undefined}
                />
            ))}
        </List>
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
        <DndTreeController<TreeItem[], TreeItem>
            data={treeOfItems}
            getNodeChildren={(data, node) => {
                console.log("getNodeChildren data %O, node %O", data, node);
                if (node === null) {
                    return data;
                } else {
                    return node.children || [];
                }
            }}
            getNodeChildrenCount={(data, node) => {
                console.log("getNodeChildrenCount data %O, node %O", data, node);
                if (node === null) {
                    return data.length;
                } else if (node.children) {
                    return node.children.length;
                } else {
                    return 0;
                }
            }}
            getNodeId={(data, node) => {
                return node.id;
            }}
            getNodeExpanded={(data, node) => {
                return !node.collapsed;
            }}
            getNodeContent={(data, node) => {
                return node.id;
            }}
        >
            <ExampleUi />
        </DndTreeController>
    );
}


/**
 * The page uses the controlled version.
 */
export const ControlledPage = () => (
    <Controller>
        <AppLayout
            example={<Example />}
            controls={<Controls />}
        />
    </Controller>
)
