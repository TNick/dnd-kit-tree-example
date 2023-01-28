import {
    FormGroup,
    FormControlLabel, Checkbox,
    Input,
} from '@mui/material';

import { SortableTree } from "../../original/SortableTree";
import { AppLayout } from "../layout/layout"
import { Controller, useContextData } from "./common"


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
            <FormControlLabel
                control={
                    <Checkbox
                        checked={collapsible}
                        onChange={() => {
                            setCollapsible(!collapsible)
                        }}
                    />
                }
                label="collapsible"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={indicator}
                        onChange={() => {
                            setIndicator(!indicator)
                        }}
                    />
                }
                label="indicator"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={removable}
                        onChange={() => {
                            setRemovable(!removable)
                        }}
                    />
                }
                label="removable"
            />
            <Input
                value={indentationWidth}
                inputProps={{
                    type: "number"
                }}
                onChange={(ev) => {
                    setIndentationWidth(parseInt(ev.target.value))
                }}
            />
        </FormGroup>
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
 * The page showcasing the original example but using MUI for styling.
 */
export const MuiPage = () => (
    <Controller>
        <AppLayout
            example={<Example />}
            controls={<Controls />}
        />
    </Controller>
)
