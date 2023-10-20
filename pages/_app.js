// pages/_app.js

import "../styles/globals.scss";
import "../styles/global.css"; // Import the global.css file for global styles
import Header from "../Components/Header/Header.jsx";
import Footer from "../Components/Footer/Footer.jsx";
import { LoadScript } from "@react-google-maps/api";
import Popup from "../Components/Popup/Popup";
import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import LogoLoader from "../Components/Misc/LogoLoader";

const libraries = ["places"]; // define the libraries needed

function MyApp({ Component, pageProps }) {
  const [userRoute, setUserRoute] = useState();
  const [popup, setPopup] = useState(<Popup show={false} />);
  // const [regions, setRegions] = useState([]);
  // const [services, setServices] = useState([]);
  // const [media, setMedia] = useState([]);
  // const [homepageData, setHomepageData] = useState();
  const [windowWidth, setWindowWidth] = useState();
  const [loading, setLoading] = useState(false);
  const [minLoadingTimeElapsed, setMinLoadingTimeElapsed] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [loaderShow, setLoaderShow] = useState(true);
  const [headerHeight, setHeaderHeight] = useState();
  const [scrolling, setScrolling] = useState(false);
  const [scrollTopVal, setScrollTopVal] = useState(0);

  const { regions, services, media, homepageData } = pageProps;


  

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrollTopVal(scrollTop);
      if (scrollTop > 0) {
        setScrolling(true);
      } else {
        setScrolling(false); 
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const handlePopup = (bool, content) => {
    return setPopup(
      <Popup show={bool} content={content} setPopup={setPopup} />
    );
  };

  const sendDataToApp = (a, b, c, d, e, f) => {
    setUserRoute({ ...a, ...b, ...c, ...d, ...e, ...f });
  };

  // useEffect(() => {
  //   // Simulate loading progress if you wish, or set it to 100 directly
  //   setLoading(true);
  //   setLoadingPercentage(24);
  //   if (pageProps.regions) {
  //     setLoadingPercentage(25);
  //   } else if (pageProps.services) {
  //     setLoadingPercentage(50);
  //   } else if (pageProps.media) {
  //     setLoadingPercentage(75);
  //   } else {
  //     setLoadingPercentage(100);
  //     setLoading(false);
  //   }
  //   // if (pageProps.regions && pageProps.services && pageProps.media && pageProps.homepageData) {
  //   // }
  // }, [pageProps]);

  // useEffect(() => {
  //   setLoading(true);  // Set loading to true when you initiate API calls
  //   const minLoadingTime = setTimeout(() => {
  //     setMinLoadingTimeElapsed(true);
  //   }, 5000);  // 6000 milliseconds = 6 seconds

  //   setWindowWidth(window.innerWidth);
  //   // load post types relevant for home page + when user enters the website.
  //   const fetchData = async () => {
  //     try {
  //       // Fetch regions
  //       const regionRes = await axios.get(
  //         `${process.env.DATA_SOURCE}/region?per_page=100`,
  //         {
  //           headers: {
  //             'Authorization': `${process.env.WORDPRESSTOKEN}`,
  //           }
  //         }
  //       );
  //       let fetchedRegions = regionRes.data;
  //       setLoadingPercentage(25);

  //       // Fetch cities
  //       const citiesRes = await axios.get(
  //         `${process.env.DATA_SOURCE}/service_areas?per_page=100`,
  //         {
  //           headers: {
  //             'Authorization': `${process.env.WORDPRESSTOKEN}`,
  //           }
  //         }
  //       );
  //       let fetchedCities = citiesRes.data;
  //       setLoadingPercentage(50);

  //       const services = await axios.get(
  //         `${process.env.DATA_SOURCE}/transportation_types?per_page=100`,
  //         {
  //           headers: {
  //             'Authorization': `${process.env.WORDPRESSTOKEN}`,
  //           }
  //         }
  //       );
  //       let fetchedServices = services.data;
  //       setLoadingPercentage(75);

  //       const mediaPromises = fetchedServices.map((service) => {
  //         console.log("service");
  //         console.log(service);
  //         const mainImageId = service?.acf?.feat_image;
  //         if (mainImageId != null) {
  //           return axios.get(`${process.env.DATA_SOURCE}/media/${mainImageId}`,
  //             {
  //               headers: {
  //                 'Authorization': `${process.env.WORDPRESSTOKEN}`,
  //               }
  //             });
  //         }
  //       });

  //       const mediaResponses = await Promise.all(mediaPromises);

  //       fetchedServices = fetchedServices.map((service, index) => {
  //         return {
  //           ...service,
  //           mainImage: mediaResponses[index]?.data?.source_url || null,
  //         };
  //       });

  //       setServices(fetchedServices);

  //       // Associate cities with their respective regions
  //       fetchedRegions = fetchedRegions.map((region) => {
  //         const cities = fetchedCities.filter(
  //           (city) => city.region[0] === region.id
  //         );
  //         return {
  //           ...region,
  //           cities,
  //         };
  //       });
  //       setRegions(fetchedRegions);

  //       const homepageRes = await axios.get(
  //         `${process.env.DATA_SOURCE}/pages?slug=home&acf_format=standard`,
  //         {
  //           headers: {
  //             'Authorization': `${process.env.WORDPRESSTOKEN}`,
  //           }
  //         }
  //       );
  //       const fetchHomepage = homepageRes.data[0];
  //       setHomepageData(fetchHomepage);

  //     } catch (error) {
  //       console.error("An error occurred while fetching data:", error);
  //     } finally {
  //       setLoadingPercentage(100); 
  //       // Check if minimum 6 seconds have elapsed before setting loading to false
  //       if (minLoadingTimeElapsed) {
  //         setLoading(false);
  //       } else if (loadingPercentage == 100) {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchData();

  //   return () => {
  //     clearTimeout(minLoadingTime);
  //   };

  // }, []);


  useEffect(() => {
    // If API calls are done and 6 seconds have passed, set loading to false
    if (minLoadingTimeElapsed &&
      regions &&
      services &&
      media &&
      homepageData) {
      setLoaderShow(false);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [minLoadingTimeElapsed, /* your dependencies for API calls being complete */]);


  return (
    <LoadScript
      googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <Head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/media/saban_tours_favicon.svg"
        />
        <title>סבן טורס - חברת ההסעות שלך</title>
        <meta name="theme-color" content="008bcd" />
      </Head>

      <div className="appWrapper">
      {loading && <LogoLoader percentage={loadingPercentage} show={loading} />}
        <Header
          regions={regions}
          services={services}
          windowWidth={windowWidth}
          media={media}
          setHeaderHeight={setHeaderHeight}
          scrolling={scrolling}
          scrollTopVal={scrollTopVal}
          />
        {popup}
        <Component
          scrolling={scrolling}
          scrollTopVal={scrollTopVal}
          {...pageProps}
          handlePopup={handlePopup}
          sendDataToApp={sendDataToApp}
          userRoute={userRoute}
          regions={regions}
          services={services}
          windowWidth={windowWidth}
          media={media}
          homepageData={homepageData}
          headerHeight={headerHeight}
          />
        <Footer
          scrolling={scrolling}
          scrollTopVal={scrollTopVal}
          regions={regions}
          services={services}
          windowWidth={windowWidth}
          media={media}
        />
      </div>
    </LoadScript>
  );
}

export default MyApp;
