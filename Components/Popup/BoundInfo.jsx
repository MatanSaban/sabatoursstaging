import React from "react";
import stopIcon from "../../public/media/stopIcon.svg";
import locationIcon from "../../public/media/sabantoursLocationIcon.svg";
import endPointIcon from "../../public/media/saban_tours_favicon_pinkred_green.svg";
import styles from "./pricesuggestion.module.scss";
import Image from "next/image";

const BoundInfo = (props) => {
  const direction = props?.bound;

  return (
    <div
      className={`${direction == "outbound" ? styles.outboundInfo : styles.inboundInfo
        } ${styles.boundInfo}`}
    >
      <h5>כיוון {direction == "outbound" ? "הלוך" : "חזור"}</h5>
      <ul className={styles.detailsList}>
        <li className={styles.startPointWrapper}>
          {
            <Image
              src={locationIcon}
              width={15}
              height={"auto"}
              alt="start point icon"
            />
          }
          <span className={styles.boldTitle}>נקודת התייצבות:</span>{" "}
          <span className={styles.value}>
            {props?.route?.[direction]?.startPoint?.address}
          </span>
        </li>
        <li>
          <span className={styles.boldTitle}>שעת התייצבות:</span>{" "}
          <span className={styles.value}>
            {props?.formatDateToString(
              props?.route?.[direction]?.startPoint?.date,
              "time"
            )}
          </span>
        </li>
        <li>
          <span className={styles.boldTitle}>מרחק נסיעה הלוך:</span>{" "}
          <span className={styles.value}>
            {props?.route?.[direction]?.distance} ק&quot;מ
          </span>
        </li>
        <li>
          <span className={styles.boldTitle}>מס&apos; נוסעים:</span>{" "}
          <span className={styles.value}>{props?.route?.passengers}</span>
        </li>
        <li>
          <span className={styles.boldTitle}>זמן נסיעה מוערך:</span>{" "}
          <span className={styles.value}>
            {
              props?.formatDuration(
                props?.route?.[direction]?.duration
              ) /** need to calc it */
            }
          </span>
        </li>
        <li>
          <span className={styles.boldTitle}>עצירות בדרך:</span>{" "}
          <span className={styles.value}>
            {props?.route?.[direction]?.stops.length}
          </span>
          {props?.route?.[direction]?.stops?.length > 0 && (
            <>
              <ul className={styles.stopList}>
                {props?.route?.[direction]?.stops?.map((stop) => {
                  return (
                    <li key={stop.id}>
                      <Image
                        src={stopIcon}
                        width={10}
                        height={"auto"}
                        alt="stop icon"
                      />
                      <span>{stop.address}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </li>
        <li className={styles.endPointWrapper}>
          {
            <Image
              src={endPointIcon}
              width={15}
              height={"auto"}
              alt="end point icon"
            />
          }
          <span className={styles.boldTitle}>נקודת היעד:</span>{" "}
          <span className={styles.value}>
            {props?.route?.[direction]?.endPoint?.address}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default BoundInfo;
