import React, { useRef } from "react";
import styles from "../../Components/Popup/pricesuggestion.module.scss";
import Logo from "../../public/media/SabanToursLogo.svg";
import Image from "next/image";
import BoundInfo from "../../Components/Popup/BoundInfo";
import { importantThing, showCarImage, translateCarType } from "../../utils/functions";
import { formatDateToString, handleEventType, handleRouteTypeLabel } from "../../utils/functions";

const PriceSuggestion = (props) => {
  const componentRef = useRef();


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

  return (
    <div className={styles.main} ref={componentRef}>
      <div className={styles.body}>
        <div className={styles.psDates}>
          <div className={`${styles.psSendDate} ${styles.psDate}`}>
            <p>תאריך ההצעה: {formatDateToString(props?.userDetails?.currentDate, "date")}</p>
          </div>
          <div className={`${styles.psExpiryDate} ${styles.psDate}`}>
            <p>תוקף ההצעה: {formatDateToString(props?.userDetails?.expDate, "date")}</p>
          </div>
        </div>
        <h2>הצעת מחיר מס&apos; { props?.offerId}</h2>
        <h3 className={styles.priceOfferGreeting}>היי {props?.userDetails?.firstname}, הנה הצעת המחיר שביקשת:</h3>
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
                  {handleRouteTypeLabel(props?.route?.routeType)}
                </span>
                <br />
                <span className={styles.boldTitle}>תאריך ההסעה:</span>{" "}
                <span className={styles.value}>
                  {formatDateToString(
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
              handleRouteTypeLabel={handleRouteTypeLabel}
              formatDateToString={formatDateToString}
              userDetails={props?.userDetails}
              route={props?.route}
              formatDuration={props?.formatDuration}
            />
            {props?.route?.routeType == "TwoWays" && <BoundInfo
              bound={"inbound"}
              handleEventType={handleEventType}
              handleRouteTypeLabel={handleRouteTypeLabel}
              formatDateToString={formatDateToString}
              userDetails={props?.userDetails}
              route={props?.route}
              formatDuration={props?.formatDuration}
            />}
          </div>
        </div>
        <div className={styles.priceOfferStripe}>
          <div className={styles.carImage}>
            <Image src={showCarImage(props?.userDetails?.carType)} height={150} width={150} />
          </div>
          <div className={styles.offerDetails}>
            <div className={styles.line}>
              <span className={styles.boldTitle}>סוג הרכב: </span>
              <span className={styles.value}>{translateCarType(props?.userDetails?.carType)}</span>
            </div>
            {/* <div className={styles.line}>
              <span className={styles.boldTitle}>כמות: </span>
              <span className={styles.value}>1</span>
            </div> */}
            <div className={styles.line}>
              <span className={styles.boldTitle}>מחיר: </span>
              <span className={styles.value}>{props?.userDetails?.price} ש&quot;ח כולל מע&quot;מ</span>
            </div>
          </div>
          <div className={styles.paymentOptions}>
            <span className={styles.boldTitle}>אפשרויות תשלום:</span>
            <ul className={styles.paymentOptionsList}>
              <li className={styles.value}>מקדמה באשראי + מזומן לנהג</li>
              <li className={styles.value}>תשלום מלא מאובטח באשראי</li>
            </ul>
          </div>
        </div>
        {ImportantThingsToSay(importantThing)}
      </div>
      <div className={styles.footer}>
        <h3>מאחלים לכם נסיעה טובה, נעימה ובטוחה!</h3>
        <Image className={styles.logo} src={Logo} width={200} height={"auto"} alt="logo" />
      </div>
      {/* <button onClick={() => exportComponentAsPDF(componentRef)}>
        הורדת הצעת המחיר
      </button> */}
    </div>
  );
};

export default PriceSuggestion;
