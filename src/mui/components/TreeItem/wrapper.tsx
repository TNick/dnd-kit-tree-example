import { ListItem, ListItemProps, styled } from "@mui/material";


/**
 * Properties expected by the Wrapper component.
 */
export interface WrapperProp extends ListItemProps {
    clone?: boolean;
    ghost?: boolean;
    indicator?: boolean;
    disableInteraction?: boolean;
}

/**
 * The outer element of a tree item.
 */
export const Wrapper = styled(ListItem, {
    shouldForwardProp: (p: string) => ![
        'ghost', 'clone', 'indicator', 'disableInteraction'
    ].includes(p),
})<WrapperProp>(({
    theme,
    clone,
    ghost,
    indicator,
    disableInteraction,
}) => ({
    pointerEvents: disableInteraction ? "none" : undefined,

    display: clone ? "inline-block" : "list-item",
    listStyle: "none",
    boxSizing: "border-box",
    margin: "0px",
    padding: "0px",
    paddingLeft: clone ? "10px" : "var(--spacing)",
    paddingTop: clone ? "5px" : undefined,
    marginBottom: "-1px",
    width: "100%",
    zIndex: (ghost && indicator) ? 1 : 0,
    opacity: (ghost && !indicator) ? 0.5 : 1.0,
    
    // .Wrapper.clone
    //   display: inline-block;
    //   pointer-events: none;
    //   padding: 0;
    //   padding-left: 10px;
    //   padding-top: 5px;

    // .Wrapper.ghost.indicator
    //   opacity: 1;
    //   position: relative;
    //   z-index: 1;
    //   margin-bottom: -1px;

    // .Wrapper.ghost:not(.indicator)
    //   opacity: 0.5;
}));


/*


*/