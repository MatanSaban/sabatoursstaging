import React, { useRef } from "react";
// import HomeComp from "../Components/Home/HomeComp.jsx";
import axios from "axios";
// import logo from "../public/media/faviconSquare.png";
import styles from "../Components/Home/homeComp.module.scss";
import { updateRegionImages } from "../utils/functions.js";
import {
  getFetchRegions,
  getFetchedCities,
  getFetchedHomePage,
  getFetchedServices,
  getHomeData,
} from "../utils/home.js";
import getBase64 from "../utils/getBase64.js";
import dynamic from "next/dynamic.js";
import HeroSection from "../Components/Home/HeroSection.jsx";
import FormSection from "../Components/Home/FormSection.jsx";
import AreaSection from "../Components/Home/AreaSection.jsx";
import DriveTypesSection from "../Components/Home/DriveTypesSection.jsx";
import ContactWays from "../Components/Misc/ContactWays/ContactWays.jsx";

export async function getStaticProps() {
  try {
    const WORDPRESSTOKEN =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJzYWJhbnRvdV9hZG1pbiIsImlhdCI6MTY5Nzg5ODY2MiwiZXhwIjoxODU1NTc4NjYyfQ.oCkMkngRArnT1BwRs6bExWcQ-jsDncZla0SmHMIu588"; // Replace with your actual token
    const DATA_SOURCE = "https://saban-tours.ussl.co.il/wp-json/wp/v2"; // Replace with your actual API endpoint

    // // Fetch regions
    const fetchedRegions = await getFetchRegions();

    // // Fetch cities
    const fetchedCities = await getFetchedCities();

    // Fetch services
    let fetchedServices = await getFetchedServices();
    console.log("static props index");
    // Fetch media
    const mediaPromises = fetchedServices.map((service) => {
      const mainImageId = service?.acf?.feat_image;
      if (mainImageId != null) {
        return axios.get(`${DATA_SOURCE}/media/${mainImageId}`, {
          headers: {
            Authorization: WORDPRESSTOKEN,
          },
        });
      }
    });

    // const regionsWithCities = fetchedRegions.map((region) => {
    //   const cities = fetchedCities.filter(
    //     (city) => city.region[0] === region.id
    //   );
    //   return {
    //     ...region,
    //     cities,
    //   };
    // });

    const mediaResponses = await Promise.all(mediaPromises);
    const serializableMediaResponses = mediaResponses.map(
      (response) => response?.data
    );

    fetchedServices = fetchedServices.map((service, index) => {
      return {
        ...service,
        mainImage: serializableMediaResponses[index]?.source_url || null,
      };
    });

    // Fetch homepage data
    const homepageRes = await getFetchedHomePage();

    const fetchedHomepage = homepageRes.data[0];

    const bgImage = await getBase64(
      fetchedHomepage?.acf?.section_hero["hero_image_desktop"]
    );
    const updatedRegions = await Promise.all(
      fetchedRegions.map(updateRegionImages)
    );

    return {
      props: {
        initialData: {
          regions: updatedRegions,
          cities: fetchedCities,
          services: fetchedServices,
          media: serializableMediaResponses, // Now should be serializable
          homepageData: fetchedHomepage,
          bgImage: bgImage,
        },
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      props: {
        ...initialData,
      },
      revalidate: 60,
    };
  }
}

// const handleButton = () => {
//   if (typeof window !== 'undefined' && 'Notification' in window) {
//     Notification.requestPermission().then(perm => {
//       if (perm === "granted") {
//         const notification = new Notification("הודעה חדשה מ-סבן טורס", {
//           body: "רציתי לדעת שאת שלי, \n רציתי לקחת אותך איתי \n למקום אחר, שם נוכל לאהוב ולגדול",
//           data: { hello: "world" },
//           // icon: logo.src
//         })

//         notification.addEventListener("show", e => {
//           console.log("e")
//           console.log()
//         })
//       }
//     })
//   }
// }
const HomeComponent = dynamic(() => import("../Components/Home/HomeComp.jsx"), {
  ssr: false,
});

const FooterComponent = dynamic(
  () => import("../Components/Footer/Footer.jsx"),
  { ssr: false }
);

const Home = (props) => {
  const priceFormRef = useRef();
  const servicesToDisplay = React.useMemo(() => {
    if (props?.windowWidth >= 768) {
      return props?.initialData?.services?.slice(
        0,
        Math.floor(props?.initialData?.services?.length / 3) * 3
      );
    } else {
      return props?.initialData?.services?.slice(
        0,
        Math.floor(props?.initialData?.services?.length / 2) * 2
      );
    }
  }, [props?.initialData?.services, props?.windowWidth]);
  return (
    <div>
      {/* <HomeComponent
        regions={props?.initialData?.regions}
        cities={props?.initialData?.cities}
        services={props?.initialData?.services}
        windowWidth={props?.windowWidth}
        handlePopup={props.handlePopup}
        sendDataToApp={props?.sendDataToApp}
        userRoute={props?.userRoute}
        media={props?.initialData?.media}
        homepageData={props?.initialData?.homepageData}
        bgImage={props?.bgImage}
      /> */}
      <div className={styles.homeWrapper}>
        <HeroSection
          homepageData={props?.initialData?.homepageData?.acf}
          priceFormRef={priceFormRef}
        />
        <FormSection
          handlePopup={props.handlePopup}
          sendDataToApp={props?.sendDataToApp}
          userRoute={props?.userRoute}
          windowWidth={props?.windowWidth}
          homepageData={props?.initialData?.homepageData?.acf}
          priceFormRef={priceFormRef}
        />
        {/* style={{ backgroundImage: `url(${props?.homepageData?.acf?.section_service_areas?.desktop_bg_image})` }} */}
        {console.log(props?.initialData?.regions)}
        {props?.initialData?.regions && (
          <AreaSection
            homepageData={props?.initialData?.homepageData?.acf}
            windowWidth={props?.windowWidth}
            regions={props?.initialData?.regions}
            cities={props?.initialData?.cities}
          />
        )}
        {servicesToDisplay?.length && (
          <DriveTypesSection servicesToDisplay={servicesToDisplay} />
        )}

        {/* <section className={`${styles.gallery} ${styles.section}`}></section> */}
        {/* this will be filled later when i'll create some photos of vehicles Saban Tours can give to customers. */}
        <section className={`${styles.contact} ${styles.section}`}>
          <h2 className={styles.sectionTitle}>
            צריכים עזרה בבחירת רכב?
            <br />
            <span className={styles.markedText}>אפשרויות ליצירת קשר</span>
          </h2>
          <ContactWays />
        </section>
      </div>

      {/* <button onClick={() => handleButton()}>נוטיפיקיישן</button> */}
      <FooterComponent
      // scrolling={scrolling}
      // scrollTopVal={scrollTopVal}
      // windowWidth={windowWidth}
      />
    </div>
  );
};

export default Home;
