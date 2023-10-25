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
import { customRound, formatDate, formatDateToString, handleRouteTypeLabel } from "../../utils/functions";
import { useRouter } from "next/navigation";
const PriceSuggestion = (props) => {
  const router = useRouter();
  

  const handleEventType = (eventType) => {
    let label;
    const eventTypesArr = props?.eventTypes;
    if (eventTypesArr) {
      eventTypesArr.forEach((event) => {
        if (event.value == eventType) {
          label = event.label;
        }
      });
    }
    return label;
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
        <h2 className={styles.suggestionTitle}>הצעת מחיר מס&apos; {props?.offerId}</h2>
        <h3 className={styles.suggestionGreeting}>היי {props?.userDetails?.firstname}, הנה הצעת המחיר שביקשת:</h3>
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
            {props?.route?.routeType == "TwoWays" && (
              <BoundInfo
                bound={"inbound"}
                handleEventType={handleEventType}
                handleRouteTypeLabel={handleRouteTypeLabel}
                formatDateToString={formatDateToString}
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
                {customRound(props?.price * 1.17)} ש&quot;ח כולל מע&quot;מ
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
            <button onClick={() => {
              props.handlePopup(
                false
              );
              router.push('/checkout');
            }}>
            הזמנת ההסעה 
            </button>
          </div>
        </div>
        {/* {ImportantThingsToSay(importantThing)} */}
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
