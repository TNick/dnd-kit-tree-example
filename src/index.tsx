import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import { MuiPage } from './application/pages/page-mui';
import { OriginalPage } from './application/pages/page-original';


// our router with one path for each example.
const router = createBrowserRouter([
    {
        path: "/",
        element: <OriginalPage />,
    },
    {
        path: "/mui",
        element: <MuiPage />,
    },
]);

// Standard React setup.
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
