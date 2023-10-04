import React from 'react';
import styles from './formFooter.module.scss'
import Link from "next/link";
import { AiOutlineQuestion } from "react-icons/ai";
import { BsReverseListColumnsReverse } from "react-icons/bs";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { SlPeople } from "react-icons/sl";
import { PiSuitcaseSimpleLight } from "react-icons/pi";
import RouteAndDetails from "../Popup/RouteAndDetails";
import axios from "axios";
import checkIcon from "../../public/media/checkIcon.svg";
import Image from 'next/image';



const FormFooter = (props) => {
    
  return (
    <div className={styles.formFooter}>
          <div
            className={`${styles.sameWayCheckboxWrapper} ${styles.checkboxWrapper}`}
          >
            {props?.route?.routeType == "TwoWays" && (
              <>
                <input type="checkbox" name="sameWay" id="sameWay" />
                <div
                  className={styles.customInputIcon}
                  onClick={() => {
                    if (
                      props?.route.outbound.startPoint.date &&
                      props?.route.outbound.startPoint.time &&
                      props?.route.outbound.startPoint.address &&
                      props?.route.outbound.endPoint.address
                    ) {
                      props?.setRoute({ ...props?.route, sameWayBack: !props?.route.sameWayBack });
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
                  {props?.route.sameWayBack === true && (
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
                value={props?.route.passengers ? props?.route.passengers : 1}
                min={1}
                max={60}
                onChange={(e) => {
                  if (e.target.value < 1) {
                    e.target.value = 1;
                    props?.setRoute({ ...props?.route, passengers: parseInt(1) });
                  } else if (e.target.value > 60) {
                    e.target.value = 60;
                    props?.setRoute({ ...props?.route, passengers: parseInt(60) });
                  } else {
                    props?.setRoute({
                      ...props?.route,
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
                  props?.setRoute({
                    ...props?.route,
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
                  props?.setRoute({
                    ...props?.route,
                    eventType: e.target.value,
                  });
                }}
                name="eventType"
                id="eventType"
              >
                {props?.eventTypes.map((eventType, index) => {
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
                props?.setRoute({
                  ...props?.route,
                  acceptance: e.target.checked,
                })
              }
            />
            <div
              className={styles.customInputIcon}
              onClick={() =>
                props?.setRoute({ ...props?.route, acceptance: !props?.route.acceptance })
              }
            >
              {props?.route.acceptance === true && (
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
          {
            props?.windowWidth < 769 && 
            <button className={`${styles.directionButton} ${styles.directionButtonBackward}`} onClick={(e) => props?.handleStages(e, props?.stage - 1)}>
                <HiArrowNarrowLeft />
                <span>אחורה</span>
            </button>
          }
          <button
            className={`${styles.priceRequestButton} ${!props?.canProceed() && styles.cannotSend
              }`}
            disabled={props?.canProceed() ? false : true}
            onClick={(e) => {
                let route = props?.route;
                let eventTypes = props?.eventTypes;
              const userRoute = props.userRoute;
              e.preventDefault();
              props?.canProceed() &&
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
                          formatDateToString={props?.formatDateToString}
                          showDistance={props?.showDistance}
                          formatDuration={props?.formatDuration}
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
  )
}

export default FormFooter