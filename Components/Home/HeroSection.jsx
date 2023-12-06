import React from "react";
import Image from "next/image";
import { FaRoute } from "react-icons/fa";
import styles from "./homeComp.module.scss";
import { isMobile } from "react-device-detect";
import Logo from "../../public/media/SabanToursLogo.svg";

const HeroSection = (props) => {
  const scrollToEl = (ref) => {
    const element = ref.current;
    const topNumber = isMobile ? 150 : 250;
    console.log(element);
    if (element) {
      console.log("there is element");
      const rect = element.getBoundingClientRect();
      const absoluteTop = window.pageYOffset + rect.top;
      window.scrollTo({
        top: absoluteTop - topNumber,
        behavior: "smooth",
      });
    }
  };
  return (
    <section className={`${styles.section} ${styles.hero}`}>
      <Image
        alt="hero image"
        src={
          props?.homepageData?.acf?.section_hero[
            isMobile ? "hero_image_mobile" : "hero_image_desktop"
          ]
        }
        style={{ zIndex: -1, objectFit: "cover", layout: "blur" }}
        fill
        sizes="100vw"
        loading="lazy"
        quality={100}
        blurDataURL={props?.bgImage}
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
        onClick={() => scrollToEl(props.priceFormRef)}
        className={`${styles.actionButton} ${styles.pinkButton}`}
      >
        <span>{props?.homepageData?.acf?.section_hero?.CTA_button}</span>
        <FaRoute />
      </button>
    </section>
  );
};

export default HeroSection;
