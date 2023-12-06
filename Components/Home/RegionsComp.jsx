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
import Image from "next/image";

const RegionsComp = ({ regions, cities, ...props }) => {
  const [viewRender, setViewRender] = useState();

  useEffect(() => {
    if (isMobile) {
      setViewRender("mobile");
    } else {
      setViewRender("desktop");
    }
  }, []);

  return (
    <>
      {viewRender === "desktop" ? (
        <div className={styles.regions}>
          {regions?.map((region) => (
            <div
              className={styles.region}
              key={region.id}
              // style={{
              //   backgroundImage: `url(${region?.acf?.bg_image_desktop})`,
              // }}
            >
              <Image
                src={region?.acf?.bg_image_desktop}
                alt="hero image"
                style={{ zIndex: -1 }}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
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
          ))}
        </div>
      ) : (
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
                <div className={styles.region}>
                  <Image
                    src={region?.acf?.bg_image_mobile}
                    alt="hero image"
                    style={{
                      zIndex: -1,
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    fill
                  />
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
      )}
    </>
  );
};

export default RegionsComp;
