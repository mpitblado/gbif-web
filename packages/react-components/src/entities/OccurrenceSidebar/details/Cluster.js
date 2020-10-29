/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col, Image, Properties, IconFeatures } from "../../../components";
import { useQuery } from '../../../dataManagement/api';
import { Header } from './Header';
import { prettifyEnum } from '../../../utils/labelMaker/config2labels';

const { Term: T, Value: V } = Properties;

export function Cluster({
  data,
  loading: keyLoading,
  activeImage, setActiveImage,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { data: cluster, error, loading: clusterLoading, load } = useQuery(CLUSTER, { lazyLoad: true });

  useEffect(() => {
    if (typeof data !== 'undefined') {
      load({ variables: { key: data.occurrence.key } });
    }
  }, [data]);

  const related = cluster?.occurrence?.related;
  if (!data || clusterLoading || !related) {
    return <div>Loading</div>;
  }

  return <div style={{ padding: '12px 16px' }}>
    <Header data={data} />
    <main style={{ marginTop: 24 }}>
      {related.map(x => {
        return <RelatedOccurrence key={x.occurrence.key} related={x.occurrence} reasons={x.reasons} original={data.occurrence} />
      })}
    </main>
  </div>
};

export function RelatedOccurrence({ original, reasons, related, ...props }) {
  const theme = useContext(ThemeContext);
  return <article css={css.clusterCard({ theme })}>
    <Row wrap="nowrap" halfGutter={6} style={{ padding: 12 }}>
      <Col>
        <h4 style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: related.gbifClassification.usage.formattedName }}></h4>
        <div css={css.entitySummary({ theme })}>
          <IconFeatures css={css.features({ theme })}
            eventDate={related.eventDate}
            countryCode={related.countryCode}
            locality={related.locality}
          />
          <IconFeatures css={css.features({ theme })}
            stillImageCount={related.stillImageCount}
            movingImageCount={related.movingImageCount}
            soundCount={related.soundCount}
            typeStatus={related.typeStatus}
            basisOfRecord={related.basisOfRecord}
            isSequenced={related.volatile.features.isSequenced}
            isTreament={related.volatile.features.isTreament}
            isClustered={related.volatile.features.isClustered}
            isSamplingEvent={related.volatile.features.isSamplingEvent}
            issueCount={related.issues?.length}
          />
        </div>
        <div>
          <Properties style={{ fontSize: 12 }} horizontal dense>
            <T>Publisher</T><V>{related.publisherTitle}</V>
            <T>Dataset</T><V>{related.datasetTitle}</V>
          </Properties>
        </div>
      </Col>
      <Col grow={false} shrink={false}>
        <div >
          {related?.primaryImage?.identifier && <Image style={{ width: 150, height: 150, display: 'block' }} src={related.primaryImage.identifier} w={180} h={180} />}
          {!related?.primaryImage?.identifier && related.coordinates && <img style={{ width: 150, height: 150, display: 'block' }} src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${related.coordinates.lon},${related.coordinates.lat})/${related.coordinates.lon},${related.coordinates.lat},8,0/180x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`} />}
        </div>
      </Col>
    </Row>
    <div css={css.clusterFooter({ theme })}>
      <Properties style={{ fontSize: 12 }} horizontal dense>
        <T>Similarities</T>
        <V>{ reasons.map(reason => <span css={css.chip({ theme })} key={reason}>{prettifyEnum(reason)}</span>) }</V>
      </Properties>
    </div>
  </article>
};

const CLUSTER = `
query occurrence($key: ID!){
  occurrence(key: $key) {
  	related {
      reasons
      occurrence {
        key
        basisOfRecord
        datasetTitle
        publisherTitle
        coordinates
        typeStatus
        soundCount
        stillImageCount
        movingImageCount
        eventDate
        primaryImage {
          identifier
        }
        gbifClassification {
          usage {
            formattedName
          }
        }
        volatile {
          features {
            isSequenced
            isSamplingEvent
            isTreament
          }
        }
      }
    }
  }
}
`;