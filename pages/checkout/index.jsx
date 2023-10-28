import React, { useEffect, useState, useRef } from "react";
import styles from "./checkout.module.scss";
import {
	eventTypes,
	formatDateToString,
	formatDuration,
	isMobile,
	showDistance,
} from "../../utils/functions";
import PriceSuggestion from "../pricesuggestion";
import axios from "axios";
import useIsraeliIdValidation from '../../Components/Misc/Hooks/IsraeliIdValidation';
import useCardNumberValidation from '../../Components/Misc/Hooks/CreditCardValidation';
import PaymentForm from "../../Components/Misc/PaymentForm/PaymentForm";
import { AiFillMinusCircle, AiFillPlusCircle, AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import PageHero from "../../Components/Misc/PageHero";
import Head from "next/head";


const Checkout = (props) => {
	const [selectedPaymentOption, setSelectedPaymentOption] = useState("downPayment");
	const [advancePayment, setAdvancePayment] = useState();
	const [fullPayment, setFullPayment] = useState();
	const [isValidCC, validateCardNumber] = useCardNumberValidation();
	const [isValid, validateIsraeliId] = useIsraeliIdValidation();
	const [error, setError] = useState(null);
	const [cardDetails, setCardDetails] = useState({
		fullNameOnCard: "XXXXX XXXXX",
		citizenId: "",
		ccNumber: "XXXX XXXX XXXX XXXX",
		ccDate: {
			month: "XX",
			year: "XXXX",
		},
		ccCVV: "XXX",
		cardSide: "front",
	});
	const yearSelectRef = useRef(null);
	const monthSelectRef = useRef(null);
	const cvvInputRef = useRef(null);
	const submitButtonRef = useRef(null);
	const cardNumberRef = useRef(null);

	const handleCardDetails = (e) => {
		const { name, value } = e.target;


		setCardDetails((prevDetails) => {
			const fieldMapping = {
				fullNameOnCard: 'fullNameOnCard',
				cardNumber: 'ccNumber',
				citizenId: 'citizenId',
				month: 'ccDate',
				year: 'ccDate',
				CVV: 'ccCVV',
			};
			const placeholderMapping = {
				fullNameOnCard: "XXXXX XXXXX",
				ccNumber: 'XXXX XXXX XXXX XXXX',
				ccDate: { month: 'XX', year: 'XXXX' },
				ccCVV: 'XXX',
			};
			const fieldToUpdate = fieldMapping[name];
			const placeholder = placeholderMapping[fieldToUpdate];

			let updatedValue;
			if (fieldToUpdate === 'ccDate') {
				updatedValue = mergeInputWithPlaceholder(
					value,
					placeholder[name],
					name
				);
				return {
					...prevDetails,
					ccDate: {
						...prevDetails.ccDate,
						[name]: updatedValue, // Update either the month or the year
					},
				};
			} else {
				updatedValue = mergeInputWithPlaceholder(value, placeholder, name);
				return {
					...prevDetails,
					[fieldToUpdate]: updatedValue,
				};
			}
		});

	};

	const handleSelectListOpenAndFocuses = (e) => {
		const { name, value } = e.target;
		if (name === 'citizenId' && value.length === 9) {
			cardNumberRef.current.focus();
		} else if (name === 'cardNumber' && value.length === 16) {
			yearSelectRef.current.focus();
		} else if (name === 'year' && value.length === 4) {
			monthSelectRef.current.focus()
		} else if (name === 'month' && value.length === 2) {
			cvvInputRef.current.focus();
		}
	}

	const mergeInputWithPlaceholder = (input, placeholder, fieldName) => {
		if (fieldName === 'fullNameOnCard' || fieldName === 'citizenId') {
			return input; // Return user input directly for fullNameOnCard
		}

		const inputChars = input.replace(/\s/g, '').split('');
		let placeholderChars = placeholder.split('');
		for (let i = 0, j = 0; i < placeholderChars.length && j < inputChars.length; i++) {
			if (placeholderChars[i] === ' ') continue;
			placeholderChars[i] = inputChars[j];
			j++;
		}
		for (let i = 0, j = 0; i < placeholderChars.length; i++) {
			if (placeholderChars[i] !== ' ' && j >= inputChars.length) {
				placeholderChars[i] = 'X';
			}
			if (placeholderChars[i] !== ' ') j++;
		}
		return placeholderChars.join('');
	};

	const calcPayments = (fullPrice) => {
		let paymentLeft;
		let advancePayment;
		let fullPayment;
		let discountSum;
		let advPaymentDiscount;

		if (fullPrice) {
			advancePayment = fullPrice * 0.15;
			paymentLeft = Math.floor((fullPrice - advancePayment) / 10) * 10;
			advPaymentDiscount = (((fullPrice - advancePayment) / 10) * 10) - (Math.floor((fullPrice - advancePayment) / 10) * 10)
			setAdvancePayment({
				downPayment: advancePayment,
				paymentLeft: paymentLeft,
				advPaymentDiscount: advPaymentDiscount
			});
			fullPayment = fullPrice - fullPrice * 0.05;
			let fullPaymentRoundedDownToTen = Math.floor(fullPayment / 10) * 10;
			// Calculate the discount amount and percentage
			let discountSum = fullPrice - fullPaymentRoundedDownToTen;
			let discountPercentage = (discountSum / fullPrice) * 100;

			setFullPayment({
				fullPayment: fullPaymentRoundedDownToTen,
				discountSum: discountSum,
				discountPercentage: discountPercentage,
			});
		}
	};

	useEffect(() => {
		if (props?.userRoute?.price) {
			calcPayments(props?.userRoute?.price);
		}
	}, [selectedPaymentOption, props?.userRoute]);

	const handleSubmitPayment = async (e) => {
		e.preventDefault();
		if (!validateCardNumber(cardDetails?.ccNumber)) {
			return setError("מספר כרטיס האשראי לא תקין");
		}
		if (!validateIsraeliId(cardDetails?.citizenId)) {
			return setError("מספר תעודת הזהות לא תקין");
		}
		submitButtonRef.current.setAttribute("disabled", true);
		const sendPayment = await axios.post(`/api/handlePayment`, {
			"Customer": {
				"Name": props?.userRoute?.firstname + " " + props?.userRoute?.lastname,
				"Phone": props?.userRoute?.phone,
				"EmailAddress": props?.userRoute?.email,
			},
			"items": [
				{
					"Item": {
						"SKU": props?.userRoute?.offerId,
						"Name": props?.userRoute?.routeType === "OneWay" ? "נסיעה לכיוון אחד" : "נסיעת הלוך ושוב",
						"Description": props?.userRoute?.routeType === "OneWay" ?
							`נסיעה הלוך מ: ${props?.userRoute?.outbound?.startPoint?.address} \nל: ${props?.userRoute?.outbound?.endPoint?.address} \nבתאריך: ${formatDateToString(props?.userRoute?.outbound?.startPoint?.date, 'date')} ובשעה : ${formatDateToString(props?.userRoute?.outbound?.startPoint?.time, 'time')}  \nעם ${props?.userRoute?.outbound?.stops?.length} עצירות בדרך.`
							:
							`נסיעה הלוך מ: ${props?.userRoute?.outbound?.startPoint?.address} \nל: ${props?.userRoute?.outbound?.endPoint?.address} \nבתאריך: ${formatDateToString(props?.userRoute?.outbound?.startPoint?.date, 'date')} \nעם ${props?.userRoute?.outbound?.stops?.length} עצירות בדרך
				 ונסיעה בחזור מ: ${props?.userRoute?.inbound?.startPoint?.address} \nל: ${props?.userRoute?.inbound?.endPoint?.address} \nבתאריך: ${formatDateToString(props?.userRoute?.inbound?.startPoint?.date, 'date')} ובשעה : ${formatDateToString(props?.userRoute?.inbound?.startPoint?.time, 'time')} \nעם ${props?.userRoute?.inbound?.stops?.length} עצירות בדרך.`
					},
					"Quantity": 1,
					"UnitPrice": selectedPaymentOption === "downPayment" ? parseFloat(advancePayment?.downPayment.toFixed(0)) / 1.17 : parseFloat(fullPayment?.fullPayment.toFixed(0)) / 1.17,
					"Total": selectedPaymentOption === "downPayment" ? parseFloat(advancePayment?.downPayment.toFixed(0)) / 1.17 : parseFloat(fullPayment?.fullPayment.toFixed(0)) / 1.17
				}
			],
			"PaymentMethod": {
				"CreditCard_Number": cardDetails?.ccNumber,
				"CreditCard_LastDigits": cardDetails?.ccNumber?.slice(-4),
				"CreditCard_ExpirationMonth": parseInt(cardDetails?.ccDate?.month),
				"CreditCard_ExpirationYear": parseInt(cardDetails?.ccDate?.year),
				"CreditCard_CVV": cardDetails?.ccCVV,
				"CreditCard_CitizenID": cardDetails?.ccDate?.citizenId,
				"Type": 1
			},
			"AutoCapture": false,
			"AuthoriseOnly": true,
			"AuthorizeAmount": selectedPaymentOption === "downPayment" ? parseFloat(advancePayment?.downPayment.toFixed(0)) / 1.17 : parseFloat(fullPayment?.fullPayment.toFixed(0)) / 1.17
		}
		);
		const sendPaymentRes = sendPayment?.data;
	};


	const [showPaymentDetailsOnMobile, setShowPaymentDetailsOnMobile] = useState(false);

	const handlePaymentShow = () => {
		return setShowPaymentDetailsOnMobile(!showPaymentDetailsOnMobile);
	}

	return (
		<>
			<Head>
				<title>
					סבן טורס | עמוד תשלום
				</title>
				<meta name="robots" content="noindex" />
			</Head>
			<div className={styles.checkoutPage}>
				<PageHero title={`הזמנת נסיעה`} />
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
							sendDataToApp={props.sendDataToApp}
							handlePopup={props.handlePopup}
						/>
					</div>
					<div className={`${styles.checkoutBar} ${showPaymentDetailsOnMobile && styles.show}`} style={!isMobile(props?.windowWidth) ? { top: `${props?.headerHeight + 20}px` } : null}>
						<section className={styles.section}>
							<h3 className={styles.sectionTitle}>בחירת תנאי תשלום</h3>
							<div className={styles.paymentOptions}>
								<label>
									<input
										onChange={(e) => setSelectedPaymentOption(e.target.value)}
										type="radio"
										name="paymentOption"
										value="downPayment"
										defaultChecked
									/>
									תשלום מקדמה של <b className={styles.toPayNow}>₪{advancePayment?.downPayment?.toFixed(0)}</b> וסכום של <b className={styles.toPayLater}>₪{advancePayment?.paymentLeft?.toFixed(0)}</b> מול הנהג (הנחה של ₪{advancePayment?.advPaymentDiscount.toFixed(0)})
								</label>
								<label>
									<input
										onChange={(e) => setSelectedPaymentOption(e.target.value)}
										type="radio"
										name="paymentOption"
										value="fullPayment"
									/>
									תשלום אונליין של <b className={styles.toPayNow}>₪{fullPayment?.fullPayment?.toFixed(0)}</b> במקום <b className={styles.instead}>₪{props?.userRoute?.price?.toFixed(0)}</b> (הנחה של <b className={styles.discount}>₪{fullPayment?.discountSum?.toFixed(0)}</b>)
								</label>
							</div>
						</section>
						{
							!isMobile(props?.windowWidth) && <section className={styles.section}>
								<h4 className={styles.importantMessage}>
									הודעה חשובה!
									<br />
									לאחר הזנת פרטי התשלום לא נחייב אותך עד לאישור הנסיעה בשיחת טלפון.
									<br />
									אך כן תיתפס מסגרת של {selectedPaymentOption == "downPayment" ? `${advancePayment?.downPayment?.toFixed(0)}₪` : `${fullPayment?.fullPayment?.toFixed(0)}₪`} עד אישור או אי אישור הנסיעה מצידנו.
								</h4>
							</section>
						}
						<section className={`${styles.section} ${styles.ccDetailsWrapper} `} >
							<PaymentForm
								showPaymentDetailsOnMobile={showPaymentDetailsOnMobile}
								cardDetails={cardDetails}
								userRoute={props?.userRoute}
								handleCardDetails={handleCardDetails}
								handleSubmitPayment={handleSubmitPayment}
								handleSelectListOpenAndFocuses={handleSelectListOpenAndFocuses}
								isValid={isValid}
								cardNumberRef={cardNumberRef}
								isValidCC={isValidCC}
								yearSelectRef={yearSelectRef}
								monthSelectRef={monthSelectRef}
								cvvInputRef={cvvInputRef}
								selectedPaymentOption={selectedPaymentOption}
								fullPayment={fullPayment}
								submitButtonRef={submitButtonRef}
								error={error}
								validateIsraeliId={validateIsraeliId}
								validateCardNumber={validateCardNumber}
								setCardDetails={setCardDetails}
								advancePayment={advancePayment}
								scrolling={props?.scrolling}
								scrollTopVal={props?.scrollTopVal}
							/>
						</section>
						<button
							className={styles.togglePaymentButton}
							onClick={() => handlePaymentShow()}>
							{showPaymentDetailsOnMobile ?
								<><span>הקטן אזור תשלום</span> <AiOutlineCaretUp /></>
								: <><span>מעבר לתשלום</span> <AiOutlineCaretDown /></>}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Checkout;