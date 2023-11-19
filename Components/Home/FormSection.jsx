import React, { useRef } from "react";
import Image from "next/image";
import styles from "./homeComp.module.scss";
import blue_green from "../../public/media/icon_blue_green.svg";
import pink_blue from "../../public/media/icon_pink_blue.svg";
import green_pink from "../../public/media/icon_green_pink.svg";
import PriceForm from "../Form/PriceForm";

const FormSection = (props) => {
  const priceFormRef = useRef();
  return (
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
          __html: props?.homepageData?.acf?.section_nicetomeet?.title,
        }}
      />
      <h5>{props?.homepageData?.acf?.section_nicetomeet?.sub_title}</h5>
      <p
        className={styles.centeredText}
        dangerouslySetInnerHTML={{
          __html: props?.homepageData?.acf?.section_nicetomeet?.text,
        }}
      />
      <h3>{props?.homepageData?.acf?.section_nicetomeet?.form_start_title}</h3>

      <PriceForm
        handlePopup={props.handlePopup}
        sendDataToApp={props?.sendDataToApp}
        userRoute={props?.userRoute}
        windowWidth={props?.windowWidth}
        priceFormRef={priceFormRef}
      />
    </section>
  );
};

export default FormSection;
