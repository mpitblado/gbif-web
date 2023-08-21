
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Prose, Properties, HyperText, Toc, ContactList, OccurrenceMap } from "../../../components";
import RouteContext from '../../../dataManagement/RouteContext';
import { Images, ThumbnailMap, TaxonomicCoverages, GeographicCoverages, TemporalCoverages, Registration, BibliographicCitations, SamplingDescription, Citation } from './details';
import qs from 'query-string';
import { FormattedNumber } from 'react-intl';
import { Link, useRouteMatch } from 'react-router-dom';
import { join } from '../../../utils/util';
import useBelow from '../../../utils/useBelow';

import { MdLockClock, MdFormatQuote, MdGridOn, MdPhotoLibrary } from 'react-icons/md';
import { GiDna1 } from 'react-icons/gi';
import { Dashboard } from './Dashboard';

// import {Toc} from "./Toc"
const { Term: T, Value: V } = Properties;

export function About({
  data = {},
  insights,
  loading,
  error,
  tocState,
  className,
  ...props
}) {
  const isBelowSidebar = useBelow(1000);
  let { url, path } = useRouteMatch();
  const theme = useContext(ThemeContext);
  const routeContext = useContext(RouteContext);
  const [tocRefs, setTocRefs] = useState({})
  const { dataset, occurrenceSearch, literatureSearch } = data;
  // collect all refs to headlines for the TOC, e.g. ref={node => { tocRefs["description"] = node; }}
  
  const hasOccurrenceSearch = routeContext?.occurrenceSearch?.disabled !== true;

  const isGridded = dataset?.gridded?.[0]?.percent > 0.5; // threshold decided in https://github.com/gbif/gridded-datasets/issues/3
  const hasDna = (insights?.data?.unfiltered?.facet?.dwcaExtension || []).find(ext => ext.key === 'http://rs.gbif.org/terms/1.0/DNADerivedData');

  const withCoordinates = insights?.data?.withCoordinates?.documents?.total;
  const withYear = insights?.data?.withYear?.documents?.total;
  const withTaxonMatch = occurrenceSearch?.documents?.total - insights?.data?.withTaxonMatch?.documents?.total;

  const total = occurrenceSearch?.documents?.total;
  const withCoordinatesPercentage = asPercentage(withCoordinates / total);
  const withYearPercentage = asPercentage(withYear / total);
  const withTaxonMatchPercentage = asPercentage(withTaxonMatch / total);

  const withEventId = insights?.data?.unfiltered?.cardinality?.eventId;
  const labelAsEventDataset = dataset.type === 'SAMPLING_EVENT' || withEventId > 1 && withEventId / total < 0.99; // Threshold chosen somewhat randomly. The issue is that some datasets assign random unique eventIds to all their occurrences. Those aren't really event datasets, it is a misunderstanding.

  const hasSamplingDescription = dataset?.samplingDescription?.studyExtent || dataset?.samplingDescription?.sampling || dataset?.samplingDescription?.qualityControl || (dataset?.samplingDescription?.methodSteps && dataset?.samplingDescription?.methodSteps?.length > 0);
  return <>
    <div css={css.withSideBar({ theme, hasSidebar: !isBelowSidebar })}>
      <div style={{ width: '100%', marginLeft: 12, overflow: 'auto' }}>

        {/* <OccurrenceMap rootPredicate={{
          type: 'equals',
          key: 'datasetKey',
          value: dataset.key
        }}/> */}
        {dataset.description && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["description"] = node; }}>Description</h2>
          <HyperText text={dataset.description} />
        </Prose>}
        {insights?.data?.images?.documents?.total > 0 && <>
          {/* We cannot register the images, because the TOC component puts it in the end - consider creating an issue for Thomas*/}
          {/* <h2 ref={node => { tocRefs["images"] = node; }}></h2> */}
          <Images images={insights?.data?.images} />
        </>}
        {dataset.purpose && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["purpose"] = node; }}>Purpose</h2>
          <HyperText text={dataset.purpose} />
        </Prose>}
        {dataset?.geographicCoverages?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["geographic-scope"] = node; }}>Geographic scope</h2>
          <GeographicCoverages geographicCoverages={dataset.geographicCoverages} />
        </Prose>}
        {dataset?.temporalCoverages?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["temporal-scope"] = node; }}>Temporal scope</h2>
          <TemporalCoverages temporalCoverages={dataset.temporalCoverages} />
        </Prose>}
        {dataset?.taxonomicCoverages?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["taxonomic-scope"] = node; }}>Taxonomic scope</h2>
          <TaxonomicCoverages taxonomicCoverages={dataset.taxonomicCoverages} />
        </Prose>}
        {hasSamplingDescription && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["methodology"] = node; }}>Methodology</h2>
          <SamplingDescription dataset={dataset} />
        </Prose>}
        {total > 1 && <>
          <Prose css={css.paper({ theme, transparent: true })} style={{paddingTop: 0, paddingBottom: 0}}>
            <h2 ref={node => { tocRefs["metrics"] = node; }}>Metrics</h2>
          </Prose>
          <Dashboard dataset={dataset} loading={loading} error={error}/>
        </>}
        {dataset.additionalInfo && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["additional-info"] = node; }}>Additional info</h2>
          <HyperText text={dataset.additionalInfo} />
        </Prose>}
        {dataset?.volatileContributors?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["contacts"] = node; }}>Contacts</h2>
          <ContactList contacts={dataset.volatileContributors} style={{ paddingInlineStart: 0 }} />
        </Prose>}
        {dataset?.bibliographicCitations?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["bibliographic-citations"] = node; }}>Bibliographic citations</h2>
          <BibliographicCitations bibliographicCitations={dataset?.bibliographicCitations} />
        </Prose>}

        {/* It isn't clear that this section really has much value for users of the website */}
        {/* {dataset?.dataDescriptions?.length > 0 && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["data-descriptions"] = node; }}>Data descriptions</h2>
          <DataDescriptions dataDescriptions={dataset?.dataDescriptions} />
        </Prose>} */}

        <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["registration"] = node; }}>Registration</h2>
          <Registration dataset={dataset} />
        </Prose>

        {dataset?.citation && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["citation"] = node; }}>Citation</h2>
          <Citation data={data} />
        </Prose>}
      </div>
      {!isBelowSidebar && <div css={css.sideBar({ theme })} style={{ margin: '0 0 0 12px' }}>
        <div>
          <div css={css.area}>
            <div css={css.testcard}>
              <div css={css.testicon}>
                <div><MdFormatQuote /></div>
              </div>
              <div css={css.testcontent}>
                <h5>
                  <Link to={join(url, 'citations')}><FormattedNumber value={literatureSearch.documents.total} /> citations</Link>
                </h5>
              </div>
            </div>
          </div>
          <div css={css.area}>
          { (total > 0 || dataset.type === 'OCCURRENCE') && <div css={css.testcardWrapper}>
              {total > 0 && <ThumbnailMap dataset={dataset}/>}
              <div css={css.testcard}>
                <div css={css.testcontent}>
                  <h5><FormattedNumber value={total} /> occurrences</h5>
                  {total > 0 && <>
                    <p>{withCoordinatesPercentage}% with coordinates</p>
                    <div css={css.progress}><div style={{ width: `${withCoordinatesPercentage}%` }}></div></div>

                    <p>{withYearPercentage}% with year</p>
                    <div css={css.progress}><div style={{ width: `${withYearPercentage}%` }}></div></div>

                    <p>{withTaxonMatchPercentage}% with taxon match</p>
                    <div css={css.progress}><div style={{ width: `${withTaxonMatchPercentage}%` }}></div></div>
                  </>}
                </div>
              </div>
            </div>}

            {hasDna && <div css={css.testcard}>
              <div css={css.testicon}>
                <div><GiDna1 /></div>
              </div>
              <div css={css.testcontent}>
                <h5>Includes DNA</h5>
                <p>There are records in this dataset that contain sequence data. Learn more about sequence derived occurrences here ...</p>
              </div>
            </div>}

            {/* <div css={css.testcard}>
              <div css={css.testicon}>
                <div><MdLockClock /></div>
              </div>
              <div css={css.testcontent}>
                <h5>History of stable IDs</h5>
                <p>Lorem ipsum sfhkjh sfhlksduf bksk sdkh sdfg </p>
              </div>
            </div> */}
  
            {labelAsEventDataset && <div css={css.testcard}>
              <div css={css.testicon}>
                <div><MdGridOn /></div>
              </div>
              <div css={css.testcontent}>
                <h5>Contains sampling events</h5>
                <p>This dataset contains sampling data. Sampling datasets typically allow for differnt types of analysis than more oportunistc datasets. Lorem ipsum dolores. Learn more about sampling datasets here ...</p>
              </div>
            </div>}

            {/* <div css={css.testcard}>
              <div css={css.testicon}>
                <div><MdPhotoLibrary /></div>
              </div>
              <div css={css.testcontent}>
                <h5>80% has images</h5>
                <p>Lorem ipsum sfhkjh sfhlksduf bksk sdkh sdfg </p>
              </div>
            </div> */}

            {isGridded && <div css={css.testcard}>
              <div css={css.testicon}>
                <div><MdGridOn /></div>
              </div>
              <div css={css.testcontent}>
                <h5>Gridded data</h5>
                <p>This dataset looks like it is gridded.</p>
              </div>
            </div>}
          </div>
        </div>
        <nav css={css.sideBarNav({ theme })}>
          <Toc refs={tocRefs} />
        </nav>
      </div>}
    </div>
  </>
};


function asPercentage(fraction, max = 100) {
  var formatedPercentage = 0;
  if (Number.isNaN(fraction)) {
    return 0;
  }
  if (!isFinite(fraction)) {
    return fraction;
  }
  fraction = 100 * fraction;
  if (fraction > 101) {
    formatedPercentage = fraction.toFixed();
  } else if (fraction > 100.1) {
    formatedPercentage = fraction.toFixed(1);
  } else if (fraction > 100) {
    formatedPercentage = 100.1;
  } else if (fraction == 100) {
    formatedPercentage = 100;
  } else if (fraction >= 99.9) {
    formatedPercentage = 99.9;
  } else if (fraction > 99) {
    formatedPercentage = fraction.toFixed(1);
  } else if (fraction >= 1) {
    formatedPercentage = fraction.toFixed();
  } else if (fraction >= 0.01) {
    formatedPercentage = fraction.toFixed(2);
  } else if (fraction < 0.01 && fraction != 0) {
    formatedPercentage = 0.01;
  }
  if (formatedPercentage > max) {
    formatedPercentage = max;
  }
  return formatedPercentage;
}
