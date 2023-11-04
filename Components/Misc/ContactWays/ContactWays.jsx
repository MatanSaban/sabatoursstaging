import React, { useEffect, useState } from "react";
import styles from "./contactWays.module.scss";
import SingleWay from "./SingleWay";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { isMobile } from "react-device-detect";
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/effect-coverflow';
import { contactWaysJson } from "../../../utils/functions";



const ContactWays = () => {
    

    const [viewRender, setViewRender] = useState();

    useEffect(() => {
        if (isMobile) {
            setViewRender("mobile");
        } else {
            setViewRender("desktop");
        }
    }, []);

    useEffect(() => {
        const elements = document.querySelectorAll('.swiper-slide-shadow-coverflow');
        elements.forEach(element => {
            element.style.borderRadius = '20px';
        }); 
    }, []);

    return (
        <div className={styles.contactWays}>
            {viewRender === "desktop"
                ? contactWaysJson?.map((way, wayIndex) => {
                    return (
                        <SingleWay
                            key={wayIndex}
                            type={way.type}
                            title={way.title}
                            value={way.value}
                            linkText={way.linkText}
                            linkPath={way.linkPath}
                            target={way.target}
                        />
                    );
                })
                :

                <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 200,
                  modifier: 1,
                  slideShadows: true,
                }}
                initialSlide={1}
                loop={true} 
                pagination={true}
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
                                    />
                                </SwiperSlide>
                            )
                    })}
                </Swiper>
            }
        </div>
    );
};

export default ContactWays;
