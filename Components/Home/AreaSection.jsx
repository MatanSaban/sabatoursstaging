import React from "react";
import Image from "next/image";
import styles from "./homeComp.module.scss";
import { isMobile } from "react-device-detect";
import RegionsComp from "./RegionsComp";

const AreaSection = (props) => {
  return (
    <section className={`${styles.whereAreWe} ${styles.section}`}>
      <Image
        src={
          props?.homepageData?.acf?.section_service_areas[
            isMobile ? "mobile_bg_image" : "desktop_bg_image"
          ]
        }
        alt="background image"
        style={{ zIndex: -1 }}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
      <div className={styles.sectionWhiteGradient}></div>
      <h2
        className={styles.sectionTitle}
        dangerouslySetInnerHTML={{
          __html: props?.homepageData?.acf?.section_service_areas?.title,
        }}
      />

      <RegionsComp
        windowWidth={props?.windowWidth}
        regions={props?.regions}
        cities={props?.cities}
      />
    </section>
  );
};

export default AreaSection;
