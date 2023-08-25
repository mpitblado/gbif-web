
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Button, Message } from '../../../components';
import LocaleContext from '../../../dataManagement/LocaleProvider/LocaleContext';
import env from '../../../../.env.json';

export function DownloadOptions({
  data,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const localeSettings = useContext(LocaleContext);
  const localePrefix = localeSettings?.localeMap?.gbif_org;
  const { dataset, occurrenceSearch } = data;
  const total = occurrenceSearch?.documents?.total;

  const fullPredicate = {
    type: 'equals',
    key: 'datasetKey',
    value: dataset.key
  };

  const dwcAEndpoint = dataset.endpoints.find(function(e) {
    return e.type == 'DWC_ARCHIVE';
  });

  return <div>
    <div css={css.options({ theme })}>
      {!!total && <div>
        <div css={css.card({ theme })}>
          <h4>GBIF annotated occurrence archive</h4>
          <div>
            <p>
              Download the occurrence records after GBIF processing. During processing, names, dates etc are normalised. The data is also enriched with information from other sources.
            </p>
            <p>
              Be aware that an account is needed to download the content.
            </p>
          </div>
          <Button
            as="a"
            href={`${env.GBIF_ORG}/${localePrefix ? `${localePrefix}/` : ''}occurrence/download/request?predicate=${encodeURIComponent(JSON.stringify(fullPredicate))}#create`}
            appearance="primary"><Message id="download.continueToGBIF" /></Button>
        </div>
      </div>}

      {dataset?.checklistBankDataset?.key && <div>
        <div css={css.card({ theme })}>
          <h4>Download from Checklist Bank</h4>
          <div>
            This archived comes to GBIF via Checklist Bank. Checklist Bank provides multiple download formats as well as options to filter checklists before downloading.
          </div>
          <Button as="a" appeance="outline" href={`${env.CHECKLIST_BANK_WEBSITE}/dataset/gbif-${dataset.key}/download`} rel="noopener noreferrer">Checklist Bank</Button>
        </div>
      </div>}

      {dwcAEndpoint && <div>
        <div css={css.card({ theme })}>
          <h4>Source archive</h4>
          <div>
            The source archive is the data as published to GBIF.
          </div>
          <Button as="a" appeance="outline" href={`${dwcAEndpoint.url}`} rel="noopener noreferrer">source archive</Button>
        </div>
      </div>}
      
    </div>
    <div>
      <div style={{color: "#888"}}>
        <p>
          For diagnostics you might want to look at the EML record after normalisation. <a href={`${env.API_V1}/dataset/${dataset.key}/document`}>Download processed EML</a>
        </p>
      </div>
    </div>
  </div>
};
