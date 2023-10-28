import React, { useEffect, useState, useMemo, useCallback } from "react";
import Popup from "./Popup";
import styles from "./routeanddetails.module.scss";
import { GoogleMap } from "@react-google-maps/api";
import { DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import PriceSuggestion from "./PriceSuggestion";
import axios from "axios";
import generatePDF from "../../utils/generatePDF";
import { AiFillCloseCircle } from "react-icons/ai";
import { formatDateToString } from "../../utils/functions";
import { useRouter } from "next/navigation";

const mapStyles = {
  height: "200px",
  width: "400px",
};

const RouteAndDetails = (props) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [inputVerificationCode, setInputVerificationCode] = useState("");
  const [actualVerificationCode, setActualVerificationCode] = useState(null);

  const [outboundDirections, setOutboundDirections] = useState(null);
  const [inboundDirections, setinboundDirections] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    verified: false,
  });

  const router = useRouter();

  // if (!window.google || !window.google.maps) {
  //   return null; // Return something or display an error message
  // }


  const outBoundStartPointCoors = useMemo(
    () => ({
      lat: parseFloat(props?.route?.outbound?.startPoint?.lat),
      lng: parseFloat(props?.route?.outbound?.startPoint?.lng),
    }),
    [props.route]
  );
  const inBoundStartPointCoors = useMemo(
    () => ({
      lat: parseFloat(props?.route?.inbound?.startPoint?.lat),
      lng: parseFloat(props?.route?.inbound?.startPoint?.lng),
    }),
    [props.route]
  );

  const outBoundStopWaypoints = useMemo(
    () =>
      props?.route?.outbound?.stops?.map((stop) => ({
        location: new window.google.maps.LatLng(
          parseFloat(stop.lat),
          parseFloat(stop.lng)
        ),
      })),
    [props?.route?.outbound?.stops]
  );
  const inBoundStopWaypoints = useMemo(
    () =>
      props?.route?.inbound?.stops?.map((stop) => ({
        location: new window.google.maps.LatLng(
          parseFloat(stop.lat),
          parseFloat(stop.lng)
        ),
      })),
    [props?.route?.inbound?.stops]
  );

  const outBoundEndPointCoors = useMemo(
    () => ({
      location: new window.google.maps.LatLng(
        parseFloat(props?.route?.outbound?.endPoint?.lat),
        parseFloat(props?.route?.outbound?.endPoint?.lng)
      ),
    }),
    [props.route]
  );
  const inBoundEndPointCoors = useMemo(
    () => ({
      location: new window.google.maps.LatLng(
        parseFloat(props?.route?.inbound?.endPoint?.lat),
        parseFloat(props?.route?.inbound?.endPoint?.lng)
      ),
    }),
    [props.route]
  );

  const onLoadOutboundDirections = useCallback((directionsResult) => {
    setOutboundDirections(directionsResult);
    setLoaded(true);
  }, []);
  const onLoadinboundDirections = useCallback((directionsResult) => {
    setinboundDirections(directionsResult);
    setLoaded(true);
  }, []);

  useEffect(() => {
    setLoaded(true);
    setLoaded(false);
  }, [props?.route]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();


    const newDetails = {};
    const inputsArray = Array.from(e.target);

    inputsArray.forEach((input) => {
      if (input.type !== "submit") {
        newDetails[input.name] = input.value;
      }
    });

    setUserDetails((prevDetails) => ({ ...prevDetails, ...newDetails }));

    const response = await fetch("/api/sendVerification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: newDetails.email,
        firstname: newDetails.firstname,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setActualVerificationCode(data.code);
      setIsVerifying(true);
    } else {
      // Handle error
    }
  };

  const handleVerify = async () => {
    if (inputVerificationCode === actualVerificationCode) {
      setIsVerifying(false);
      setUserDetails({ ...userDetails, verified: true });
      props.handlePopup(false, <Popup show={false} />);
      let offerId;

      try {
        const wpRes = await axios.post(
          `/api/priceOffers`,
          {
            title: {
              raw: "הצעת מחיר חדשה",
              rendered: "הצעת מחיר חדשה",
            },
            status: "pending",
          }
        );

        offerId = await wpRes.data.id;
      } catch (error) {
        console.log(error);
      }
      setTimeout(() => {
        props?.sendDataToApp(
          props?.route,
          { price: props?.price },
          { carType: props?.carType },
          { offerId: offerId },
          userDetails // userRoute={props?.userRoute} - to redirect to new PriceSugg page.
        );
        axios
          .post(`/api/sendPriceSuggestion`, { userDetails: userDetails })
          .then((res) => {

            // Generate the PDF blob from the user details.
            generatePDF(
              userDetails,
              props?.route,
              props?.price,
              props?.carType,
              offerId,
              async (pdfBlob) => {
                // Open the PDF in a new tab for validation

                const reader = new FileReader();
                reader.readAsDataURL(pdfBlob);
                reader.onloadend = async function () {
                  const base64data = reader.result;

                  try {
                    // Step 1: Create or Update the Post

                    // Convert Blob to File. The File API is based on Blob, inheriting blob functionality and expanding it to support files on the user's system.
                    const file = new File(
                      [pdfBlob],
                      `price_offer_${offerId}.pdf`,
                      { type: "application/pdf" }
                    );

                    // Create a FormData object
                    const formData = new FormData();

                    // Append the file to the FormData object
                    formData.append("file", file);

                    // Step 2: Upload PDF to WordPress Media Library


                    const mediaRes = await axios.post(
                      `/api/uploadPdf`,
                      formData, offerId
                    );
                    const mediaID = await mediaRes.data.id;

                    // Step 3: Update Post with Media ID
                    await axios.put(
                      `api/priceOffers/`,
                      {
                        offerId,
                        title: {
                          raw: `הצעת מחיר מספר ${offerId}`,
                          rendered: `הצעת מחיר מספר ${offerId}`,
                        },
                        status: "publish",
                        acf: {
                          PO_id: parseInt(offerId),
                          PO_car_type: props?.carType,
                          PO_client_email: userDetails.email,
                          PO_client_name:
                            userDetails.firstname + " " + userDetails.lastname,
                          PO_client_phone: userDetails.phone,
                          PO_date: props?.route?.currentDate,
                          PO_expiry_date: props?.route?.expDate,
                          PO_passengers_count: props?.route?.passengers,
                          PO_price: props?.price?.toString(),
                          PO_route_event: props?.route?.eventType,
                          PO_route_type: props?.route?.routeType,
                          PO_outbound: {
                            distance:
                              props?.route?.outbound?.distance?.toString(),
                            duration:
                              props?.route?.outbound?.duration?.toString(),
                            endpoint_address:
                              props?.route?.outbound?.endPoint?.address,
                            startpoint_address:
                              props?.route?.outbound?.startPoint?.address,
                            startpoint_date:
                              props?.route?.outbound?.startPoint?.date,
                            startpoint_time:
                              props?.route?.outbound?.startPoint?.time,
                          },
                          PO_inbound: {
                            distance: props?.route?.inbound?.distance
                              ? props?.route?.inbound?.distance?.toString()
                              : null,
                            duration: props?.route?.inbound?.duration
                              ? props?.route?.inbound?.duration?.toString()
                              : null,
                            endpoint_address: props?.route?.inbound?.endPoint
                              ?.address
                              ? props?.route?.inbound?.endPoint?.address
                              : null,
                            startpoint_address: props?.route?.inbound
                              ?.startPoint?.address
                              ? props?.route?.inbound?.startPoint?.address
                              : null,
                            startpoint_date: props?.route?.inbound?.startPoint
                              ?.date
                              ? props?.route?.inbound?.startPoint?.date
                              : null,
                            startpoint_time: props?.route?.inbound?.startPoint
                              ?.time
                              ? props?.route?.inbound?.startPoint?.time
                              : null,
                          },
                          PO_file: mediaID, // Use the media ID from the first step
                        },
                      }
                    );
                  } catch (error) {
                    console.error("An error occurred:", error);
                  }

                  // Your existing code for sending details to your server and triggering download
                  axios
                    .post(`/api/sendPriceSuggestion`, {
                      userDetails: userDetails,
                      pdfBlob: base64data,
                      route: props?.route,
                      price: props?.price,
                      carType: props?.carType,
                      offerId: offerId,
                    })
                    .then((res) => {

                      // Triggering download for the user
                      const blobURL = window.URL.createObjectURL(pdfBlob);
                      const tempLink = document.createElement("a");
                      tempLink.href = blobURL;
                      tempLink.setAttribute(
                        "download",
                        `הצעת מחיר סבן טורס-${offerId}.pdf`
                      );
                      document.body.appendChild(tempLink);
                      tempLink.click();
                      document.body.removeChild(tempLink);
                      window.URL.revokeObjectURL(blobURL);
                    });
                };
              }
            );
          });
        router.push("/checkout")
      }, 500);
    } else {
      alert("קוד האימות שגוי, אנא נסה שנית.");
    }
  };

  return (
    <>
      <div
        className={`${styles.routeAndDetails} ${styles.twoWaysRouteAndDetails
          } ${isVerifying && styles.blur}`}
      >
        <div className={styles.yourRoute}>
          <div className={styles.heading}>
            <h2>המסלול שלך</h2>
            <button
              onClick={() => props.handlePopup(false, <Popup show={false} />)}
            >
              שינוי המסלול
            </button>
            <div className={`${styles.outbound_inbound_mapsWrapper} `}>
              <div className={`${styles.outboundMap} ${styles.mapWrapper}`}>
                <h3>הלוך</h3>
                {props?.route?.outbound?.duration &&
                  props?.formatDuration(props?.route?.outbound?.duration)}
                <br />
                {props?.route?.outbound?.distance &&
                  props?.showDistance(props?.route?.outbound?.distance)}
                <GoogleMap
                  mapContainerStyle={mapStyles}
                  zoom={13}
                  mapContainerClassName={styles.mapContainer}
                >
                  {!loaded &&
                    outBoundStartPointCoors &&
                    outBoundEndPointCoors && (
                      <DirectionsService
                        options={{
                          origin: outBoundStartPointCoors,
                          destination: outBoundEndPointCoors,
                          waypoints: outBoundStopWaypoints,
                          travelMode: "DRIVING",
                        }}
                        callback={onLoadOutboundDirections}
                      />
                    )}

                  {/* Display the optimized route on the map */}
                  {outboundDirections && (
                    <DirectionsRenderer directions={outboundDirections} />
                  )}
                </GoogleMap>
              </div>
              {props?.route?.routeType == "TwoWays" && (
                <div className={`${styles.inboundMap} ${styles.mapWrapper}`}>
                  <h3>חזור</h3>
                  {props?.formatDuration(props?.route?.inbound?.duration)}
                  <br />
                  {props?.showDistance(props?.route?.inbound?.distance)}
                  <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={13}
                    mapContainerClassName={styles.mapContainer}
                  >
                    {!loaded &&
                      inBoundStartPointCoors &&
                      inBoundEndPointCoors && (
                        <DirectionsService
                          options={{
                            origin: inBoundStartPointCoors,
                            destination: inBoundEndPointCoors,
                            waypoints: inBoundStopWaypoints,
                            travelMode: "DRIVING",
                          }}
                          callback={onLoadinboundDirections}
                        />
                      )}

                    {/* Display the optimized route on the map */}
                    {inboundDirections && (
                      <DirectionsRenderer directions={inboundDirections} />
                    )}
                  </GoogleMap>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.details}>
          <h2>קבלת הצעת המחיר</h2>
          <p>
            על מנת לקבל את הצעת המחיר מאיתנו, נבקש ממך להזין פרטים <br />
            מדויקים וכך נוכל לאמת את זהותך וכמובן לתת לך את הצעת <br />
            המחיר השווה שלנו מיד בסיום התהליך!
          </p>
          <form
            className={styles.twoSectionsForm}
            onSubmit={(e) => handleFormSubmit(e)}
          >
            <div className={styles.formSection}>
              <div
                className={`${styles.labelAndInputWrapper} ${styles.formColumn}`}
              >
                <label htmlFor="firstname">שם פרטי</label>
                <input type="text" name="firstname" id="firstname" required />
              </div>
              <div
                className={`${styles.labelAndInputWrapper} ${styles.formColumn}`}
              >
                <label htmlFor="lastname">שם משפחה</label>
                <input type="text" name="lastname" id="lastname" required />
              </div>
            </div>
            <div className={styles.formSection}>
              <div
                className={`${styles.labelAndInputWrapper} ${styles.formColumn}`}
              >
                <label htmlFor="email">אימייל</label>
                <input type="email" name="email" id="email" required />
              </div>
              <div
                className={`${styles.labelAndInputWrapper} ${styles.formColumn}`}
              >
                <label htmlFor="phone">טלפון</label>
                <input type="number" pattern="[0-9]*"
                  inputMode="numeric"
                  name="phone" id="phone" required />
              </div>
            </div>
            <button className={styles.priceRequestButton}>המשך</button>
          </form>
        </div>
      </div>
      {isVerifying && (
        <div className={styles.verificationPopupWrapper}>
          <div className={styles.verificationPopup}>
            <i
              className={styles.closeButton}
              onClick={() => setIsVerifying(false)}
            >
              <AiFillCloseCircle />
            </i>
            <p>הזן את קוד האימות שנשלח אליך במייל</p>
            <div className={styles.inpAndBtn}>
              <input
                type="number"
                pattern="[0-9]*"
                inputMode='numeric'    
                value={inputVerificationCode}
                onChange={(e) => setInputVerificationCode(e.target.value)}
              />
              <button onClick={handleVerify}>אמת</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(RouteAndDetails);
