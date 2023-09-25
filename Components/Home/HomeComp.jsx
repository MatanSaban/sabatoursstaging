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
import { BsTelephone } from 'react-icons/bs'
import { BsWhatsapp } from 'react-icons/bs'
import { BsEnvelopeAt } from 'react-icons/bs'

const HomeComp = (props) => {

  const locations = [
    {
      title: "המרכז",
      cities: [
        {
          cityName: "בני ברק",
          link: "/bneibrak"
        },
        {
          cityName: "חולון",
          link: "/holon"
        },
        {
          cityName: "בת ים",
          link: "/batyam"
        },
        {
          cityName: "רמת גן",
          link: "/ramatgan"
        },
        {
          cityName: "ראשון לציון",
          link: "/rishonlezion"
        },
      ]
    },
    {
      title: "הדרום",
      cities: [
        {
          cityName: "אילת",
          link: "/eilat"
        },
        {
          cityName: "באר שבע",
          link: "/beersheva"
        },
        {
          cityName: "ערד",
          link: "/arad"
        },
        {
          cityName: "דימונה",
          link: "/dimona"
        },
        {
          cityName: "ים המלח",
          link: "/yamhamelach"
        },
      ]
    },
    {
      title: "הצפון",
      cities: [
        {
          cityName: "הר חרמון",
          link: "/hermon"
        },
        {
          cityName: "נהריה",
          link: "/nahariya"
        },
        {
          cityName: "עכו",
          link: "/acco"
        },
        {
          cityName: "חיפה",
          link: "/haifa"
        },
        {
          cityName: "חדרה",
          link: "/hadera"
        },
      ]
    },
    {
      title: "ירושלים והסביבה",
      cities: [
        {
          cityName: "ירושלים",
          link: "/jerusalem"
        },
        {
          cityName: "מודיעין",
          link: "/modi'in"
        },
        {
          cityName: "הר זבבזיב",
          link: "/zabzib"
        },
        {
          cityName: "מעלה אדומים",
          link: "/maaleadumim"
        },
        {
          cityName: "בנימין",
          link: "/binyamin"
        },
      ]
    },
  ]

  const services = [
    {
      name: "הסעות חתונה",
      link: "/services/weddingTransfer",
      imageName: "weddingTransferImage"
    },
    {
      name: "הסעות עובדים",
      link: "/services/workersTransfer",
      imageName: "workersTransferImage"
    },
    {
      name: "הסעות לנתב''ג",
      link: "/services/airportTransfer",
      imageName: "airportTransferImage"
    },
    {
      name: "הסעות חתונה",
      link: "/services/weddingTransfer",
      imageName: "weddingTransferImage"
    },
    {
      name: "הסעות עובדים",
      link: "/services/workersTransfer",
      imageName: "workersTransferImage"
    },
    {
      name: "הסעות לנתב''ג",
      link: "/services/airportTransfer",
      imageName: "airportTransferImage"
    },
  ]

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
      <section className={`${styles.whereAreWe} ${styles.section}`}>
        <div className={styles.sectionWhiteGradient}>

        </div>
        <h2 className={styles.sectionTitle}>
          איפה אנחנו נותנים שירות?
          <br />
          בכל הארץ!
        </h2>
        <div className={styles.areas}>
          {
            locations && locations.map((area, areaIndex) => {
              return (

                <div key={areaIndex} className={styles.area}>
                  <h3 className={styles.areaTitle}>
                    {area.title}
                  </h3>
                  <div className={styles.cities}>
                    {area?.cities?.map((city, cityIndex) => {
                      return (
                        <button className={styles.cityButton} key={cityIndex}>
                          <Link className={styles.cityLink} href={city.link}>
                            <span>
                              הסעה ל{city.cityName}
                            </span>
                          </Link>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })
          }
        </div>
      </section>
      <section className={`${styles.whereWeGo} ${styles.section}`}>
        <h2 className={styles.sectionTitle}>
          לאן אפשר לנסוע עם חברת ההסעות סבן טורס?
        </h2>
        <div className={styles.services}>
          {services?.map((service, serviceIndex) => {
            return (
              <Link href={service.link} className={styles.service} key={serviceIndex}>
                {/* <Image src={`/${service.imageName}`}/> */}
                service image here
                <button className={styles.serviceButton}>
                  <i className={styles.serviceIcon}>
                    {/* <Image src={`/${service.iconName}`}/> */}
                    service icon here
                  </i>
                  <span className={styles.serviceName}>
                    {service.name}
                  </span>
                </button>
              </Link>
            )
          })}
        </div>
      </section>
      {/* <section className={`${styles.gallery} ${styles.section}`}></section> */}
      {/* this will be filled later when i'll create some photos of vehicles Saban Tours can give to customers. */}
      <section className={`${styles.contact} ${styles.section}`}>
        {/* should be a component */}
        <h2 className={styles.sectionTitle}>
          לא בטוחים איזו הסעה אתם צריכים, מה האפשרויות שלכם או כל דבר אחר?
          <br />
          <span className={styles.markedText}>דברו איתנו!</span>
        </h2>
        <div className={styles.contactWays}>
          <div className={styles.contactWay}>
            <div className={styles.textArea}>
              <h3 className={styles.contactWayTitle}>
                בטלפון
              </h3>
              <Link className={styles.contactWayLink} href={"tel:0527984133"} target="_blank">
                <h4 className={styles.contactWayActionButton}>0527984133</h4>
                <span className={styles.contactWayActionButton}>התקשר/י עכשיו</span>
              </Link>
            </div>
            <div className={`${styles.iconArea} ${styles.phone}`}>
              <BsTelephone />
            </div>
          </div>
          <div className={styles.contactWay}>
            <div className={styles.textArea}>
              <h3 className={styles.contactWayTitle}>
                בוואטסאפ
              </h3>
              <Link className={styles.contactWayLink} href={"https://wa.me/+972527984133"} target="_blank">
                <h4 className={styles.contactWayActionButton}>0527984133</h4>
                <span className={styles.contactWayActionButton}>שלח/י הודעה</span>
              </Link>
            </div>
            <div className={`${styles.iconArea} ${styles.whatsapp}`}>
              <BsWhatsapp />
            </div>
          </div>
          <div className={styles.contactWay}>
            <div className={styles.textArea}>
              <h3 className={styles.contactWayTitle}>
                בטופס
              </h3>
              <Link className={styles.contactWayLink} href={"tel:0527984133"} >
                <h4 className={styles.contactWayActionButton}>מילוי ושליחת טופס אונליין</h4>
                <span className={styles.contactWayActionButton}>השאר/י פנייה</span>
              </Link>
            </div>
            <div className={`${styles.iconArea} ${styles.form}`}>
              <BsEnvelopeAt />
            </div>
          </div>
        </div>

        {/* should be a component */}
      </section>
    </div>
  );
};

export default HomeComp;
