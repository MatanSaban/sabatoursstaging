import React, { useEffect } from "react";
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

registerLocale("he", he); 

const Way = ({
  wayType,
  routeInfo,
  handlePointSelect,
  CustomDateInput,
  calculateRouteInformation,
  minTime,
  inboundMinTime,
  wayTitle,
  ...props
}) => {
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

  // console.log(`MinTime value in ${wayType}: ${minTimeValue}`);
  // console.log("minTimeInbound: ", props?.minTimeInbound);
  // console.log(
  //   "props?.isToday(route?.startPoint?.date): ",
  //   props?.isToday(route?.startPoint?.date)
  // );
  // console.log("route?.startPoint?.date: ", route?.startPoint?.date);
  // console.log("route?.outbound?.duration: ", route?.outbound?.duration);

  return (
    <div className={`${styles[wayType]} ${styles.wayStyle} way`} id={wayType}>
      <h3>{wayTitle}</h3>
      <p>
        <span>{totalDistance}</span>
        <br />
        <span>{totalDuration}</span>
      </p>
      <div className={styles.fields}>
        <div className={styles.startPointWrapper}>
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
              onPlaceChanged={(e) =>
                handlePointSelect(
                  startPointAutocompleteRef.current.getPlace(),
                  wayType,
                  "startPoint"
                )
              }
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
          <div className={`${styles.labelAndInputWrapper}`}>
            <label htmlFor="date">תאריך יציאה:</label>
            <div
              className={`${styles.inputWrapper} ${styles.datePickerWrapper}`}
            >
              <DatePicker
                locale={he}
                name="date"
                showTimeSelect
                timeCaption="שעה"
                parent="startPoint"
                minDate={
                  wayType == "outbound" ? new Date() : props?.minTimeInbound
                }
                id="date"
                customInput={<CustomDateInput />}
                selected={route?.startPoint?.date}
                dateFormat="dd/MM/yyyy"
                minTime={resolvedMinTimeValue}
                maxTime={
                  new Date(
                    props.today.getFullYear(),
                    props.today.getMonth(),
                    props.today.getDate(),
                    23,
                    30
                  )
                }
                onChange={(date) =>
                  props.handleDateChange(date, {
                    target: {
                      name: "date",
                      closest: () => document.getElementById(wayType),
                      attributes: {
                        parent: {
                          value: "startPoint",
                        },
                      },
                    },
                  })
                }
              />
            </div>
          </div>
          <div className={`${styles.labelAndInputWrapper}`}>
            <label htmlFor="time">שעת יציאה:</label>
            <div
              className={`${styles.inputWrapper} ${styles.timeInputWrapper}`}
            >
              <i className={styles.timePickerIcon}>
                <BiSolidTimeFive />
              </i>
              <input
                type="text"
                name="time"
                id="time"
                parent="startPoint"
                required
                disabled
                value={
                  route?.startPoint?.date &&
                  format(route?.startPoint?.date, "HH:mm")
                }
              />
            </div>
          </div>
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
              <div className={`${styles.stop} ${styles.labelAndInputWrapper}`}>
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
                    defaultValue={
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
        <div className={styles.endPointWrapper}>
          <i className={styles.locationIcon}>
            <Image
              src={endPointIcon}
              height={25}
              width={20}
              alt="endpoint location icon"
            />
          </i>
          <div className={`${styles.endPoint} ${styles.labelAndInputWrapper}`}>
            <label htmlFor="address">נקודת יעד:</label>
            <Autocomplete
              onLoad={(autocomplete) =>
                (endPointAutocompleteRef.current = autocomplete)
              }
              onPlaceChanged={(e) =>
                handlePointSelect(
                  endPointAutocompleteRef.current.getPlace(),
                  wayType,
                  "endPoint"
                )
              }
              options={{
                componentRestrictions: { country: "IL" },
              }}
            >
              <input
                type="text"
                name="address"
                id="address"
                required
                parent="endPoint"
                defaultValue={props?.route?.[wayType]?.endPoint?.address}
                lat={props?.route?.[wayType]?.endPoint?.lat}
                lng={props?.route?.[wayType]?.endPoint?.lng}
                onChange={(e) => props.handleFields(e)}
              />
            </Autocomplete>
          </div>
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
    </div>
  );
};

export default Way;