import React, { useContext, useState, useEffect } from 'react';
import { MdInfo, MdClose } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Tabs } from "../../components";
import { useQuery } from '../../dataManagement/api';
import { Intro } from './details/Intro';

const { TabList, Tab, TabPanel } = Tabs;

export function EventSidebar({
  onImageChange,
  onCloseRequest,
  eventId,
  datasetKey,
  defaultTab,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(EVENT, { lazyLoad: true, graph: 'EVENT' });
  const [activeId, setTab] = useState( 'details');
  const theme = useContext(ThemeContext);
  const [activeImage, setActiveImage] = useState();
  const [fieldGroups, setFieldGroups] = useState();

  useEffect(() => {
    if (typeof eventId !== 'undefined') {
      load({ variables: { eventID: eventId, datasetKey: datasetKey } });
    }
  }, [eventId, datasetKey]);

  useEffect(() => {
    if (!loading) {
      setTab('details');
    }
    if (!loading && data?.event) {
     setFieldGroups(data.event.groups);
    }
  }, [data, loading]);

  return <Tabs activeId={activeId} onChange={id => setTab(id)}>
    <Row wrap="nowrap" style={style} css={css.sideBar({ theme })}>
      <Col shrink={false} grow={false} css={css.detailDrawerContent({ theme })} >
        <TabPanel tabId='details' style={{height: '100%'}}>
          <Intro
              setActiveImage={id => { setActiveImage(id); setTab('images') }}
              fieldGroups={fieldGroups}
              data={data}
              loading={loading}
              error={error}
          />
        </TabPanel>
      </Col>
    </Row>
  </Tabs>
};

const EVENT = `
query event($eventID: String, $datasetKey: String){
  event(eventID: $eventID, datasetKey: $datasetKey) {
    eventId
    parentEventId
    eventType {
      concept
    }
    coordinates
    countryCode
    datasetKey
    datasetTitle
    kingdoms
    phyla
    classes
    orders
    families
    genera
    year
    month
    occurrenceCount
    measurementOrFactTypes
    measurementOrFactCount
    sampleSizeValue
    samplingProtocol
    eventTypeHierarchyJoined
    eventHierarchyJoined
    decimalLatitude
    decimalLongitude
    locality
  }
}
`;

