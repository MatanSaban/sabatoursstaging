import React, { useEffect, useState, useRef } from "react";
import styles from "./checkout.module.scss";
import {
	eventTypes,
	formatDateToString,
	formatDuration,
	showDistance,
} from "../../utils/functions";
import PriceSuggestion from "../pricesuggestion";
import CreditCardPrev from "../../Components/Misc/CreditCardPrev/CreditCardPrev";
import axios from "axios";

const Checkout = (props) => {
	const [selectedPaymentOption, setSelectedPaymentOption] = useState("downPayment");
	const [advancePayment, setAdvancePayment] = useState();
	const [fullPayment, setFullPayment] = useState();
	const [isValidCC, setisValidCC] = useState(null);
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
						[name]: parseInt(updatedValue), // Update either the month or the year
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

		if (fullPrice) {
			advancePayment = fullPrice * 0.15;
			paymentLeft = Math.floor((fullPrice - advancePayment) / 10) * 10;
			if (selectedPaymentOption == "downPayment") {
				return setAdvancePayment({
					downPayment: advancePayment,
					paymentLeft: paymentLeft,
				});
			} else {
				fullPayment = fullPrice - fullPrice * 0.05;
				let fullPaymentRoundedDownToTen = Math.floor(fullPayment / 10) * 10;
				// Calculate the discount amount and percentage
				let discountSum = fullPrice - fullPaymentRoundedDownToTen;
				let discountPercentage = (discountSum / fullPrice) * 100;

				return setFullPayment({
					fullPayment: fullPaymentRoundedDownToTen,
					discountSum: discountSum,
					discountPercentage: discountPercentage,
				});
			}
		}
	};

	useEffect(() => {
		if (props?.userRoute?.price) {
			calcPayments(props?.userRoute?.price);
		}
	}, [selectedPaymentOption, props?.userRoute]);

	const handleSubmitPayment = async (e) => {
		e.preventDefault();
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
							`נסיעה הלוך מ: ${props?.userRoute?.outbound?.startPoint?.address} \nל: ${props?.userRoute?.outbound?.endPoint?.address} \nבתאריך: ${formatDateToString(props?.userRoute?.outbound?.startPoint?.date, 'date')} \nעם ${props?.userRoute?.outbound?.stops} עצירות בדרך
				 ונסיעה בחזור מ: ${props?.userRoute?.inbound?.startPoint?.address} \nל: ${props?.userRoute?.inbound?.endPoint?.address} \nבתאריך: ${formatDateToString(props?.userRoute?.inbound?.startPoint?.date, 'date')} ובשעה : ${formatDateToString(props?.userRoute?.inbound?.startPoint?.time, 'time')} \nעם ${props?.userRoute?.inbound?.stops} עצירות בדרך.`
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
		console.log('sendPaymentRes');
		console.log(sendPaymentRes);
	};


	const validateCardNumber = (cardNumber) => {
		let isValid;
		// Remove all spaces and non-numeric characters
		const sanitizedCardNumber = String(cardNumber).replace(/\D+/g, '');

		if (sanitizedCardNumber.length !== 16) {
			isValid = false;
		}

		let sum = 0;

		// Loop through the sanitized card number digits starting from the rightmost digit
		for (let i = sanitizedCardNumber.length - 1, toggle = true; i >= 0; i--) {
			let digit = parseInt(sanitizedCardNumber[i], 10);
			let weight = toggle ? 1 : 2; // Weight alternates between 1 and 2, starting from the rightmost digit

			// Multiply the digit by its weight
			let product = digit * weight;
			// If the product is two-digit, sum its digits
			if (product > 9) {
				product = Math.floor(product / 10) + (product % 10);
			}
			// Add the product to the sum
			sum += product;
			// Toggle the weight for the next iteration
			toggle = !toggle;
		}
		// Check if the sum is divisible by 10
		isValid = sum % 10 === 0;

		setisValidCC(isValid);
		return isValid;
	};


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
						sendDataToApp={props.sendDataToApp}
						handlePopup={props.handlePopup}
					/>
				</div>
				<div className={`${styles.checkoutBar}`} style={{ top: `${props?.headerHeight + 20}px` }}>
					<h2 className={styles.mainTitle}>פרטי תשלום</h2>
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
								תשלום מקדמה של <b className={styles.toPayNow}>₪{advancePayment?.downPayment?.toFixed(0)}</b> וסכום של <b className={styles.toPayLater}>₪{advancePayment?.paymentLeft?.toFixed(0)}</b> מול הנהג
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
					<section className={styles.section}>
						<h4 className={styles.importantMessage}>
							הודעה חשובה!
							<br />
							לאחר הזנת פרטי התשלום לא נחייב אותך עד לאישור הנסיעה בשיחת טלפון.
							<br />
							אך כן תיתפס מסגרת של {selectedPaymentOption == "downPayment" ? `${advancePayment?.downPayment?.toFixed(0)}₪` : `${fullPayment?.fullPayment?.toFixed(0)}₪`} עד אישור או אי אישור הנסיעה מצידנו.
						</h4>
					</section>
					<section className={`${styles.section} ${styles.ccDetailsWrapper}`}>
						<CreditCardPrev cardDetails={cardDetails} />
						<form onSubmit={(e) => handleSubmitPayment(e)} className={styles.ccDetailsForm}>
							<div className={`${styles.ccNameAndIdWrapper} ${styles.wrapper}`}>
								<input
									required
									onChange={(e) => { handleCardDetails(e) }}
									type="text"
									name="fullNameOnCard"
									id="fullNameOnCard"
									placeholder="שם מלא על הכרטיס" 
									defaultValue={`${props?.userRoute?.firstname} ${props?.userRoute?.lastname}`}
								/>
								<input
									required
									onChange={(e) => { handleCardDetails(e); handleSelectListOpenAndFocuses(e) }}
									type="text"
									name="citizenId"
									id="citizenId"
									placeholder="תעודת זהות"
									maxLength={9} // Limit to 16 characters
								/>
							</div>
							<div className={`${styles.ccNumberWrapper} ${styles.wrapper}`}>
								<input
									required
									onChange={(e) => { handleCardDetails(e); handleSelectListOpenAndFocuses(e) }}
									type="text"
									name="cardNumber"
									id="cardNumber"
									placeholder="מספר כרטיס"
									ref={cardNumberRef}
									style={
										isValidCC === true
											? { borderColor: "green" }
											: isValidCC === false
												? { borderColor: "red" }
												: null
									}
									onBlur={(e) => validateCardNumber(cardDetails?.ccNumber)}
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
									ref={yearSelectRef}
									onChange={(e) => { handleCardDetails(e); handleSelectListOpenAndFocuses(e) }}
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
									ref={monthSelectRef}
									onChange={(e) => { handleCardDetails(e); handleSelectListOpenAndFocuses(e) }}
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
									onChange={(e) => handleCardDetails(e)}
									className={styles.number}
									type="text"
									name="CVV"
									id="CVV"
									ref={cvvInputRef}
									required
									placeholder="CVV"
									maxLength={3} // Set maximum length to 3 characters
									onInput={(e) => {
										e.target.value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
									}}
									onFocus={() => setCardDetails((prev) => ({ ...prev, cardSide: 'back' }))}
									onBlur={(e) => {
										setCardDetails((prev) => ({ ...prev, cardSide: 'front' }));
										if (e.target.value.length < 3) {
											e.target.value = '';
										}
									}}
								/>
							</div>
							<h4 className={styles.dealPriceSelected}>הסכום לתשלום : {selectedPaymentOption === "downPayment" ? `₪${parseFloat(advancePayment?.downPayment.toFixed(0))}` : `₪${parseFloat(fullPayment?.fullPayment.toFixed(0))}`}</h4>
							<button className={`${styles.submitButton} ${styles.disabled}`} ref={submitButtonRef}>פתיחת הזמנה</button>
						</form>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Checkout;