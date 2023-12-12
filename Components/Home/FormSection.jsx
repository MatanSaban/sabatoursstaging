import React, { useRef, useState } from "react";
import Image from "next/image";
import styles from "./homeComp.module.scss";
import blue_green from "../../public/media/icon_blue_green.svg";
import pink_blue from "../../public/media/icon_pink_blue.svg";
import green_pink from "../../public/media/icon_green_pink.svg";
import PriceForm from "../Form/PriceForm";
import { LoadScript } from "@react-google-maps/api";
import LogoLoader from "../Misc/Loading";

const FormSection = (props) => {
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const libraries = ["places"]; // define the libraries needed
  return (
    <LoadScript
      googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={
        <LogoLoader
          percentage={loadingPercentage}
          showPercentage={false}
          show={false}
        />
      }
    >
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
        <h2
          dangerouslySetInnerHTML={{
            __html: props?.homepageData?.section_nicetomeet?.title,
          }}
        />
        <h5>{props?.homepageData?.section_nicetomeet?.sub_title}</h5>
        <p
          className={styles.centeredText}
          dangerouslySetInnerHTML={{
            __html: props?.homepageData?.section_nicetomeet?.text,
          }}
        />
        <h3>{props?.homepageData?.section_nicetomeet?.form_start_title}</h3>

        <PriceForm
          handlePopup={props.handlePopup}
          sendDataToApp={props?.sendDataToApp}
          userRoute={props?.userRoute}
          windowWidth={props?.windowWidth}
          priceFormRef={props.priceFormRef}
        />
      </section>
    </LoadScript>
  );
};

export default FormSection;
