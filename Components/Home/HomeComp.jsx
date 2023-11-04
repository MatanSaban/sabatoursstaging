import React, { useEffect, useMemo, useRef, useState } from "react";
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
import RegionsComp from "./RegionsComp";
import LogoLoader from "../Misc/Loading";
import { LoadScript } from "@react-google-maps/api";
import { isMobile } from "react-device-detect";
import ContactWays from "../Misc/ContactWays/ContactWays";


const libraries = ["places"]; // define the libraries needed

const HomeComp = (props) => {

  const [pageData, setPageData] = useState();

  useEffect(() => {
    if (props?.homepageData) {
      setPageData(props?.homepageData);
    }
  }, [props])

  const servicesToDisplay = React.useMemo(() => {
    if (props?.windowWidth >= 768) {
      return props?.services?.slice(
        0,
        Math.floor(props?.services?.length / 3) * 3
      );
    } else {
      return props?.services?.slice(
        0,
        Math.floor(props?.services?.length / 2) * 2
      );
    }
  }, [props?.services, props?.windowWidth]);

  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [loaderShow, setLoaderShow] = useState(true);

  const priceFormRef = useRef();

  const scrollToEl = (ref) => {
    const element = ref.current;
    const topNumber = isMobile ? 150 : 250 
    console.log(element);
    if (element) {
      console.log("there is element");
      const rect = element.getBoundingClientRect();
      const absoluteTop = window.pageYOffset + rect.top;
      window.scrollTo({
        top: absoluteTop - topNumber,
        behavior: 'smooth'
      });
    }
  };


  return (
    <LoadScript
      googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={<LogoLoader percentage={loadingPercentage} showPercentage={false} show={false} />}
    >

      <div className={styles.homeWrapper}>

        <section className={`${styles.section} ${styles.hero}`} style={{ backgroundImage: `url(${props?.homepageData?.acf?.section_hero[isMobile ? "hero_image_mobile" : "hero_image_desktop"]})` }}>
          <Image
            className={styles.logo}
            src={Logo}
            height={350}
            width={350}
            alt="לוגו של סבן טורס"
            priority={true}
          />
          <h1 dangerouslySetInnerHTML={{ __html: props?.homepageData?.acf?.section_hero?.h1_title }} />
          <button onClick={() => scrollToEl(priceFormRef)} className={`${styles.actionButton} ${styles.pinkButton}`}>
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
            priceFormRef={priceFormRef}
          />
        </section>
        {/* style={{ backgroundImage: `url(${props?.homepageData?.acf?.section_service_areas?.desktop_bg_image})` }} */}
        {props?.regions && <section className={`${styles.whereAreWe} ${styles.section}`} style={{ backgroundImage: `url(${props?.homepageData?.acf?.section_service_areas[isMobile ? "mobile_bg_image" : "desktop_bg_image"]})` }} >
          <div className={styles.sectionWhiteGradient}>

          </div>
          <h2 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: props?.homepageData?.acf?.section_service_areas?.title }} />

          <RegionsComp windowWidth={props?.windowWidth} regions={props?.regions} cities={props?.cities} />
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
            <span className={styles.markedText}>אפשרויות ליצירת קשר</span>
          </h2>
          <ContactWays/>

        </section>
      </div>
    </LoadScript>
  );
};

export default HomeComp;
