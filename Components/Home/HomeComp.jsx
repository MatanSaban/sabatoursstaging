import React from "react";
import styles from "./homeComp.module.scss";
import { FaRoute } from "react-icons/fa";
import Logo from "../../public/media/SabanToursLogo.svg";
import Image from "next/image";
import Link from "next/link";
import blue_green from "../../public/media/icon_blue_green.svg";
import pink_blue from "../../public/media/icon_pink_blue.svg";
import green_pink from "../../public/media/icon_green_pink.svg";
import PriceForm from "../Form/PriceForm";

const HomeComp = (props) => {
  return (
    <div className={styles.homeWrapper}>
      <section className={`${styles.section} ${styles.hero}`}>
        <Image
          className={styles.logo}
          src={Logo}
          height={350}
          width={350}
          alt="לוגו של סבן טורס"
        />
        <h1>
          שירות הסעות מקצועי
          <br />
          בפריסה ארצית
        </h1>
        <button className={`${styles.actionButton} ${styles.pinkButton}`}>
          <span>תכנון נסיעה</span>
          <FaRoute />
        </button>
      </section>
      <section className={`${styles.niceToMeet} ${styles.section}`}>
        <Image
          className={`${styles.transparentIcon} ${styles.blue_green}`}
          src={blue_green}
          height={450}
          width={300}
          alt={"saban tours logo in brand colors - blue and green"}
        />
        <Image
          className={`${styles.transparentIcon} ${styles.pink_blue}`}
          src={pink_blue}
          height={420}
          width={250}
          alt={"saban tours logo in brand colors - pink and blue"}
        />
        <Image
          className={`${styles.transparentIcon} ${styles.green_pink}`}
          src={green_pink}
          height={255}
          width={150}
          alt={"saban tours logo in brand colors - green and pink"}
        />
        <h2>נעים מאוד, אנחנו סבן טורס.</h2>
        <h5>הגעתם אלינו, אתם כבר בדרך הנכונה!</h5>
        <p className={styles.centeredText}>
          אנחנו נספק לכם שירות הסעות מקצועי, מהיר ובמחירים ללא תחרות בכל רחבי
          הארץ. בכל שעה וכל יום (למעט יום כיפור).
          <br />
          על מנת לספק את השירות ברמה הגבוהה ביותר, אספנו את נהגי ההסעות המצועיים
          והותיקים היותר בתחום עבורכם!
        </p>
        <h3>אז... לאן נוסעים?</h3>
        <PriceForm
          handlePopup={props.handlePopup}
          sendDataToApp={props?.sendDataToApp}
          userRoute={props?.userRoute}
        />
      </section>
      <section className={`${styles.whereAreWe} ${styles.section}`}></section>
      <section className={`${styles.whereWeGo} ${styles.section}`}></section>
      <section className={`${styles.gallery} ${styles.section}`}></section>
      <section className={`${styles.contact} ${styles.section}`}></section>
    </div>
  );
};

export default HomeComp;
