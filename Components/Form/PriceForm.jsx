import React, { useEffect, useState } from "react";
import styles from "./priceform.module.scss";
import OneWay from "./OneWay";
import TwoWays from "./TwoWays";
import MultiWays from "./MultiWays";
import Link from "next/link";
import { AiOutlineQuestion } from "react-icons/ai";
import { BsReverseListColumnsReverse } from "react-icons/bs";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { SlPeople } from "react-icons/sl";
import { PiSuitcaseSimpleLight } from "react-icons/pi";
import checkIcon from "../../public/media/checkIcon.svg";
import Image from "next/image";
const { v4: uuidv4 } = require("uuid");
import { format } from "date-fns";
import RouteAndDetails from "../Popup/RouteAndDetails";
import calculatePriceOffer from "../../pages/api/calculatePriceOffer";
import axios from "axios";

const PriceForm = (props) => {
  //   console.log("PriceForm comp render");

  const today = new Date();

  const [selectedOption, setSelectedOption] = useState("TwoWays");
  const eventTypes = [
    { label: "אירוע פרטי", value: "private event" },
    { label: "אירוע", value: "event" },
    { label: "חתונה", value: "wedding" },
    { label: "נתב''ג", value: "airport" },
    { label: "טיול", value: "trip" },
    { label: "עבודה", value: "work" },
    { label: "בית ספר", value: "school" },
    { label: "יום כיף", value: "funday" },
    { label: "אחר", value: "other" },
  ];

  const [route, setRoute] = useState({
    inbound: {
      startPoint: {},
      stops: [],
      endPoint: {},
    },
    outbound: {
      startPoint: {},
      stops: [],
      endPoint: {},
    },
    passengers: 1,
    eventType: "private event",
    acceptance: false,
    routeType: selectedOption,
    sameWayBack: false,
    currentDate: new Date(),
    suitcases: 0,
    expDate: null,
  });

  useEffect(() => {
    const currentDate = new Date();
    const expDate = new Date(currentDate);
    expDate.setDate(currentDate.getDate() + 2);

    setRoute({ ...route, expDate: expDate });
  }, [route.outbound]);

  useEffect(() => {
    setRoute({ ...route, routeType: selectedOption });
  }, [selectedOption]);

  // useEffect(() => {
  //   let changePassengers = false;
  //   if (
  //     route.suitcases > 10 ||
  //     route.suitcases > 15 ||
  //     route.suitcases > 35 ||
  //     route.suitcases > 55
  //   ) {
  //     changePassengers = true;
  //   }
  //   if (changePassengers) {
  //     let newPassengersCount = Math.max(route.passengers, route.suitcases);
  //     setRoute({ ...route, passengers: newPassengersCount });
  //   }
  // }, [route.suitcases]);

  const handleOptionChange = (event) => {
    const radioWrapper = event.target.closest(".radioWrapper");
    const radioInput = radioWrapper.querySelector("input").value;
    setSelectedOption(event.target.value);
  };

  const addNewStop = (e) => {
    const wayDiv = e.target.closest(".way");
    const way = wayDiv.id;

    // Determine the direction (outbound or inbound)
    const direction = way === "outbound" ? "outbound" : "inbound";

    // Create a new stop object
    const newStop = {
      address: "",
      date: "",
      time: "",
      id: uuidv4(),
    };

    // Update the state with the new stop
    setRoute((prevRoute) => ({
      ...prevRoute,
      [direction]: {
        ...prevRoute[direction],
        stops: [...prevRoute[direction].stops, newStop],
      },
    }));
  };

  const removeStop = (e) => {
    const stopWrapper = e.target.closest(".stopWrapper");
    const stopWrapperId = stopWrapper.id;
    const index = stopWrapper.getAttribute("index");
    const way = e.target.closest(".way").id;
    const stops = route[way].stops;

    const newStops = stops.filter((stop) => {
      if (stop.id !== stopWrapperId) {
        return stop;
      }
    });

    // console.log(newStops);

    // To update the state with the new stops array, you can call `setRoute`
    setRoute((prevRoute) => ({
      ...prevRoute,
      [way]: {
        ...prevRoute[way],
        stops: newStops,
      },
    }));
  };

  const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 1) {
      return `${hours} שעות ו-${minutes} דקות`;
    } else if (hours == 1) {
      return `${hours} שעות ו-${minutes} דקות`;
    } else if (hours < 1) {
      return `${minutes} דקות`;
    }
  };

  const showDistance = (distance) => {
    return `${distance ? distance.toFixed(1) : 0} ק"מ`;
  };

  const handleFields = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const parent = e.target.attributes.parent.value;
    const way = e.target.closest(".way").id;
    const direction = way === "outbound" ? "outbound" : "inbound";
    const checkIfStop = parent === "stops" || name.startsWith("stop_");
    const lat = e.target.lat;
    const lng = e.target.lng;

    if (checkIfStop) {
      // If it's a stop field, we need to update the stops array in the route state.
      const stopIndex = parseInt(name.split("_")[1]); // Extract the index from the name, e.g., "stop_0" -> 0
      setRoute((prevRoute) => ({
        ...prevRoute,
        [direction]: {
          ...prevRoute[direction],
          stops: prevRoute[direction].stops.map((stop, index) =>
            index === stopIndex
              ? { ...stop, address: value, lat: lat, lng: lng } // Update the address property of the specific stop
              : stop
          ),
        },
      }));
    } else {
      // If it's not a stop field, update the corresponding parent property.
      setRoute((prevRoute) => ({
        ...prevRoute,
        [direction]: {
          ...prevRoute[direction],
          [parent]: {
            ...prevRoute[direction][parent],
            [name]: value,
            lat: lat,
            lng: lng,
          },
        },
      }));
    }
  };

  const isToday = (selectedDate) => {
    if (!selectedDate) return false;

    const adjustedDate = new Date(selectedDate.getTime()); // Clone to prevent mutations

    let totalMinutes =
      adjustedDate.getMinutes() + route?.outbound?.duration + 60; // adding duration and 1 hour
    adjustedDate.setHours(
      adjustedDate.getHours() + Math.floor(totalMinutes / 60)
    );
    adjustedDate.setMinutes(totalMinutes % 60);

    const today = new Date();
    return (
      adjustedDate.getDate() === today.getDate() &&
      adjustedDate.getMonth() === today.getMonth() &&
      adjustedDate.getFullYear() === today.getFullYear()
    );
  };

  const handleDateChange = (selectedDate, e) => {
    // console.log("selectedDate");
    // console.log(selectedDate);
    const date = format(selectedDate, "dd/MM/yyyy");
    const time = format(selectedDate, "HH:mm");

    const parent = e.target.attributes.parent.value;
    const way = e.target.closest(".way").id;
    const direction = way === "outbound" ? "outbound" : "inbound";

    setRoute((prevRoute) => ({
      ...prevRoute,
      [direction]: {
        ...prevRoute[direction],
        [parent]: {
          ...prevRoute[direction][parent],
          date: selectedDate,
          time: selectedDate,
        },
      },
    }));
  };

  const handleStops = (e) => {
    const parent = e.target.attributes.parent.value;
    const way = e.target.closest(".way").id;
    const value = e.target.value;

    // console.log("way");
    // console.log(way);
  };

  const isPointFilledCorrectly = (point) => {
    return point.address && point.time && point.date && point.lat && point.lng;
  };

  const areStopsFilledCorrectly = (stops) => {
    if (!stops) return true;
    return stops.every((stop) => stop.address && stop.lat && stop.lng);
  };

  const isWayFilledCorrectly = (way) => {
    return (
      way.distance &&
      way.duration &&
      isPointFilledCorrectly(way.startPoint) &&
      areStopsFilledCorrectly(way.stops)
    );
  };

  const canProceed = () => {
    if (!route.acceptance) return false;

    if (route.routeType === "TwoWays") {
      return (
        isWayFilledCorrectly(route.inbound) &&
        isWayFilledCorrectly(route.outbound)
      );
    } else if (route.routeType === "OneWay") {
      // Assuming for other types we check only outbound
      return isWayFilledCorrectly(route.outbound);
    }
  };

  const formatDateToString = (dateObj, dateOrTime) => {
    if (dateOrTime === "date") {
      const day = dateObj.getDate().toString().padStart(2, "0");
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObj.getFullYear().toString().slice(-2);
      return `${day}/${month}/${year}`;
    } else if (dateOrTime === "time") {
      const hours = dateObj.getHours().toString().padStart(2, "0");
      const minutes = dateObj.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    return "";
  };

  return (
    <div className={styles.formWrapper}>
      <form>
        <div className={styles.routeType}>
          <h5>סוג הנסיעה: </h5>
          <div className={`${styles.radioWrapper} radioWrapper`}>
            <input
              type="radio"
              name="routeType"
              id="TwoWays"
              value="TwoWays"
              checked={selectedOption === "TwoWays"}
              onChange={handleOptionChange}
            />

            <label htmlFor="TwoWays">
              <div className={styles.customInputIcon}>
                {selectedOption === "TwoWays" && (
                  <Image
                    src={checkIcon}
                    width={20}
                    height={20}
                    alt="check icon"
                  />
                )}
              </div>
              <span>הלוך ושוב</span>
            </label>
          </div>
          <div className={`${styles.radioWrapper} radioWrapper`}>
            <input
              type="radio"
              name="routeType"
              id="OneWay"
              value="OneWay"
              checked={selectedOption === "OneWay"}
              onChange={handleOptionChange}
            />
            <label htmlFor="OneWay">
              <div className={styles.customInputIcon}>
                {selectedOption === "OneWay" && (
                  <Image
                    src={checkIcon}
                    width={20}
                    height={20}
                    alt="check icon"
                  />
                )}
              </div>
              <span>כיוון אחד</span>
            </label>
          </div>
          {/* <div className={`${styles.radioWrapper} radioWrapper`}>
            <input
              type="radio"
              name="routeType"
              id="MultiWays"
              value="MultiWays"
              checked={selectedOption === "MultiWays"}
              onChange={handleOptionChange}
            />

            <label htmlFor="MultiWays">
              <div className={styles.customInputIcon}>
                {selectedOption === "MultiWays" && (
                  <Image
                    src={checkIcon}
                    width={20}
                    height={20}
                    alt="check icon"
                  />
                )}
              </div>
              <span>רב יעדים</span>
            </label>
          </div> */}
        </div>
        <hr />
        {selectedOption && ( // change TwoWays to WayController
          <TwoWays
            route={route}
            setRoute={setRoute} // Pass the setRoute function as a prop
            addNewStop={addNewStop}
            removeStop={removeStop}
            handleFields={handleFields}
            handleDateChange={handleDateChange}
            handleStops={handleStops}
            setShowPopup={props.setShowPopup}
            today={today}
            isToday={isToday}
            formatDuration={formatDuration}
            showDistance={showDistance}
            sendDataToApp={props?.sendDataToApp}
            userRoute={props?.userRoute}
          />
        )}
        {/* {selectedOption == "MultiWays" && <MultiWays />} */}
        <hr />
        <div className={styles.formFooter}>
          <div
            className={`${styles.sameWayCheckboxWrapper} ${styles.checkboxWrapper}`}
          >
            {route?.routeType == "TwoWays" && (
              <>
                <input type="checkbox" name="sameWay" id="sameWay" />
                <div
                  className={styles.customInputIcon}
                  onClick={() => {
                    if (
                      route.outbound.startPoint.date &&
                      route.outbound.startPoint.time &&
                      route.outbound.startPoint.address &&
                      route.outbound.endPoint.address
                    ) {
                      setRoute({ ...route, sameWayBack: !route.sameWayBack });
                    } else {
                      props?.handlePopup(
                        true,
                        <h3 style={{ textAlign: "center" }}>
                          נא למלא את כל השדות במסלול ההלוך
                        </h3>
                      );
                      setTimeout(() => {
                        props?.handlePopup(
                          false,
                          <h3 style={{ textAlign: "center" }}>
                            נא למלא את כל השדות במסלול ההלוך
                          </h3>
                        );
                      }, 1000);
                    }
                  }}
                >
                  {route.sameWayBack === true && (
                    <Image
                      src={checkIcon}
                      width={20}
                      height={20}
                      alt="check Icon"
                    />
                  )}
                </div>
                <span>מסלול חזור תואם להלוך</span>
              </>
            )}
          </div>
          <div className={styles.passengersCountWrapper}>
            <div className={styles.tooltipWrapper}>
              <i>
                <AiOutlineQuestion />
              </i>
            </div>
            <span>מספר נוסעים מקסימלי: </span>
            <div className={styles.inputWithIconWrapper}>
              <i>
                <SlPeople />
              </i>
              <input
                type="number"
                name="passengersCount"
                id="passengersCount"
                value={route.passengers ? route.passengers : 1}
                min={1}
                max={60}
                onChange={(e) => {
                  if (e.target.value < 1) {
                    e.target.value = 1;
                    setRoute({ ...route, passengers: parseInt(1) });
                  } else if (e.target.value > 60) {
                    e.target.value = 60;
                    setRoute({ ...route, passengers: parseInt(60) });
                  } else {
                    setRoute({
                      ...route,
                      passengers: parseInt(e.target.value),
                    });
                  }
                }}
              />
            </div>
          </div>
          <div className={styles.suitcasesCountWrapper}>
            <span>מספר מזוודות: </span>
            <div className={styles.inputWithIconWrapper}>
              <i>
                <PiSuitcaseSimpleLight />
              </i>
              <input
                type="number"
                name="suitcasesCount"
                id="suitcasesCount"
                defaultValue={0}
                min={0}
                max={60}
                onChange={(e) => {
                  setRoute({
                    ...route,
                    suitcases: parseInt(e.target.value),
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.eventTypeWrapper}>
            <div className={styles.tooltipWrapper}>
              <i>
                <AiOutlineQuestion />
              </i>
            </div>
            <span>בחירת סוג הסעה: </span>
            <div className={styles.inputWithIconWrapper}>
              <i>
                <BsReverseListColumnsReverse />
              </i>
              <select
                onChange={(e) => {
                  setRoute({
                    ...route,
                    eventType: e.target.value,
                  });
                }}
                name="eventType"
                id="eventType"
              >
                {eventTypes.map((eventType, index) => {
                  return (
                    <option value={eventType.value} key={index}>
                      {eventType.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div
            className={`${styles.acceptanceWrapper} ${styles.checkboxWrapper}`}
          >
            <input
              type="checkbox"
              name="acceptance"
              id="acceptance"
              onChange={(e) =>
                setRoute({
                  ...route,
                  acceptance: e.target.checked,
                })
              }
            />
            <div
              className={styles.customInputIcon}
              onClick={() =>
                setRoute({ ...route, acceptance: !route.acceptance })
              }
            >
              {route.acceptance === true && (
                <Image
                  src={checkIcon}
                  width={20}
                  height={20}
                  alt="check icon"
                />
              )}
            </div>
            <span>
              בלחיצה על כפתור קבלת הצעת מחיר, <br />
              אני מאשר את{" "}
              <Link href={"#"} target="_blank">
                תנאי השימוש ומדיניות הפרטיות באתר.
              </Link>
            </span>
          </div>
          <button
            className={`${styles.priceRequestButton} ${!canProceed() && styles.cannotSend
              }`}
            disabled={canProceed() ? false : true}
            onClick={(e) => {
              const userRoute = props.userRoute;
              e.preventDefault();
              canProceed() &&
                axios
                  .post(`/api/calculatePriceOffer`, {
                    properties: {
                      route,
                      userRoute,
                      eventTypes,
                    },
                  })
                  .then((res) => {
                    console.log("res");
                    console.log("res");
                    console.log(res);
                    if (res.status === 200) {
                      props.handlePopup(
                        true,
                        <RouteAndDetails
                          handlePopup={props.handlePopup}
                          route={route}
                          eventTypes={eventTypes}
                          formatDateToString={formatDateToString}
                          showDistance={showDistance}
                          formatDuration={formatDuration}
                          sendDataToApp={props?.sendDataToApp}
                          userRoute={props?.userRoute}
                          price={res?.data?.price}
                        />
                      );
                    }
                  });
            }}
          >
            <span>הצעת מחיר אונליין</span>
            <i>
              <HiArrowNarrowLeft />
            </i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PriceForm;
