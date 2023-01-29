import { styled } from "@mui/material";


/**
 * Properties expected by the Badge component.
 */
export interface BadgeProps {
    disableSelection?: boolean;
    clone?: boolean;
}

/**
 * The label of the item.
 */
export const Badge = styled("span", {
    shouldForwardProp: (p: string) => !['disableSelection', 'clone'].includes(p)
})<BadgeProps>(({
    disableSelection,
    clone,
}) => ({
    position: "absolute",
    top: "-10px",
    right: "-10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "#2389ff",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#fff",
    userSelect: "none",

    // .disableSelection .Count
    //   userSelect: "none",
    //   -webkit-user-select: "none",

    // .clone .Count
    //   userSelect: "none",
    //   -webkit-user-select: "none",
}));
