import React from "react";
import { returnTitle } from "../../../utils/functions";
import styles from "./contactUs.module.scss";
import ContactWays from "../ContactWays/ContactWays";
import { isMobile } from "react-device-detect";

const ContactUsComp = ({ title, spType }) => {
	return (
		<div className={styles.contactUsAboutWrapper}>
			<div className={styles.contactUsAbout}>
				<h3>רוצה לתאם איתנו {returnTitle(false, title, spType)}?</h3>
				<h4>נשמח לתת שירות!</h4>
				<p>
					כדי לתת שירות נוח ומהיר עבור כל סוגי הלקוחות, ישנם מספר אופציות עבורך
					לקבל הצעת מחיר.
				</p>
				<ContactWays />
			</div>
		</div>
	);
};

export default ContactUsComp;
