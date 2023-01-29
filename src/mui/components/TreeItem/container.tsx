import { styled } from "@mui/material";


/**
 * Properties expected by the Container component.
 */
export interface ContainerProps {
    clone?: boolean;
    ghost?: boolean;
    indicator?: boolean;
}


/**
 * The div that contains the other elements in the item.
 */
export const Container = styled("div", {
    shouldForwardProp: (p: string) => !['ghost', 'indicator', 'clone'].includes(p)
})<ContainerProps>(({
    clone,
    ghost,
    indicator,
}) => ({
    width: "100%",

    position: "relative",
    display: "flex",
    alignItems: "center",
    backgroundColor: (ghost && indicator) ? '#56a1f8' : "#fff",
    border: "1px solid #dedede",
    color: "#222",
    boxSizing: "border-box",
    padding: (ghost && indicator) ? (
        0
    ) : (
        clone ? '5px 10px' : '10px 10px'
    ),

    paddingRight: clone ? '24px' : undefined,
    borderRadius: clone ? '4px' : undefined,
    boxshadow: clone ? '0px 15px 15px 0 rgba(34, 33, 81, 0.1)' : undefined,

    height: (ghost && indicator) ? '8px' : undefined,
    borderColor: (ghost && indicator) ? '#2389ff' : undefined,

    ":before": (ghost && indicator) ? {
        position: (ghost && indicator) ? 'absolute' : undefined,

        left: "-8px",
        top: "-4px",
        display: "block",
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        border: "1px solid #2389ff",
        backgroundColor: "#ffffff",
        content: '""',
    } : undefined,
    ">*": {
        // Items are hidden using height and opacity to retain focus 
        opacity: (ghost && indicator) ? 0 : undefined,
        height: (ghost && indicator) ? 0 : undefined,
        boxShadow: ghost ? "none" : undefined,
        backgroundColor: ghost ? "transparent" : undefined,

    }
}))
