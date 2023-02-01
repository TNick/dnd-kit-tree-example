import { appBarClasses } from '@mui/material';
import React from 'react';
import { appPages } from '../pages';
import './header.css';

/**
 * Our header with links for each example.
 */
export const AppHeader = () => (
    <div className="appHeader">
        <div className="navbar">
            <h2 className="logo">
                <a href="https://github.com/TNick/dnd-kit-tree-example">
                    dnd kit tree-view
                </a>
            </h2>
            <ul className="navbar-links">
                {appPages.map(p => (
                    <li key={p.path}>
                        <a href={p.path}>{p.label}</a>
                    </li>
                ))}
                <li><a href="https://dndkit.com/">dndkit.com</a></li>
            </ul>
        </div>
    </div>
);
