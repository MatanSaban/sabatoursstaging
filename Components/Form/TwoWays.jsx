import React, { useEffect, useRef, useState } from "react";
import styles from "./priceform.module.scss";
import { BsCalendar2Event } from "react-icons/bs";
import "react-datepicker/dist/react-datepicker.css";
import he from "date-fns/locale/he";
import { registerLocale } from "react-datepicker";
registerLocale("he", he);
import Way from "./TwoWays/Way";

const TwoWays = (props) => {
  // formatDuration showDistance
  // console.log("TwoWays.jsx render");
  const outboundAutocompleteRef = useRef(null);
  const inboundAutocompleteRef = useRef(null);
  const outboundEndPointAutocompleteRef = useRef(null);
  const inboundEndPointAutocompleteRef = useRef(null);

  const outboundStopsAutocompleteRefs = useRef([]);
  const inboundStopsAutocompleteRefs = useRef([]);

  const [outboundTotalDistance, setOutboundTotalDistance] = useState(0);
  const [outboundTotalDuration, setOutboundTotalDuration] = useState(0);
  const [inboundTotalDistance, setInboundTotalDistance] = useState(0);
  const [inboundTotalDuration, setInboundTotalDuration] = useState(0);

  const [inboundMinTime, setInboundMinTime] = useState(null);

  const [routeInfo, setRouteInfo] = useState({
    legs: [], // Store calculated route information
  });

  // Function to calculate distances and durations between consecutive addresses
  const calculateRouteInformation = async (addresses, direction, datetime) => {
    const service = new google.maps.DistanceMatrixService();

    const legsWithDurationAndDistance = [];
    const departureTime = new Date(datetime); // Convert selected datetime to a Date object

    for (let i = 0; i < addresses.length - 1; i++) {
      const origin = String(addresses[i]);
      const destination = String(addresses[i + 1]);

      const response = await new Promise((resolve) => {
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {
              departureTime: departureTime, // Use the provided departure time
            },
          },
          (response, status) => {
            if (status === "OK") {
              resolve(response);
            } else {
              console.error("Distance matrix request failed:", status);
              resolve(null);
            }
          }
        );
      });

      if (response) {
        const distance = response?.rows[0]?.elements[0]?.distance?.text || "";
        const duration = response?.rows[0]?.elements[0]?.duration?.text || "";

        legsWithDurationAndDistance.push({
          distance,
          duration,
        });
      }
    }

    const updatedRouteInfo = {
      legs: legsWithDurationAndDistance.map((leg) => ({
        distance: leg.distance,
        duration: leg.duration,
      })),
    };

    setRouteInfo((prevRouteInfo) => ({
      ...prevRouteInfo,
      [direction]: updatedRouteInfo,
    }));

    const totalDistance = legsWithDurationAndDistance.reduce((acc, leg) => {
      const distanceValue = leg.distance.replace(/[^\d.]/g, ""); // Remove all non-numeric and non-dot characters
      return acc + parseFloat(distanceValue);
    }, 0);

    const totalDurationMinutes = legsWithDurationAndDistance.reduce(
      (acc, leg) => {
        const durationParts = leg.duration.split(" ");
        if (durationParts.length === 4) {
          // means its hours and mins - example: "2 hours 25 minutes"
          return (
            acc + parseInt(durationParts[0]) * 60 + parseInt(durationParts[2])
          );
        } else if (
          (durationParts.length === 2 && durationParts[1] == "mins") ||
          (durationParts.length === 2 && durationParts[1] == "דקות")
        ) {
          return acc + parseInt(durationParts[0]);
        } else if (
          (durationParts.length === 2 && durationParts[1] == "hours") ||
          (durationParts.length === 2 && durationParts[1] == "שעות")
        ) {
          return acc + parseInt(durationParts[0]) * 60;
        }
        return acc;
      },
      0
    );

    if (direction === "outbound") {
      setOutboundTotalDistance(totalDistance);
      setOutboundTotalDuration(totalDurationMinutes);
    } else if (direction === "inbound") {
      setInboundTotalDistance(totalDistance);
      setInboundTotalDuration(totalDurationMinutes);
    }
  };

  const calculateMinTime = () => {
    if (props?.route?.outbound?.startPoint?.date) {
      const hoursToAdd = Math.floor(outboundTotalDuration / 60);
      const minutesToAdd = outboundTotalDuration % 60;

      const outboundDate = new Date(props?.route?.outbound?.startPoint?.date);

      outboundDate.setHours(outboundDate.getHours() + hoursToAdd);
      outboundDate.setMinutes(outboundDate.getMinutes() + minutesToAdd);

      if (outboundDate.getMinutes() >= 60) {
        outboundDate.setHours(outboundDate.getHours() + 1);
        outboundDate.setMinutes(outboundDate.getMinutes() - 60);
      }
      return outboundDate;
    } else {
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 1);
      return currentDate;
    }
  };

  useEffect(() => {
    // Extract addresses from the outbound route for calculation
    const outboundAddresses = [
      props?.route?.outbound?.startPoint?.address,
      ...props?.route?.outbound?.stops?.map((stop) => stop?.address),
      props?.route?.outbound?.endPoint?.address,
    ];

    // Calculate distances and durations for outbound route
    calculateRouteInformation(
      outboundAddresses,
      "outbound",
      props?.route?.outbound?.startPoint?.date
    );
  }, [props.route.outbound]);

  useEffect(() => {
    // Extract addresses from the inbound route for calculation
    const inboundAddresses = [
      props?.route?.inbound?.startPoint?.address,
      ...props?.route?.inbound?.stops?.map((stop) => stop?.address),
      props?.route?.inbound?.endPoint?.address,
    ];

    // Calculate distances and durations for inbound route
    calculateRouteInformation(
      inboundAddresses,
      "inbound",
      props?.route?.inbound?.startPoint?.date
    );
  }, [props.route.inbound]);

  useEffect(() => {
    let timeValue;
    let inboundDate = new Date(props?.route?.outbound?.startPoint?.date);

    // Calculate the appropriate time value
    if (props?.route?.outbound?.startPoint?.time) {
      const originalDate = new Date(props?.route?.outbound?.startPoint?.date);
      const outboundDate = new Date(originalDate.getTime()); // Clone the original date to prevent modifications

      let totalMinutes = outboundDate.getMinutes() + outboundTotalDuration;
      totalMinutes = Math.ceil(totalMinutes / 30) * 30;

      outboundDate.setHours(
        outboundDate.getHours() + Math.floor(totalMinutes / 60)
      );
      outboundDate.setMinutes(totalMinutes % 60);
      timeValue = outboundDate;

      // Handle date overflow
      if (
        outboundDate.getHours() < originalDate.getHours() ||
        (outboundDate.getHours() === originalDate.getHours() &&
          outboundDate.getMinutes() < originalDate.getMinutes())
      ) {
        inboundDate.setDate(inboundDate.getDate());
      }

      // Add the duration + 1 hour to the inboundDate
      let durationInMinutes = outboundTotalDuration + 60; // adding 1 hour
      inboundDate.setMinutes(inboundDate.getMinutes() + durationInMinutes);

      // Round to the nearest half-hour
      let minutes = inboundDate.getMinutes();
      if (minutes > 30) {
        inboundDate.setHours(inboundDate.getHours() + 1, 0); // Move to the next hour and set minutes to 00
      } else if (minutes <= 30 && minutes > 0) {
        inboundDate.setMinutes(30); // Set minutes to 30
      }

      timeValue = new Date(inboundDate);
    } else {
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 1);
      timeValue = currentDate; // Again, a Date object
    }

    setInboundMinTime(inboundDate); // right after the time rounding logic

    // Initialize inBoundStartPoint with the calculated time
    const inBoundStartPoint = {
      address: props?.route?.outbound?.endPoint?.address,
      city: props?.route?.outbound?.endPoint?.city,
      date: inboundDate,
      time: timeValue,
      lat: props?.route?.outbound?.endPoint?.lat,
      lng: props?.route?.outbound?.endPoint?.lng,
    };

    const inboundAddresses = [
      inBoundStartPoint,
      ...(Array.isArray(props?.route?.outbound?.stops)
        ? props?.route?.outbound?.stops?.map((stop) => stop?.address).reverse()
        : []),
      props?.route?.outbound?.startPoint,
    ];

    if (props?.route?.sameWayBack) {
      calculateRouteInformation(inboundAddresses, "inbound");
      props.setRoute((prevRoute) => ({
        ...prevRoute,
        inbound: {
          ...prevRoute.inbound,
          startPoint: inBoundStartPoint,
          stops: props?.route?.outbound?.stops
            ? props?.route?.outbound?.stops
              .map((stop) => stop) // Create a new array to prevent modifying the original array
              .reverse()
            : [],
          endPoint: props?.route?.outbound?.startPoint,
        },
      }));
    } else {
      props.setRoute({
        ...props?.route,
        inbound: {
          startPoint: {
            address: "",
            city: "",
            date: "",
            time: "",
            lat: "",
            lng: "",
          },
          stops: [],
          endPoint: {
            address: "",
            city: "",
            lat: "",
            lng: "",
          },
        },
      });
      setTimeout(() => {
        calculateRouteInformation({}, "inbound");
      }, 400);
    }
  }, [
    props?.route?.sameWayBack,
    props?.route?.outbound?.startPoint,
    props?.route?.outbound?.endPoint,
  ]);

  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className={styles.custom_date_input} onClick={onClick} ref={ref}>
      <BsCalendar2Event size={15} />
      <input value={value} readOnly />
    </div>
  ));
  CustomDateInput.displayName = 'CustomDateInput';

  const extractCity = (addressComponents) => {
    if (!addressComponents) return null; // Return null if addressComponents is undefined

    const cityComponent = addressComponents.find(
      (component) =>
        component.types.includes("locality") ||
        component.types.includes("administrative_area_level_1")
    );
    return cityComponent ? cityComponent.long_name : null;
  };

  const handlePointSelect = (place, direction, point, indexOfStop) => {
    console.log("place");
    console.log(place);
    console.log("direction");
    console.log(direction);
    console.log("point");
    console.log(point);
    console.log("indexOfStop");
    console.log(indexOfStop);
    const address = place?.formatted_address;
    const latitude = place?.geometry?.location?.lat();
    const longitude = place?.geometry?.location?.lng();
    const city = extractCity(place?.address_components);

    // Update the route state with the selected address for the appropriate direction (outbound or inbound)
    if (point != "stop") {
      props.setRoute((prevRoute) => ({
        ...prevRoute,
        [direction]: {
          ...prevRoute[direction],
          [point]: {
            ...prevRoute[direction][point],
            address: address,
            city: city, // added city here
            lat: latitude,
            lng: longitude,
          },
        },
      }));
    } else {
      // Find the correct stop index and update the address
      const updatedStops = [...props.route[direction].stops];
      updatedStops[indexOfStop] = {
        ...updatedStops[indexOfStop],
        address: address,
        city: city, // added city here
        lat: latitude,
        lng: longitude,
      };

      props.setRoute((prevRoute) => ({
        ...prevRoute,
        [direction]: {
          ...prevRoute[direction],
          stops: updatedStops,
        },
      }));
    }
  };

  useEffect(() => {
    let updatedRoute = { ...props?.route }; // Clone the route to prevent direct mutations

    // Check for outboundTotalDistance change and update it
    if (outboundTotalDistance && updatedRoute?.outbound) {
      updatedRoute.outbound = {
        ...updatedRoute.outbound,
        distance: outboundTotalDistance,
      };
    }

    // Check for outboundTotalDuration change and update it
    if (outboundTotalDuration && updatedRoute?.outbound) {
      updatedRoute.outbound = {
        ...updatedRoute.outbound,
        duration: outboundTotalDuration,
      };
    }

    // Check for inboundTotalDistance change and update it
    if (inboundTotalDistance && updatedRoute?.inbound) {
      updatedRoute.inbound = {
        ...updatedRoute.inbound,
        distance: inboundTotalDistance,
      };
    }

    // Check for inboundTotalDuration change and update it
    if (inboundTotalDuration && updatedRoute?.inbound) {
      updatedRoute.inbound = {
        ...updatedRoute.inbound,
        duration: inboundTotalDuration,
      };
    }

    // Update the route using setRoute
    props?.setRoute(updatedRoute);
  }, [
    outboundTotalDistance,
    outboundTotalDuration,
    inboundTotalDistance,
    inboundTotalDuration,
  ]);

  useEffect(() => { }, [props?.route?.routeType]);

  return (
    <div className={styles.twoWays}>
      <Way
        outboundAutocompleteRef={outboundAutocompleteRef}
        outboundEndPointAutocompleteRef={outboundEndPointAutocompleteRef}
        outboundTotalDistance={outboundTotalDistance}
        outboundTotalDuration={outboundTotalDuration}
        outboundStopsAutocompleteRefs={outboundStopsAutocompleteRefs}
        inboundTotalDistance={inboundTotalDistance}
        inboundTotalDuration={inboundTotalDuration}
        showDistance={props?.showDistance}
        formatDuration={props?.formatDuration}
        today={props?.today}
        CustomDateInput={CustomDateInput}
        handleDateChange={props?.handleDateChange}
        handleFields={props?.handleFields}
        handlePointSelect={handlePointSelect}
        route={props.route}
        routeInfo={routeInfo}
        addNewStop={props?.addNewStop}
        removeStop={props?.removeStop}
        wayType={"outbound"}
        calculateRouteInformation={calculateRouteInformation}
        calculateMinTime={calculateMinTime}
        isToday={props?.isToday}
      />
      {props?.route?.routeType == "TwoWays" && (
        <Way
          inboundAutocompleteRef={inboundAutocompleteRef}
          inboundEndPointAutocompleteRef={inboundEndPointAutocompleteRef}
          inboundTotalDistance={inboundTotalDistance}
          inboundTotalDuration={inboundTotalDuration}
          outboundTotalDistance={outboundTotalDistance}
          outboundTotalDuration={outboundTotalDuration}
          inboundStopsAutocompleteRefs={inboundStopsAutocompleteRefs}
          showDistance={props?.showDistance}
          formatDuration={props?.formatDuration}
          today={props?.today}
          CustomDateInput={CustomDateInput}
          handleDateChange={props?.handleDateChange}
          handleFields={props?.handleFields}
          handlePointSelect={handlePointSelect}
          route={props.route}
          routeInfo={routeInfo}
          addNewStop={props?.addNewStop}
          removeStop={props?.removeStop}
          wayType={"inbound"}
          calculateRouteInformation={calculateRouteInformation}
          calculateMinTime={calculateMinTime}
          isToday={props?.isToday}
          minTimeInbound={inboundMinTime}
        />
      )}
    </div>
  );
};

export default TwoWays;
