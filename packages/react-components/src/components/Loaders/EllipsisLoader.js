
import { css, jsx, keyframes } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { getClasses } from '../../utils/util';

export const ellipsis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

export const ellipsis2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
`;

export const ellipsis3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;

const ellipsisStyle = ({ error, theme }) => css`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: var(--color);
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  div:nth-child(1) {
    left: 8px;
    animation: ${ellipsis1} 0.6s infinite;
  }
  div:nth-child(2) {
    left: 8px;
    animation: ${ellipsis2} 0.6s infinite;
  }
  div:nth-child(3) {
    left: 32px;
    animation: ${ellipsis2} 0.6s infinite;
  }
  div:nth-child(4) {
    left: 56px;
    animation: ${ellipsis3} 0.6s infinite;
  }
`;

export function EllipsisLoader({ active, error, className, ...props }) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'stripeLoader', { active, error }, className);
  return <div {...classNames} css={ellipsisStyle} {...props}><div></div><div></div><div></div><div></div></div>
}