import React from "react";
import Image from "next/image";
import { FaRoute } from "react-icons/fa";
import styles from "./homeComp.module.scss";
import { isMobile } from "react-device-detect";
import Logo from "../../public/media/SabanToursLogo.svg";

const HeroSection = (props) => {
  return (
    <section className={`${styles.section} ${styles.hero}`}>
      <Image
        src={
          props?.homepageData?.acf?.section_hero[
            isMobile ? "hero_image_mobile" : "hero_image_desktop"
          ]
        }
        alt="hero image"
        style={{ zIndex: -1 }}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
      <Image
        className={styles.logo}
        src={Logo}
        height={350}
        width={350}
        alt="לוגו של סבן טורס"
        priority={true}
      />
      <h1
        dangerouslySetInnerHTML={{
          __html: props?.homepageData?.acf?.section_hero?.h1_title,
        }}
      />
      <button
        onClick={() => scrollToEl(priceFormRef)}
        className={`${styles.actionButton} ${styles.pinkButton}`}
      >
        <span>{props?.homepageData?.acf?.section_hero?.CTA_button}</span>
        <FaRoute />
      </button>
    </section>
  );
};

export default HeroSection;
