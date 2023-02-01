import { ControlledPage } from "./page-controlled";
import { MuiPage } from "./page-mui";
import { OriginalPage } from "./page-original";

export const appPages = [
    {
        path: "/",
        element: <OriginalPage />,
        label: "Original",
    },
    {
        path: "/mui",
        element: <MuiPage />,
        label: "MUI",
    },
    {
        path: "/controlled",
        element: <ControlledPage />,
        label: "Controlled",
    },
];
