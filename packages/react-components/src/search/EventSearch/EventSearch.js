import React from 'react';
import List from './views/List';
import Table from './views/Table';
import predicateConfig from './config/predicateConfig';
import defaultFilterConfig from './config/filterConf';
import { default as StandardSearch } from '../Search';
import EventLayout from './EventSearchPageLayout';

function Search(props) {
  return <StandardSearch {...{ ...props, predicateConfig, defaultFilterConfig, List, Table }} layout={EventLayout} />
}

export default Search;