import React from 'react'
import CreditCardPrev from './CreditCardPrev';
import styles from './paymentForm.module.scss'


const PaymentForm = (props) => {
    const [containerHeight, setContainerHeight] = React.useState('0px');
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        if (props?.showPaymentDetailsOnMobile) {
            const height = containerRef.current.scrollHeight;
            setContainerHeight(`${height}px`);
        } else {
            setContainerHeight('0px');
        }
    }, [props?.showPaymentDetailsOnMobile]);

    return (
        <div
            ref={containerRef}
            className={`${styles.formAndCardWrapper} ${props?.showPaymentDetailsOnMobile ? styles.show : styles.hide}`}
            style={{ height: containerHeight }}
        >
            <h3 className={styles.mainTitle}>פרטי תשלום</h3>
            <CreditCardPrev cardDetails={props?.cardDetails} />
            <form onSubmit={(e) => props?.handleSubmitPayment(e)} className={styles.ccDetailsForm}>
                <div className={`${styles.ccNameAndIdWrapper} ${styles.wrapper}`}>
                    <input
                        required
                        onChange={(e) => { props?.handleCardDetails(e) }}
                        type="text"
                        name="fullNameOnCard"
                        id="fullNameOnCard"
                        placeholder="שם מלא על הכרטיס"
                    />
                    <input
                        required
                        onChange={(e) => { props?.handleCardDetails(e) }}
                        type="text"
                        name="citizenId"
                        id="citizenId"
                        placeholder="תעודת זהות"
                        maxLength={9} // Limit to 16 characters
                        onBlur={(e) => props?.validateIsraeliId(e.target.value)}
                        pattern="[0-9]*"
                        inputmode="numeric"
                        style={
                            props?.isValid === null
                                ? { border: "1px solid #9b9b9b" }
                                : props?.isValid
                                    ? { border: "2px solid green" }
                                    : { border: "2px solid red" }
                        } />
                </div>
                <div className={`${styles.ccNumberWrapper} ${styles.wrapper}`}>
                    <input
                        required
                        onChange={(e) => { props?.handleCardDetails(e); props?.handleSelectListOpenAndFocuses(e) }}
                        type="text"
                        name="cardNumber"
                        id="cardNumber"
                        pattern="[0-9]*"
                        inputmode="numeric"
                        placeholder="מספר כרטיס"
                        ref={props?.cardNumberRef}
                        style={
                            props?.isValidCC === null
                                ? { border: "1px solid #9b9b9b" }
                                : props?.isValidCC
                                    ? { border: "2px solid green" }
                                    : { border: "2px solid red" }
                        }
                        onBlur={(e) => props?.validateCardNumber(props?.cardDetails?.ccNumber)}
                        maxLength={16} // Limit to 16 characters
                        onKeyPress={(e) => {
                            // Allow only numeric characters (0-9) and prevent other characters
                            if (e.key && !/^[0-9]*$/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                </div>
                <div className={`${styles.ccExpDateAndCvvWrapper} ${styles.wrapper}`}>
                    <select
                        required
                        ref={props?.yearSelectRef}
                        onChange={(e) => { props?.handleCardDetails(e); props?.handleSelectListOpenAndFocuses(e) }}
                        className={`${styles.number} ${styles.year}`}
                        name="year"
                        id="year"
                    >
                        <option selected disabled value="">
                            שנה
                        </option>
                        {Array.from({ length: 21 }, (_, i) => {
                            const currentYear = new Date().getFullYear();
                            const yearValue = (currentYear + i).toString();
                            return (
                                <option key={i} value={yearValue}>
                                    {yearValue}
                                </option>
                            );
                        })}
                    </select>
                    <select
                        required
                        ref={props?.monthSelectRef}
                        onChange={(e) => { props?.handleCardDetails(e); props?.handleSelectListOpenAndFocuses(e) }}
                        className={`${styles.number} ${styles.month}`}
                        name="month"
                        id="month"
                    >
                        <option selected disabled value="">
                            חודש
                        </option>
                        {Array.from({ length: 12 }, (_, i) => {
                            const monthValue = (i + 1).toString().padStart(2, '0o');
                            return (
                                <option key={i} value={monthValue}>
                                    {monthValue}
                                </option>
                            );
                        })}
                    </select>
                    <input
                        onChange={(e) => props?.handleCardDetails(e)}
                        className={styles.number}
                        type="text"
                        name="CVV"
                        id="CVV"
                        ref={props?.cvvInputRef}
                        required
                        placeholder="CVV"
                        maxLength={3} // Set maximum length to 3 characters
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                        }}
                        onFocus={() => props?.setCardDetails((prev) => ({ ...prev, cardSide: 'back' }))}
                        onBlur={(e) => {
                            props?.setCardDetails((prev) => ({ ...prev, cardSide: 'front' }));
                            if (e.target.value.length < 3) {
                                e.target.value = '';
                            }
                        }}
                    />
                </div>
                <h4 className={styles.dealPriceSelected}>הסכום לתשלום : {props?.selectedPaymentOption === "downPayment" ? `₪${parseFloat(props?.advancePayment?.downPayment.toFixed(0))}` : `₪${parseFloat(props?.fullPayment?.props?.fullPayment.toFixed(0))}`}</h4>
                <button className={`${styles.submitButton} ${props?.submitButtonRef?.current?.getAttribute("disabled") == true && styles.disabled}`} ref={props?.submitButtonRef}>פתיחת הזמנה מאובטחת</button>
                <span>{props?.error}</span>
            </form>
        </div>
    )
}

export default PaymentForm