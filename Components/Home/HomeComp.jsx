import React, { useEffect, useState } from "react";
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
import { decodeHTMLEntities } from "../../utils/functions";

const HomeComp = (props) => {

  const [pageData, setPageData] = useState();

  useEffect(() => {
    if (props?.homepageData) {
      console.log(props.homepageData);
      setPageData(props?.homepageData);
    }
  }, [props])

  let servicesToDisplay = props?.services;

  if (props?.windowWidth >= 768) {
    // Assuming 768px as the breakpoint for desktop
    servicesToDisplay = servicesToDisplay?.slice(
      0,
      Math.floor(servicesToDisplay?.length / 3) * 3
    );
  } else {
    servicesToDisplay = servicesToDisplay?.slice(
      0,
      Math.floor(servicesToDisplay?.length / 2) * 2
    );
  }


  return (
    <div className={styles.homeWrapper}>
      
      <section className={`${styles.section} ${styles.hero}`} style={{ backgroundImage: `url(${props?.homepageData?.acf?.section_hero?.hero_image_desktop})` }}>
        <Image
          className={styles.logo}
          src={Logo}
          height={350}
          width={350}
          alt="לוגו של סבן טורס"
        />
        <h1 dangerouslySetInnerHTML={{ __html: props?.homepageData?.acf?.section_hero?.h1_title }} />
        <button className={`${styles.actionButton} ${styles.pinkButton}`}>
          <span>{props?.homepageData?.acf?.section_hero?.CTA_button}</span>
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
        <h2 dangerouslySetInnerHTML={{ __html: props?.homepageData?.acf?.section_nicetomeet?.title }} />
        <h5>{props?.homepageData?.acf?.section_nicetomeet?.sub_title}</h5>
        <p className={styles.centeredText} dangerouslySetInnerHTML={{ __html: props?.homepageData?.acf?.section_nicetomeet?.text }} />
        <h3>{props?.homepageData?.acf?.section_nicetomeet?.form_start_title}</h3>
        <PriceForm
          handlePopup={props.handlePopup}
          sendDataToApp={props?.sendDataToApp}
          userRoute={props?.userRoute}
          windowWidth={props?.windowWidth}
        />
      </section>
      {props?.regions && <section className={`${styles.whereAreWe} ${styles.section}`} style={{ backgroundImage: `url(${props?.homepageData?.acf?.section_service_areas?.desktop_bg_image})` }}>
        <div className={styles.sectionWhiteGradient}>

        </div>
        <h2 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: props?.homepageData?.acf?.section_service_areas?.title }} />

        <div className={styles.areas}>
          {
            props?.regions?.map((area) => {
              if (area.cities.length) {
                return (

                  <div key={area.id} className={styles.area}>
                    <h3 className={styles.areaTitle}>
                      {area.name}
                    </h3>
                    <div className={styles.cities}>
                      {area?.cities?.map((city) => {
                        return (
                          <button className={styles.cityButton} key={city.id}>
                            <Link className={styles.cityLink} href={city.link}>
                              <span>
                                הסעה ל{city.title.rendered}
                              </span>
                            </Link>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              }
            })
          }
        </div>
      </section>}
      {servicesToDisplay?.length &&
        <section className={`${styles.whereWeGo} ${styles.section}`}>
          <h2 className={styles.sectionTitle}>
            לאן אפשר לנסוע עם חברת ההסעות סבן טורס?
          </h2>
          <div className={styles.services}>
            {servicesToDisplay?.map((service) => (
              <Link href={`/drive-types/${service.slug}`} className={styles.service} key={service.id}>
                {service?.mainImage && <Image src={service?.mainImage} width={300} height={200} alt="service image" />}
                <button className={styles.serviceButton}>
                  {/* <i className={styles.serviceIcon}><Image src={`/${service.iconName}`}/>service icon here</i> */}
                  <span className={styles.serviceName}>
                    {decodeHTMLEntities(service.title.rendered)}
                  </span>
                </button>
              </Link>
            ))}
          </div>
        </section>
      }

      {/* <section className={`${styles.gallery} ${styles.section}`}></section> */}
      {/* this will be filled later when i'll create some photos of vehicles Saban Tours can give to customers. */}
      <section className={`${styles.contact} ${styles.section}`}>
        <h2 className={styles.sectionTitle}>
          צריכים עזרה בבחירת רכב?
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

      </section>
    </div>
  );
};

export default HomeComp;
