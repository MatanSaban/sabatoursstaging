import React, { useEffect, useState } from "react";
import styles from "./checkout.module.scss";
import {
  eventTypes,
  formatDate,
  formatDateToString,
  formatDuration,
  handleEventType,
  handleRouteTypeLabel,
  showDistance,
} from "../../utils/functions";
import BoundInfo from "../../Components/Popup/BoundInfo";
import PriceSuggestion from "../pricesuggestion";

const Checkout = (props) => {

  const [selectedPaymentOption ,setSelectedPaymentOption] = useState(null);
  const [advancePayment, setAdvancePayment] = useState();
  const [fullPayment, setFullPayment] = useState();



  const calcPayments = (fullPrice) => {
    let paymentLeft;
    let advancePayment;
    let fullPayment;
    let discountSum;

    if (fullPrice) {
      advancePayment = fullPrice * 0.15;
      paymentLeft = Math.floor((fullPrice - advancePayment) / 10) * 10
      if (selectedPaymentOption == "downPayment") {
        return setAdvancePayment({
          downPayment: advancePayment,
          paymentLeft: paymentLeft
        });

      } else {
        fullPayment = fullPrice - fullPrice * 0.05;
        let fullPaymentRoundedDownToTen = Math.floor(fullPayment / 10) * 10;
              // Calculate the discount amount and percentage
        let discountSum = fullPrice - fullPaymentRoundedDownToTen;
        let discountPercentage = (discountSum / fullPrice) * 100;

        return setFullPayment( {
          fullPayment : fullPaymentRoundedDownToTen, 
          discountSum : discountSum,
          discountPercentage: discountPercentage
        } );
      }
    }
  }

  

  useEffect(() => {

    calcPayments(props?.userRoute?.price);

  },[selectedPaymentOption, props?.userRoute?.price])

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.pageHero}>
        <h1>הזמנת ההסעה</h1>
      </div>
      <div className={styles.checkoutContent}>
        <div className={styles.routeDetails}>
          <PriceSuggestion
            route={props?.userRoute}
            userDetails={props?.userRoute}
            show={true}
            eventTypes={eventTypes}
            formatDateToString={formatDateToString}
            showDistance={showDistance}
            formatDuration={formatDuration}
            price={props?.userRoute?.price}
            offerId={props?.userRoute?.offerId}
            sendDataToApp={props?.sendDataToApp}
            handlePopup={props.handlePopup}
          />
        </div>
        <div className={`${styles.checkoutBar}`} style={{ top: `${props?.headerHeight + 20}px` }}>
          <h2 className={styles.mainTitle}>פרטי תשלום</h2>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>בחירת תנאי תשלום</h3>
            <div className={styles.paymentOptions}>
              <label>
                <input onChange={(e) => setSelectedPaymentOption(e.target.value)} type="radio" name="paymentOption" value="downPayment" />
                תשלום מקדמה של ₪{advancePayment?.downPayment?.toFixed(0)} וסכום של ₪{advancePayment?.paymentLeft?.toFixed(0)} מול הנהג
              </label>
              <label>
                <input onChange={(e) => setSelectedPaymentOption(e.target.value)} type="radio" name="paymentOption" value="fullPayment" />
                תשלום של ₪{fullPayment?.fullPayment?.toFixed(0)} במקום ₪{props?.userRoute?.price?.toFixed(0)} (הנחה של ₪{fullPayment?.discountSum?.toFixed(0)})
              </label>
              {/* {
              selectedPaymentOption == "downPayment" ? 
              "calcDownPayment(props?.userRoute?.price)"
              : 
              ""
              }  */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
