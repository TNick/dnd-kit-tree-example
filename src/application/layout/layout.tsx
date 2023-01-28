import { ReactNode } from 'react';
import { AppHeader } from './header';
import './layout.css';

/**
 * Properties expected by the AppLayout component.
 */
export interface AppLayoutProps {
    /// The main component that we're presenting in this page.
    example: ReactNode;

    /// Controls for the properties of the example.
    controls?: ReactNode;
}

/**
 * The layout for our pages.
 */
export const AppLayout = ({
    example,
    controls
}: AppLayoutProps) => {
    return (
        <div className="appLayout">
            <AppHeader />
            <div className="appContent">
                <div className="appExample">
                    {example}
                </div>
                <div className="appSidebar">
                    {controls}
                </div>
            </div>
        </div>
    )
}
