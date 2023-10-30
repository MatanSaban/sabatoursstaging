import React, { useEffect, useRef, useState } from "react";
import { BiSolidTimeFive } from "react-icons/bi";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import DatePicker from "react-datepicker";
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";
import he from "date-fns/locale/he";
import { registerLocale } from "react-datepicker";
import { format } from "date-fns";
import { Autocomplete } from "@react-google-maps/api";
import stopIcon from "../../public/media/stopIcon.svg";
import locationIcon from "../../public/media/sabantoursLocationIcon.svg";
import endPointIcon from "../../public/media/saban_tours_favicon_pinkred_green.svg";
import styles from "./priceform.module.scss";
import { isMobile } from "../../utils/functions";
import DateTimePicker from "./DateAndTimeComp";

registerLocale("he", he);

const ConditionalWrapper = ({ condition, children }) =>
  condition ? (
    <div className={styles.mobileConditionalPointInpWrapper}>{children}</div>
  ) : (
    children
  );
const ConditionalDateTimeWrapper = ({ condition, children }) =>
  condition ? (
    <div className={styles.mobileConditionalDateTimeWrapper}>{children}</div>
  ) : (
    children
  );

const Way = ({
  wayType,
  routeInfo,
  handlePointSelect,
  CustomDateInput,
  calculateRouteInformation,
  minTime,
  inboundMinTime,
  wayTitle,
  handleStages,
  ...props
}) => {



  const endPointInputRef = useRef(null);

  
  const [datePickerRef , setDatePickerRef] = useState();

  useEffect(() => {
  },[datePickerRef])

  const totalDistance = // formatDuration
    // showDistance
    wayType == "outbound"
      ? props?.showDistance(parseFloat(props?.outboundTotalDistance))
      : props?.showDistance(parseFloat(props?.inboundTotalDistance));
  const totalDuration =
    wayType == "outbound"
      ? props?.formatDuration(props?.outboundTotalDuration)
      : props?.formatDuration(props?.inboundTotalDuration);
  const route = props?.route?.[wayType];
  const startPointAutocompleteRef = props[`${wayType}AutocompleteRef`];
  const endPointAutocompleteRef = props[`${wayType}EndPointAutocompleteRef`];
  const stopsAutocompleteRefs =
    wayType == "outbound"
      ? props?.outboundStopsAutocompleteRefs
      : props?.inboundStopsAutocompleteRefs;
  const addStopText =
    wayType === "outbound" ? "הוספת תחנה בדרך הלוך" : "הוספת תחנה בדרך חזור";

  const minTimeValue = () => {
    if (wayType === "outbound") {
      if (props?.isToday(route?.startPoint?.date)) {
        return new Date(
          props.today.getFullYear(),
          props.today.getMonth(),
          props.today.getDate(),
          props.today.getHours() + 2,
          0
        );
      } else {
        return new Date(
          props.today.getFullYear(),
          props.today.getMonth(),
          props.today.getDate(),
          0,
          0
        );
      }
    } else if (wayType === "inbound") {
      if (props?.isToday(route?.startPoint?.date)) {
        return props?.minTimeInbound;
      } else {
        // Check if the chosen inbound date is the same as the overflowed outbound date
        const inboundDate = new Date(route?.startPoint?.date);
        const overflowedOutboundDate = new Date(props?.minTimeInbound);
        if (
          inboundDate.getDate() === overflowedOutboundDate.getDate() &&
          inboundDate.getMonth() === overflowedOutboundDate.getMonth() &&
          inboundDate.getFullYear() === overflowedOutboundDate.getFullYear()
        ) {
          return props?.minTimeInbound;
        } else {
          return new Date(
            props.today.getFullYear(),
            props.today.getMonth(),
            props.today.getDate(),
            0,
            0
          ); // If the chosen inbound date is not the overflowed outbound date, set minTime to 00:00
        }
      }
    }
  };

  const resolvedMinTimeValue = minTimeValue();


  const [buttonTextByRouteType, setButtonTextByRouteType] = useState(
    props?.stage
  );

  useEffect(() => {
    switch (props.route.routeType) {
      case "OneWay":
        if (props.stage === 1) {
          setButtonTextByRouteType("פרטי נסיעה אחרונים");
        }
        break;
      case "TwoWays":
        if (props.stage == 1) {
          setButtonTextByRouteType("פרטי דרך חזור");
        } else if (props.stage == 2) {
          setButtonTextByRouteType("פרטי נסיעה אחרונים");
        }
        break;
    }
  }, [props.stage, props.route.routeType]);

  const canProceedStep = (props) => {
    const routeType = props?.route?.routeType;

    const checkPointDetails = (point) => {
      return !!(point?.date && point?.time && point?.address);
    };

    if (routeType === "OneWay") {
      const startPointValid = checkPointDetails(
        props?.route?.outbound?.startPoint
      );
      const endPointValid =
        props?.route?.outbound?.endPoint?.address?.length > 0;
      return startPointValid && endPointValid;
    } else if (routeType === "TwoWays") {
      if (props?.stage == 1) {
        return (
          checkPointDetails(props?.route?.outbound?.startPoint) &&
          props?.route?.outbound?.endPoint?.address
        );
      } else {
        return (
          checkPointDetails(props?.route?.outbound?.startPoint) &&
          props?.route?.outbound?.endPoint?.address &&
          checkPointDetails(props?.route?.inbound?.startPoint) &&
          props?.route?.inbound?.endPoint?.address
        );
      }
    }

    return false;
  };

  return (
    <>
      <div className={`${styles[wayType]} ${styles.wayStyle} way`} id={wayType}>
        <h3>{wayTitle}</h3>
        <div className={styles.fields}>
          <div className={`${styles.startPointWrapper} ${props?.route[wayType]?.stops?.length && styles.hasStops}`}>
            <ConditionalWrapper condition={isMobile(props?.windowWidth)}>
              <i className={styles.locationIcon}>
                <Image
                  src={locationIcon}
                  height={25}
                  width={20}
                  alt="location icon"
                />
              </i>
              <div
                className={`${styles.startPoint} ${styles.labelAndInputWrapper}`}
              >
                <label htmlFor="address">נקודת התחלה:</label>
                <Autocomplete
                  onLoad={(autocomplete) =>
                    (startPointAutocompleteRef.current = autocomplete)
                  }
                  onPlaceChanged={(e) => {
                    handlePointSelect(
                      startPointAutocompleteRef.current.getPlace(),
                      wayType,
                      "startPoint",
                      null,
                      endPointInputRef.current
                    )
                  }}
                  options={{
                    componentRestrictions: { country: "IL" },
                  }}
                >
                  <input
                    type="text"
                    name="address"
                    parent="startPoint"
                    id="address"
                    required
                    value={props?.route?.[wayType]?.startPoint?.address}
                    lat={props?.route?.[wayType]?.startPoint?.lat}
                    lng={props?.route?.[wayType]?.startPoint?.lng}
                    onChange={(e) => props.handleFields(e)}
                  />
                </Autocomplete>
              </div>
            </ConditionalWrapper>
            {
              !isMobile(props?.windowWidth) && 
              <ConditionalDateTimeWrapper condition={isMobile(props?.windowWidth)}>
              <DateTimePicker
                resolvedMinTimeValue={resolvedMinTimeValue}
                route={route}
                handleDateChange={props.handleDateChange}
                CustomDateInput={CustomDateInput}
                datePickerRef={datePickerRef}
                setDatePickerRef={setDatePickerRef}
                today={props.today}
                isMobile={isMobile(props?.windowWidth)}
                endPointInputRef={endPointInputRef}
                labelAndInputWrapper={styles.labelAndInputWrapper}
                inputWrapper={styles.inputWrapper}
                datePickerWrapper={styles.datePickerWrapper}
                timeInputWrapper={styles.timeInputWrapper}
                timePickerIcon={styles.timePickerIcon}
                wayType={wayType}
              />
            </ConditionalDateTimeWrapper>
            }
          </div>
          {route?.stops?.length > 0 && (
            <div className={styles.hasStops}>
              <i className={styles.stepsIcon}>
                <PiDotsThreeOutlineVertical />
              </i>
            </div>
          )}
          {route?.stops?.map((stop, index) => {
            return (
              <div
                className={`${styles.stopWrapper} stopWrapper`}
                key={stop.id}
                index={index}
                id={stop.id}
              >
                <div className={styles.stopIconWrapper}>
                  <i className={styles.stopIcon}>
                    <Image
                      src={stopIcon}
                      height={20}
                      width={20}
                      alt="circle location icon as a stop"
                    />
                  </i>
                  <i className={styles.stepsIcon}>
                    <PiDotsThreeOutlineVertical />
                  </i>
                </div>
                <div
                  className={`${styles.stop} ${styles.labelAndInputWrapper}`}
                >
                  <label htmlFor={`stop_${index}`}>תחנה {index + 1}</label>
                  <Autocomplete
                    onLoad={(autocomplete) =>
                      (stopsAutocompleteRefs.current = autocomplete)
                    }
                    onPlaceChanged={(e) =>
                      handlePointSelect(
                        stopsAutocompleteRefs.current.getPlace(),
                        wayType,
                        "stop",
                        index
                      )
                    }
                    options={{
                      componentRestrictions: { country: "IL" },
                    }}
                  >
                    <input
                      type="text"
                      name={`stop_${index}`}
                      parent={"stops"}
                      index={index}
                      id={`stop_${index}`}
                      required
                      className={styles.stopInput}
                      value={
                        props?.route?.[wayType]?.stops[index]?.address
                      }
                      lat={props?.route?.[wayType]?.stops[index]?.lat}
                      lng={props?.route?.[wayType]?.stops[index]?.lng}
                      onChange={(e) => props.handleFields(e)}
                    />
                  </Autocomplete>
                  <div
                    className={styles.removeRow}
                    onClick={(e) => props.removeStop(e, index)}
                  >
                    <AiOutlineClose />
                  </div>
                </div>
              </div>
            );
          })}
          <div className={`${styles.endPointWrapper} ${props?.route[wayType]?.stops?.length && styles.hasStops}`}>
            <ConditionalWrapper condition={isMobile(props?.windowWidth)}>
              <i className={styles.locationIcon}>
                <Image
                  src={endPointIcon}
                  height={25}
                  width={20}
                  alt="endpoint location icon"
                />
              </i>
              <div
                className={`${styles.endPoint} ${styles.labelAndInputWrapper}`}
              >
                <label htmlFor="address">נקודת יעד:</label>
                <Autocomplete


                  onLoad={(autocomplete) =>
                    (endPointAutocompleteRef.current = autocomplete)
                  }
                  onPlaceChanged={(e) =>
                    handlePointSelect(
                      endPointAutocompleteRef.current.getPlace(),
                      wayType,
                      "endPoint", 
                      null,
                      datePickerRef
                    )
                  }
                  options={{
                    componentRestrictions: { country: "IL" },
                  }}
                >
                  <input
                    ref={endPointInputRef}
                    type="text"
                    name="address"
                    id="address"
                    required
                    parent="endPoint"
                    value={props?.route?.[wayType]?.endPoint?.address}
                    lat={props?.route?.[wayType]?.endPoint?.lat}
                    lng={props?.route?.[wayType]?.endPoint?.lng}
                    onChange={(e) => props.handleFields(e)}
                  />
                </Autocomplete>
              </div>
            </ConditionalWrapper>
            {
              isMobile(props?.windowWidth) && 
              <ConditionalDateTimeWrapper condition={isMobile(props?.windowWidth)}>
              <DateTimePicker
                resolvedMinTimeValue={resolvedMinTimeValue}
                route={route}
                handleDateChange={props.handleDateChange}
                CustomDateInput={CustomDateInput}
                datePickerRef={datePickerRef}
                setDatePickerRef={setDatePickerRef}
                today={props.today}
                isMobile={isMobile(props?.windowWidth)}
                endPointInputRef={endPointInputRef}
                labelAndInputWrapper={styles.labelAndInputWrapper}
                inputWrapper={styles.inputWrapper}
                datePickerWrapper={styles.datePickerWrapper}
                timeInputWrapper={styles.timeInputWrapper}
                timePickerIcon={styles.timePickerIcon}
                wayType={wayType}
              />
            </ConditionalDateTimeWrapper>
            }
            <div
              className={`${styles.addStopWrapper} ${routeInfo?.[wayType]?.legs?.length > 1 &&
                  (!routeInfo?.[wayType]?.legs[
                    routeInfo?.[wayType]?.legs.length - 1
                  ]?.duration ||
                    !routeInfo?.[wayType]?.legs[
                      routeInfo?.[wayType]?.legs.length - 1
                    ]?.distance)
                  ? styles.cannotAdd
                  : styles.canAdd
                }`}
              onClick={(e) => {
                if (
                  routeInfo?.[wayType]?.legs?.length <= 1 ||
                  (routeInfo?.[wayType]?.legs?.length > 1 &&
                    routeInfo?.[wayType]?.legs[
                      routeInfo?.[wayType]?.legs.length - 1
                    ]?.duration &&
                    routeInfo?.[wayType]?.legs[
                      routeInfo?.[wayType]?.legs.length - 1
                    ]?.distance)
                ) {
                  props.addNewStop(e);
                } else {
                }
              }}
            >
              <i className={styles.addStopIcon}>
                <AiOutlinePlus />
              </i>
              <span>
                {routeInfo?.[wayType]?.legs?.length <= 1 ||
                  (routeInfo?.[wayType]?.legs?.length > 1 &&
                    routeInfo?.[wayType]?.legs[
                      routeInfo?.[wayType]?.legs.length - 1
                    ]?.duration &&
                    routeInfo?.[wayType]?.legs[
                      routeInfo?.[wayType]?.legs.length - 1
                    ]?.distance)
                  ? addStopText
                  : "העצירה האחרונה אינה מלאה"}
              </span>
            </div>
          </div>
        </div>
        {props?.windowWidth < 769 && <div className={styles.directionButtons}>
          {props?.stage > 1 && (
            <button
              className={`${styles.directionButton} ${styles.directionButtonBackward}`}
              onClick={(e) => handleStages(e, props?.stage - 1)}
            >
              אחורה
            </button>
          )}
          <button
            className={`${styles.directionButton} ${styles.directionButtonForward
              } ${canProceedStep(props) ? "" : styles.cannotProcceed}`}
            onClick={(e) => {
              if (canProceedStep(props)) {
                handleStages(e, props?.stage + 1);
              } else {
                e.preventDefault();
                props?.handlePopup(
                  true,
                  <h3 style={{ textAlign: "center" }}>
                    נא למלא את כל השדות ב{wayTitle}
                  </h3>
                );
                setTimeout(() => {
                  props?.handlePopup(
                    false,
                    <h3 style={{ textAlign: "center" }}>
                      נא למלא את כל השדות ב{wayTitle}
                    </h3>
                  );
                }, 1000);
              }
            }}
          >
            {buttonTextByRouteType}
          </button>
        </div>}
      </div>
    </>
  );
};

export default Way;
