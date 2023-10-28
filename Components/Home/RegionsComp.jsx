import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import styles from "./regionsComp.module.scss";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { isMobile } from "react-device-detect";

const RegionsComp = ({ regions, cities, ...props }) => {
    console.log("regions");
    console.log(regions);

    // const renderDesktopView = () => {
    //     return (
            
    //     );
    // };
    // const renderMobileView = () => {
    //     return (
            
    //     );
    // };

    const [viewRender, setViewRender] = useState();

    useEffect(() => {
        if (isMobile) {
            setViewRender('mobile');

        } else {
            setViewRender('desktop');
        }
    }, [])

    return (
        <>
            {viewRender === "desktop" ? (
                <div className={styles.regions}>
                {regions?.map((region) => (
                    <div
                        className={styles.region}
                        key={region.id}
                        style={{
                            backgroundImage: `url(${region?.acf?.bg_image_desktop})`,
                        }}
                    >
                        <div className={styles.cover}></div>
                        <h2 className={styles.regionName}>{region.name}</h2> 
                        <ul>
                            {cities
                                ?.filter((city) => city.region.includes(region.id))
                                .map((city) => (
                                    <li className={styles.listItem} key={city.id}>
                                        <Link className={styles.link} href={`/areas/${city.slug}`}> 
                                            <IoLocationOutline />
                                            <span className={styles.cityName}>
                                                {city.title.rendered}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>
            ) 
            :
             (
                <div className={styles.regions}>
                <Swiper
                    slidesPerView={2}
                    spaceBetween={10}
                    centeredSlides={true}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination]}
                    loop={true}
                    className={styles.mySwiper}
                >
                    {regions?.map((region) => (
                        <SwiperSlide key={region.id} className={styles.slide}>
                            <div
                                className={styles.region}
                                style={{
                                    backgroundImage: `url(${region?.acf?.bg_image_mobile})`,
                                }}
                            >
                                <div className={styles.cover}></div>
                                <h2 className={styles.regionName}>{region.name}</h2>
                                <ul>
                                    {cities
                                        ?.filter((city) => city.region.includes(region.id))
                                        .map((city) => (
                                            <li className={styles.listItem} key={city.id}>
                                                <Link
                                                    className={styles.link}
                                                    href={`/areas/${city.slug}`}
                                                >
                                                    <IoLocationOutline />
                                                    <span className={styles.cityName}>
                                                        {city.title.rendered}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
             )
            }
        </>
    );
};

export default RegionsComp;
