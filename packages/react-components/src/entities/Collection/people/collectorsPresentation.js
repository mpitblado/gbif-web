import React, { useCallback, useState } from 'react';
import { Button, DataTable, Th, Td, TBody, Input } from '../../../components';
import * as css from './styles';
import { FormattedMessage, FormattedNumber } from 'react-intl';

export const CollectorsPresentation = ({ size, search, loadMore, loading, data, error }) => {
  const [q, setQ] = useState('');

  if (loading && !data) return <div>loading</div>;

  const items = data.occurrenceSearch.facet.recordedBy.map(x => {
    return {
      key: x.key,
      name: x.key,
      collected: x.count,
      identified: x.occurrencesIdentifiedBy.documents.total,
    }
  });

  let hasNoResults = q.length > 0 && items.length === 0 && !loading;

  const columns = ['name', 'collected', 'identified'];
  const headerss = [
    <Th key="name">Recorded by</Th>,
    <Th key="collected" style={{textAlign: 'right'}}>Recorded count</Th>,
    <Th key="identifed" style={{textAlign: 'right'}}>Identified count</Th>
  ];

  return <>
    <div style={{
      flex: "1 1 100%"
    }}>
      <div css={css.search}>
        <Input value={q} onChange={e => setQ(e.target.value)} />
        <Button onClick={e => search(q)}>Search</Button>
      </div>
      {hasNoResults && <div>No results for '{q}'</div>}
      {!hasNoResults && <>
        <DataTable {...{ loading }}>
          <thead>
            <tr>{headerss}</tr>
          </thead>
          <TBody rowCount={10} columnCount={7} loading={loading}>
            {getRows({ items, columns })}
          </TBody>
        </DataTable>
        {(loading || size === items.length) && <Button loading={loading} style={{ marginTop: 12 }} onClick={loadMore}>Load more</Button>}
      </>
      }
    </div>
  </>
}

const getRows = ({ items }) => {
  const rows = items.map((row, index) => {
    const cells = [
      <Td key='name'>{row.name}</Td>,
      <Td key='collected' style={{textAlign: 'right'}}><FormattedNumber value={row.collected} /></Td>,
      <Td key='identified' style={{textAlign: 'right'}}><FormattedNumber value={row.identified} /></Td>
    ]
    return <tr key={row.key}>{cells}</tr>;
  });
  return rows;
}