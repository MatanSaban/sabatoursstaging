import React, { useEffect, useState } from "react";
import styles from "./contactWays.module.scss";
import SingleWay from "./SingleWay";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { isMobile } from "react-device-detect";
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/effect-coverflow';



const ContactWays = () => {
    const contactWaysJson = [
        {
            desktopNumber: 1,
            mobileNumber: 1,
            type: "phone",
            title: "טלפון",
            value: "קבלו הצעת מחיר טלפונית במספר הטלפון שלנו : 052-798-4133",
            linkText: "התקשר עכשיו",
            linkPath: "tel:+97252798433",
            target: false,
        },
        {
            desktopNumber: 2,
            mobileNumber: 2,
            type: "whatsapp",
            title: "whatsapp",
            value: "דברו איתנו בוואטסאפ וקבלו הצעת מחיר מיידית",
            linkText: "שליחת הודעה",
            linkPath: "https://wa.me/+97252798433",
            target: "_blank",
        },
        {
            desktopNumber: 3,
            mobileNumber: 3,
            type: "onlineForm",
            title: "הצעת מחיר אונליין",
            value: "מלאו פרטי נסיעה בטופס וקבלו הצעת מחיר מיידית אונליין",
            linkText: "הצעת מחיר אונליין",
            linkPath: "/online-offer",
            target: false,
        },
        {
            desktopNumber: 4,
            mobileNumber: 4,
            type: "contactForm",
            title: "טופס השארת פרטים",
            value: "השאירו פרטים בטופס אונליין ונחזור אליכם בהקדם",
            linkText: "מילוי הטופס",
            linkPath: "/contact",
            target: false,
        },
        {
            desktopNumber: 5,
            mobileNumber: 5,
            type: "email",
            title: "אימייל",
            value: "שלחו לנו מייל ונתקדם משם office@sabantours.co.il",
            linkText: "שליחת מייל",
            linkPath: "mailto:office@sabantours.co.il",
            target: false,
        },
    ];

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
