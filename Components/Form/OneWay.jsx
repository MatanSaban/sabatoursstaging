import React from "react";
import styles from "./priceform.module.scss";
import Way from "./Way";
import FormFooter from "./FormFooter";
import { formatDateToString } from "../../utils/functions";
const OneWay = (props) => {
  return (
    <div
      className={styles.twoWays}
      style={
        props?.stage == 1
          ? { transform: "translateX(0dvw)" }
          : props?.stage == 2
          ? { transform: "translateX(100dvw)" }
          : { transform: "translateX(200dvw)" }
      }
    >
      <Way
        windowWidth={props?.windowWidth}
        outboundAutocompleteRef={props.outboundAutocompleteRef}
        outboundEndPointAutocompleteRef={props?.outboundEndPointAutocompleteRef}
        outboundTotalDistance={props?.outboundTotalDistance}
        outboundTotalDuration={props?.outboundTotalDuration}
        outboundStopsAutocompleteRefs={props?.outboundStopsAutocompleteRefs}
        inboundTotalDistance={props?.inboundTotalDistance}
        inboundTotalDuration={props?.inboundTotalDuration}
        showDistance={props?.showDistance}
        formatDuration={props?.formatDuration}
        today={props?.today}
        CustomDateInput={props?.CustomDateInput}
        handleDateChange={props?.handleDateChange} 
        handleFields={props?.handleFields}
        handlePointSelect={props?.handlePointSelect}
        route={props?.route}
        routeInfo={props?.routeInfo}
        addNewStop={props?.addNewStop}
        removeStop={props?.removeStop}
        wayType={"outbound"}
        calculateRouteInformation={props?.calculateRouteInformation}
        calculateMinTime={props?.calculateMinTime}
        isToday={props?.isToday}
        wayTitle={"דרך הלוך"}
        stage={props.stage}
        handleStages={props?.handleStages}
        handlePopup={props?.handlePopup}
        eventTypes={props?.eventTypes}
        canProceed={props?.canProceed}

      />
      {
        props?.windowWidth < 769 &&
        <FormFooter
        handlePopup={props?.handlePopup}
        setRoute={props?.setRoute}
        route={props?.route}
        eventTypes={props?.eventTypes}
        canProceed={props?.canProceed}
        handleStages={props?.handleStages}
        stage={props?.stage}
        windowWidth={props?.windowWidth}
        formatDateToString={formatDateToString}
        formatDuration={props?.formatDuration}
        showDistance={props?.showDistance}
        sendDataToApp={props?.sendDataToApp}

      />
      }
    </div>
  );
};

export default OneWay;
