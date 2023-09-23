import React from "react";
import styles from "./pricesuggestion.module.scss";
import Logo from "../../public/media/SabanToursLogo.svg";
import Image from "next/image";
import { FaMobileAlt } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { AiOutlineMail } from "react-icons/ai";
import BoundInfo from "./BoundInfo";
import generatePDF from "../../utils/generatePDF.js";
import axios from "axios";
import { formatDate } from "../../utils/functions";
import { importantThing } from "../../utils/functions";
const PriceSuggestion = (props) => {
  const ImportantThingsToSay = (importantThing) => {
    return (
      <div className={styles.importantToSay}>
        <h3>חשוב להגיד</h3>
        {importantThing.things.map((thing, thingIndex) => (
          <React.Fragment key={thingIndex}>
            <p className={styles.importantThing}>
              <span className={styles.boldTitle}>{thing.title}</span>
              <br />
              {thing.content.map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
            {thing.marked && thing.marked.length ? (
              <p className={styles.importantThing}>
                {thing.marked.map((markedLine, markedIndex) => (
                  <React.Fragment key={markedIndex}>
                    <span className={styles.boldTitle}>{markedLine}</span>
                    <br />
                  </React.Fragment>
                ))}
              </p>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    );
  };
  //   generatePDF(props.userDetails, props.route, (pdfBlob) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(pdfBlob);
  //     reader.onloadend = function () {
  //       const base64data = reader.result;

  //       // Sending userDetails and PDF to the server
  //       axios
  //         .post(`/api/sendPriceSuggestion`, {
  //           userDetails: props.userDetails,
  //           route: props.route,
  //           pdfBlob: base64data,
  //         })
  //         .then((res) => {
  //           console.log("Server response:", res);

  //           // Triggering download for the user
  //           const blobURL = window.URL.createObjectURL(pdfBlob);
  //           const tempLink = document.createElement("a");
  //           tempLink.href = blobURL;
  //           tempLink.setAttribute("download", "userDetails.pdf");
  //           document.body.appendChild(tempLink);
  //           tempLink.click();
  //           document.body.removeChild(tempLink);
  //           window.URL.revokeObjectURL(blobURL);
  //         });
  //     };
  //   });

  const handleEventType = (eventType) => {
    let label;
    const eventTypesArr = props?.eventTypes;
    if (eventTypesArr) {
      console.log("eventTypesArr");
      console.log(eventTypesArr);
      console.log("eventType");
      console.log(eventType);
      eventTypesArr.forEach((event) => {
        if (event.value == eventType) {
          console.log("eurika! : " + event.label);
          label = event.label;
        }
      });
    }
    return label;
  };

  const handleTouteTypeLabel = (routeType) => {
    if (routeType === "OneWay") {
      return "כיוון אחד";
    } else if (routeType === "TwoWays") {
      return "הלוך וחזור";
    } else if (routeType === "MultiWay") {
      return "רב יעדים";
    }
  };

  return (
    <div className={styles.main}>
      {/* <button onClick={() => generatePDF(props.userDetails)}>send</button> */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image
            src={Logo}
            width={250}
            height={"auto"}
            alt="Saban Tours Logo"
          />
        </div>
        <div className={styles.contact}>
          <div
            className={`${styles.contactIconWrapper} ${styles.phoneIconWrapper}`}
          >
            <span>052-798-4133</span>
            {<FaMobileAlt />}
          </div>
          <div
            className={`${styles.contactIconWrapper} ${styles.emailIconWrapper}`}
          >
            <span>office@sabantours.co.il</span>
            <AiOutlineMail />
          </div>
          <div
            className={`${styles.contactIconWrapper} ${styles.websiteIconWrapper}`}
          >
            <span>https://sabantours.co.il</span>
            <TfiWorld />
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.psDates}>
          <div className={`${styles.psSendDate} ${styles.psDate}`}>
            <p>תאריך ההצעה: {formatDate(props?.route?.currentDate)}</p>
          </div>
          <div className={`${styles.psExpiryDate} ${styles.psDate}`}>
            <p>תוקף ההצעה: {formatDate(props?.route?.expDate)}</p>
          </div>
        </div>
        <h2>הצעת מחיר מס&apos; { }</h2>
        <h3>היי {props?.userDetails?.firstname}, הנה הצעת המחיר שביקשת:</h3>
        <div className={styles.clientAndTripInfoWrapper}>
          <div className={styles.clientAndTripInfo}>
            <div className={`${styles.info} ${styles.clientInfo}`}>
              <h4>פרטי הלקוח</h4>
              <p>
                <span className={styles.boldTitle}>שם הלקוח:</span>{" "}
                <span className={styles.value}>
                  {props?.userDetails?.firstname} {props?.userDetails?.lastname}
                </span>
                <br />
                <span className={styles.boldTitle}>טלפון:</span>{" "}
                <span className={styles.value}>
                  {props?.userDetails?.phone}
                </span>
                <br />
                <span className={styles.boldTitle}>אימייל:</span>{" "}
                <span className={styles.value}>
                  {props?.userDetails?.email}
                </span>
              </p>
            </div>
            <div className={`${styles.info} ${styles.tripInfo}`}>
              <h4>פרטי ההסעה</h4>
              <p>
                <span className={styles.boldTitle}>
                  <span className={styles.value}>כיוון הנסיעה:</span>
                </span>{" "}
                <span className={styles.value}>
                  {handleTouteTypeLabel(props?.route?.routeType)}
                </span>
                <br />
                <span className={styles.boldTitle}>תאריך ההסעה:</span>{" "}
                <span className={styles.value}>
                  {props?.formatDateToString(
                    props?.route?.outbound?.startPoint?.date,
                    "date"
                  )}
                </span>
                <br />
                <span className={styles.boldTitle}>סוג ההסעה:</span>{" "}
                <span className={styles.value}>
                  {handleEventType(props?.route?.eventType)}
                </span>
              </p>
            </div>
          </div>
          <div className={styles.tripDetailedInfo}>
            <BoundInfo
              bound={"outbound"}
              handleEventType={handleEventType}
              handleTouteTypeLabel={handleTouteTypeLabel}
              formatDateToString={props?.formatDateToString}
              userDetails={props?.userDetails}
              route={props?.route}
              formatDuration={props?.formatDuration}
            />
            {props?.route?.routeType == "TwoWays" && (
              <BoundInfo
                bound={"inbound"}
                handleEventType={handleEventType}
                handleTouteTypeLabel={handleTouteTypeLabel}
                formatDateToString={props?.formatDateToString}
                userDetails={props?.userDetails}
                route={props?.route}
                formatDuration={props?.formatDuration}
              />
            )}
          </div>
        </div>
        <div className={styles.priceOfferStripe}>
          <div className={styles.carImage}></div>
          <div className={styles.offerDetails}>
            <div className={styles.line}>
              <span className={styles.boldTitle}>סוג הרכב: </span>
              <span className={styles.value}>מיניבוס 19 מקומות</span>
            </div>
            <div className={styles.line}>
              <span className={styles.boldTitle}>כמות: </span>
              <span className={styles.value}>1</span>
            </div>
            <div className={styles.line}>
              <span className={styles.boldTitle}>מחיר: </span>
              <span className={styles.value}>
                {props?.price * 1.17} ש&quot;ח כולל מע&quot;מ
              </span>
            </div>
          </div>
          <div className={styles.paymentOptions}>
            <span className={styles.boldTitle}>אפשרויות תשלום:</span>
            <ul className={styles.paymentOptionsList}>
              <li className={styles.value}>מקדמה באשראי + מזומן לנהג</li>
              <li className={styles.value}>תשלום מאובטח באשראי</li>
            </ul>
          </div>
          <div className={styles.buttonDiv}>
            <button>הזמנת ההסעה</button>
          </div>
        </div>
        {ImportantThingsToSay(importantThing)}
      </div>
      <div className={styles.footer}>
        <h3>מאחלים לכם נסיעה טובה, נעימה ובטוחה!</h3>
        <Image
          className={styles.logo}
          src={Logo}
          width={200}
          height={"auto"}
          alt="Saban Tours Logo"
        />
      </div>
    </div>
  );
};

export default PriceSuggestion;
