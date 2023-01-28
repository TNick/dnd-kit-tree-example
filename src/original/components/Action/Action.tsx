import React, {
  forwardRef, CSSProperties, HTMLAttributes
} from 'react';
import classNames from 'classnames';

import './Action.css';


/**
 * Properties expected by the Action component.
 */
export interface Props extends HTMLAttributes<HTMLButtonElement> {
  /**
   * Styles override for when the button/action is pressed
   * (fill is used for the color of the svg icon).
   */
  active?: {
    fill: string;
    background: string;
  };

  /**
   * The shape of the mouse pointer.
   */
  cursor?: CSSProperties['cursor'];
}


/**
 * A button with customizable pressed apparence.
 * 
 * This is the base for other buttons in the application.
 * 
 * Style accepts `--action-background` asvariable for
 * hover background color customization.
 * 
 */
export const Action = forwardRef<HTMLButtonElement, Props>(
  ({ active, className, cursor, style, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      className={classNames('Action', className)}
      tabIndex={0}
      style={
        {
          ...style,
          cursor,
          '--fill': active?.fill,
          '--background': active?.background,
        } as CSSProperties
      }
    />
  )
);
