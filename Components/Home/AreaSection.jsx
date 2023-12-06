import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./homeComp.module.scss";
import { isMobile } from "react-device-detect";
import RegionsComp from "./RegionsComp";
import { getFetchRegions, getFetchedCities } from "../../utils/home";

const AreaSection = (props) => {
  const [regions, getRegions] = useState([]);
  const [cities, getCities] = useState([]);
  useEffect(() => {
    const fetchedRegions = getFetchRegions();
    getRegions(fetchedRegions);
    // Fetch cities
    const fetchedCities = getFetchedCities();
    getCities(fetchedCities);
  }, []);
  // Fetch regions

  return (
    <section className={`${styles.whereAreWe} ${styles.section}`}>
      <Image
        src={
          props?.homepageData?.acf?.section_service_areas[
            isMobile ? "mobile_bg_image" : "desktop_bg_image"
          ]
        }
        alt="background image"
        style={{ zIndex: -1, objectFit: "cover", objectPosition: "center" }}
        fill
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
        regions={regions}
        cities={cities}
      />
    </section>
  );
};

export default AreaSection;
