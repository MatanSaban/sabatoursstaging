import React, { useEffect, useRef, useState } from "react";
import styles from "./homeComp.module.scss";
// import { FaRoute } from "react-icons/fa";
// import Logo from "../../public/media/SabanToursLogo.svg";
// import Image from "next/image";
// import Link from "next/link";

// import { BsTelephone } from "react-icons/bs";
// import { BsWhatsapp } from "react-icons/bs";
// import { BsEnvelopeAt } from "react-icons/bs";
// import { decodeHTMLEntities } from "../../utils/functions";
// import RegionsComp from "./RegionsComp";
import LogoLoader from "../Misc/Loading";
import { LoadScript } from "@react-google-maps/api";
// import { isMobile } from "react-device-detect";
import ContactWays from "../Misc/ContactWays/ContactWays";
// import { HeroSection } from "./HeroSection";
// import { FormSection } from "./FormSection";
// import { AreaSection } from "./AreaSection";
// import { DriveTypesSection } from "./DriveTypesSection";
import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("./HeroSection"));
const FormSection = dynamic(() => import("./FormSection"));
const AreaSection = dynamic(() => import("./AreaSection"));
const DriveTypesSection = dynamic(() => import("./DriveTypesSection"));

const libraries = ["places"]; // define the libraries needed

const HomeComp = (props) => {
  // const [pageData, setPageData] = useState();
  const priceFormRef = useRef();

  // useEffect(() => {
  //   if (props?.homepageData) {
  //     setPageData(props?.homepageData);
  //   }
  // }, [props]);

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
  // const [loaderShow, setLoaderShow] = useState(true);

  // const scrollToEl = (ref) => {
  //   const element = ref.current;
  //   const topNumber = isMobile ? 150 : 250;
  //   console.log(element);
  //   if (element) {
  //     console.log("there is element");
  //     const rect = element.getBoundingClientRect();
  //     const absoluteTop = window.pageYOffset + rect.top;
  //     window.scrollTo({
  //       top: absoluteTop - topNumber,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  return (
    <div className={styles.homeWrapper}>
      <HeroSection
        homepageData={props?.homepageData}
        priceFormRef={priceFormRef}
      />
      <FormSection
        handlePopup={props.handlePopup}
        sendDataToApp={props?.sendDataToApp}
        userRoute={props?.userRoute}
        windowWidth={props?.windowWidth}
        homepageData={props?.homepageData}
        priceFormRef={priceFormRef}
      />
      {/* style={{ backgroundImage: `url(${props?.homepageData?.acf?.section_service_areas?.desktop_bg_image})` }} */}
      {props?.regions && (
        <AreaSection
          homepageData={props?.homepageData}
          windowWidth={props?.windowWidth}
          regions={props?.regions}
          cities={props?.cities}
        />
      )}
      {servicesToDisplay?.length && (
        <DriveTypesSection servicesToDisplay={servicesToDisplay} />
      )}

      {/* <section className={`${styles.gallery} ${styles.section}`}></section> */}
      {/* this will be filled later when i'll create some photos of vehicles Saban Tours can give to customers. */}
      <section className={`${styles.contact} ${styles.section}`}>
        <h2 className={styles.sectionTitle}>
          צריכים עזרה בבחירת רכב?
          <br />
          <span className={styles.markedText}>אפשרויות ליצירת קשר</span>
        </h2>
        <ContactWays />
      </section>
    </div>
  );
};

export default HomeComp;
