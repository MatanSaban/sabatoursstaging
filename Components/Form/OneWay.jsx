import React from "react";
import styles from "./priceform.module.scss";
import Way from "./Way";
const OneWay = (props) => {
  return <div className={styles.twoWays}>
    <Way         
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
        wayTitle={"דרך הלוך"}
        handleStages={props?.handleStages}
        stage={props?.stage}
/>
  </div>;
};

export default OneWay;
