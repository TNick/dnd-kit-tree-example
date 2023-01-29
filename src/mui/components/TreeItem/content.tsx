import { styled } from "@mui/material";


/**
 * Properties expected by the Content component.
 */
export interface ContentProps {
    disableSelection?: boolean;
    clone?: boolean;
}


/**
 * The label of the item.
 */
export const Content = styled("span", {
    shouldForwardProp: (p: string) => !['disableSelection', 'clone'].includes(p),
})<ContentProps>(({
    disableSelection,
    clone,
}) => ({
    flexGrow: 1,
    paddingLeft: "0.5rem",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    userSelect: "none",

    // .disableSelection .Text
    //   userSelect: none,
    //   -webkit-user-select: none,

    // .clone .Text
    //   userSelect: none,
    //   -webkit-user-select: none,

}));
