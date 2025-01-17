import { jsx, css } from '@emotion/react';
import React from 'react';
import useBelow from '../../utils/useBelow';

export default function DashBoardLayout({ children, predicate, queueUpdates = false, ...props }) {
  const isBelow800 = useBelow(800);

  // const childrenArray = (Array.isArray(children) ? children : [children]).map((child, index) => <DashboardSection>{child}</DashboardSection>);
  const childrenArray = (Array.isArray(children) ? children : [children]).map((child, index) => React.cloneElement(child, {style: {marginBottom: 12}}));
  if (isBelow800) {
    return <div css={css`padding-bottom: 200px;`}>{childrenArray}</div>
  }

  return <div css={css`
    display: flex; margin: -7px; padding-bottom: 200px; flex-wrap: wrap;
    > div {
      flex: 0 1 calc(50% - 12px); margin: 6px;
    }
  `}>
    <div>
      {childrenArray
        .filter((x, i) => i % 2 === 0)
        .map((x, i) => <React.Fragment key={i}>{x}</React.Fragment>)}
    </div>
    <div>
      {childrenArray
        .filter((x, i) => i % 2 !== 0)
        .map((x, i) => <React.Fragment key={i}>{x}</React.Fragment>)}
    </div>
  </div>
}