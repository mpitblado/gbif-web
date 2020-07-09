/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import ThemeContext from '../../../style/themes/ThemeContext';
import React, { useEffect, useContext } from 'react';
import { FilterBody } from './misc';
import Footer from './Footer';
import { Option } from './Option';
import get from 'lodash/get';

const Exists = ({ footerProps, setFullField, filterHandle, onApply, onCancel, filter, hide, ...props }) => {
  const mustDefined = get(filter, `must.${filterHandle}[0]`);
  useEffect(() => {
    // set initial state
    const mustNotType = get(filter, `must_not.${filterHandle}[0].type`);
    if (mustNotType === 'isNotNull') {
      setFullField(filterHandle, [], [{type: 'isNotNull'}]);
    } else {
      setFullField(filterHandle, [{type: 'isNotNull'}], []);
    }
  }, []);

  return <>
    <FilterBody>
      <Option
        isRadio
        checked={!!mustDefined}
        onChange={() => {
          setFullField(filterHandle, [{type: 'isNotNull'}], []);
        }}
        label="Must be defined"
      />
      <Option
        isRadio
        checked={!mustDefined}
        onChange={() => {
          setFullField(filterHandle, [], [{type: 'isNotNull'}]);
        }}
        label="Must not be defined"
      />
    </FilterBody>
    <Footer {...footerProps}
      onApply={() => onApply({ filter, hide })}
      onCancel={() => onCancel({ filter, hide })}
    />
  </>
}

export default Exists;