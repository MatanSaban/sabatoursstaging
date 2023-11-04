import Link from 'next/link';
import React, { useEffect } from 'react';
import { AiOutlinePhone } from 'react-icons/ai';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import SingleWay from '../Misc/ContactWays/SingleWay'
import { Swiper, SwiperSlide } from "swiper/react";
import { contactWaysJson, isMobile } from '../../utils/functions'; 

const ActionButton = ({ styles, handlePopup, windowWidth }) => {

  

  const popupContent = <Swiper
    effect={'coverflow'}
    grabCursor={true}
    centeredSlides={true}
    slidesPerView={'auto'}
    coverflowEffect={{
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
      
    }}
    loop={true}
    // pagination={true}
    modules={[EffectCoverflow, Pagination]}
    className={styles.mySwiper}
  >
    {contactWaysJson?.map((way, wayIndex) => {
      return (
        <SwiperSlide key={wayIndex} className={styles.slide}>
          <SingleWay
            type={way.type}
            title={way.title}
            value={way.value}
            linkText={way.linkText}
            linkPath={way.linkPath}
            target={way.target}
          />
        </SwiperSlide>
      )
    })}
  </Swiper>;
  const popupStyles = {
    borderRadius: "30px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40vh"
  }
  const handleClick = () => {
    if (!isMobile(windowWidth)) {
      handlePopup(true, popupContent, popupStyles)
    }
  };

  const whatToRender = () => {
    if (isMobile(windowWidth)) {
      return (
        <Link className={styles.textAndIconWrapper} href="tel:0527984133">
            <AiOutlinePhone />
            <span>הזמנת נסיעה</span>
          </Link>
      )
    } else {
      return (
        <div className={styles.textAndIconWrapper}>
            <AiOutlinePhone />
            <span>יצירת קשר</span>
          </div>
      )
    }
  } 

  useEffect(() => {
    const elements = document.querySelectorAll('.swiper-slide-shadow-coverflow');
    elements.forEach(element => {
        element.style.borderRadius = '20px';
    }); 
}, []);

  return (
    <div className={styles.ActionButtonWrapper}>
      <button
        className={`${styles.actionButton} ${styles.pinkButton}`}
        onClick={() => handleClick()}
      >
        {whatToRender()}
      </button>
    </div>
  );
};

export default ActionButton;
