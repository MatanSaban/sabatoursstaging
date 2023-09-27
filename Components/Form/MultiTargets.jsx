import React, { useState } from 'react';
import Way from './Way';
import styles from './priceform.module.scss';

const MultiTargets = (props) => {
  const [routeCount, setRouteCount] = useState(1);

  const addRoute = () => {
    setRouteCount(routeCount + 1);
  };

  const removeRoute = () => {
    if (routeCount > 1) {
      setRouteCount(routeCount - 1);
    }
  };

  return (
    <div className={`${styles.multiTargets} ${styles.twoWays}`}>
      {Array.from({ length: routeCount }, (_, index) => (
        <Way wayTitle={`מסלול ${index + 1}`} key={index}
        outboundAutocompleteRef={props?.outboundAutocompleteRef}
        outboundEndPointAutocompleteRef={props?.outboundEndPointAutocompleteRef}
        outboundTotalDistance={props?.outboundTotalDistance}
        outboundTotalDuration={props?.outboundTotalDuration}
        outboundStopsAutocompleteRefs={props?.outboundStopsAutocompleteRefs}
        showDistance={props?.showDistance}
        formatDuration={props?.formatDuration}
        today={props?.today}
        CustomDateInput={props?.CustomDateInput}
        handleDateChange={props?.handleDateChange}
        handleFields={props?.handleFields}
        handlePointSelect={props?.handlePointSelect}
        route={props.route}
        routeInfo={props?.routeInfo}
        addNewStop={props?.addNewStop}
        removeStop={props?.removeStop}
        wayType={"outbound"}
        calculateRouteInformation={props?.calculateRouteInformation}
        calculateMinTime={props?.calculateMinTime}
        isToday={props?.isToday}
        />
      ))}
      <button onClick={addRoute}>Add Route</button>
      <button onClick={removeRoute}>Remove Route</button>
    </div>
  );
};

export default MultiTargets;
