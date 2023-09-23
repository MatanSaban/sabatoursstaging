import React, { useRef } from "react";
import styles from "../../Components/Popup/pricesuggestion.module.scss";
import Logo from "../../public/media/SabanToursLogo.svg";
import Image from "next/image";
import { FaMobileAlt } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { AiOutlineMail } from "react-icons/ai";
import BoundInfo from "../../components/Popup/BoundInfo";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const PriceSuggestion = (props) => {
  const componentRef = useRef();

  const exportComponentAsPDF = async (componentRef) => {
    const canvas = await html2canvas(componentRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0);
    pdf.save("my-document.pdf");
  };

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
    <div className={styles.main} ref={componentRef}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image src={Logo} width={250} height={"auto"} alt="logo" />
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
            <p>תאריך ההצעה: {"28/01/2024"}</p>
          </div>
          <div className={`${styles.psExpiryDate} ${styles.psDate}`}>
            <p>תוקף ההצעה: {"28/01/2024"}</p>
          </div>
        </div>
        <h2>הצעת מחיר מס&quot; { }</h2>
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
            <BoundInfo
              bound={"inbound"}
              handleEventType={handleEventType}
              handleTouteTypeLabel={handleTouteTypeLabel}
              formatDateToString={props?.formatDateToString}
              userDetails={props?.userDetails}
              route={props?.route}
              formatDuration={props?.formatDuration}
            />
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
              <span className={styles.value}>950 ש&quot;ח כולל מע&quot;מ</span>
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
        <div className={styles.importantToSay}>
          <h3>חשוב להגיד</h3>
          <p className={styles.importantThing}>
            <span className={styles.boldTitle}>תנאי ביטול:</span>
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
            repellendus tenetur, voluptatum itaque odio officiis tempore
            praesentium? Saepe maiores laudantium accusamus quibusdam eveniet.
            Ducimus veritatis quae reiciendis maxime adipisci? Laboriosam?
          </p>
          <p className={styles.importantThing}>
            <span className={styles.boldTitle}>תנאי ביטול:</span>
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
            repellendus tenetur, voluptatum itaque odio officiis tempore
            praesentium? Saepe maiores laudantium accusamus quibusdam eveniet.
            Ducimus veritatis quae reiciendis maxime adipisci? Laboriosam?
          </p>
          <p className={styles.importantThing}>
            <span className={styles.boldTitle}>תנאי ביטול:</span>
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
            repellendus tenetur, voluptatum itaque odio officiis tempore
            praesentium? Saepe maiores laudantium accusamus quibusdam eveniet.
            Ducimus veritatis quae reiciendis maxime adipisci? Laboriosam?
          </p>
        </div>
      </div>
      <div className={styles.footer}>
        <h3>מאחלים לכם נסיעה טובה, נעימה ובטוחה!</h3>
        <Image className={styles.logo} src={Logo} width={200} height={"auto"} alt="logo" />
      </div>
      <button onClick={() => exportComponentAsPDF(componentRef)}>
        Download PDF
      </button>
    </div>
  );
};

export default PriceSuggestion;
