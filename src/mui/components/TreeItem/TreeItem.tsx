import React, { forwardRef, HTMLAttributes } from 'react';
import classNames from 'classnames';

import './TreeItem.css';
import { Handle } from '../../../original/components/Handle';
import { Action } from '../../../original/components/Action';
import { Remove } from '../../../original/components/Remove';
import { Wrapper } from './wrapper';
import { Container } from './container';
import { Content } from './content';
import { Badge } from './badge';


/**
 * Properties expected by the TreeItem component.
 */
export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {

  /**
   * The number of children for this item.
   */
  childCount?: number;

  /**
   * Is this a regular item in the list or the floating item
   * presenting while being dragged?
   */
  clone?: boolean;

  /**
   * True if this item has children and the item is collapsed.
   */
  collapsed?: boolean;

  /**
   * The nested level (0 based integer).
   */
  depth: number;

  /**
   * Interaction is disabled while sorting.
   */
  disableInteraction?: boolean;

  /**
   * (used in iOS) Adds the `user-select: none;` style to
   * the item when true.
   */
  disableSelection?: boolean;

  /**
   * True while dragging (the item is fuzzy).
   */
  ghost?: boolean;

  /**
   * Properties passed to the handler component.
   */
  handleProps?: any;

  /**
   * If true a narrow blue line is shown in place of the item
   * while dragging. If false a washed-down clone of the item is shown.
   */
  indicator?: boolean;

  /**
   * Indentation for nested levels, in pixels.
   */
  indentationWidth: number;

  /**
   * The content of the item.
   */
  value: string;

  /**
   * Callback triggered by the expand/collapse button.
   */
  onCollapse?(): void;

  /**
   * Callback triggered by the remove button.
   */
  onRemove?(): void;

  /**
   * Passed to the outermost element of the tree item.
   */
  wrapperRef?(node: HTMLLIElement): void;
}


/**
 * A dumb component for representing an item based on the
 * properties it receives.
 * 
 * It is used both to render items in the tree as well as
 * the item that is being dragged.
 */
export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      wrapperRef,
      ...props
    },
    ref
  ) => (
    <Wrapper
      clone={clone}
      ghost={ghost}
      indicator={indicator}
      disableInteraction={disableInteraction}
      ref={wrapperRef}
      style={
        {
          '--spacing': `${indentationWidth * depth}px`,
        } as React.CSSProperties
      }
      {...props}
    >
      <Container
        clone={clone}
        ghost={ghost}
        indicator={indicator}
        ref={ref}
        style={style}
      >
        <Handle {...handleProps} />
        {onCollapse && (
          <Action
            onClick={onCollapse}
            className={classNames(
              'Collapse',
              collapsed && 'collapsed'
            )}
          >
            {collapseIcon}
          </Action>
        )}
        <Content
          className='Text'
          disableSelection={disableSelection}
        >
          {value}
        </Content>
        {!clone && onRemove && <Remove onClick={onRemove} />}
        {clone && childCount && childCount > 1 ? (
          <Badge>{childCount}</Badge>
        ) : null}
      </Container>
    </Wrapper>
  )
);

const collapseIcon = (
  <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41">
    <path d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z" />
  </svg>
);
