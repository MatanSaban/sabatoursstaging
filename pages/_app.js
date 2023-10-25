// pages/_app.js

import "../styles/globals.scss";
import "../styles/global.css"; // Import the global.css file for global styles
import Header from "../Components/Header/Header.jsx";
import Footer from "../Components/Footer/Footer.jsx";
import { LoadScript } from "@react-google-maps/api";
import Popup from "../Components/Popup/Popup";
import { useState, useEffect } from "react";
import Head from "next/head";
import LogoLoader from "../Components/Misc/LogoLoader";
import Hotjar from '@hotjar/browser';



const libraries = ["places"]; // define the libraries needed

function MyApp({ Component, pageProps }) {
  const [userRoute, setUserRoute] = useState();
  const [popup, setPopup] = useState(<Popup show={false} />);
  const [windowWidth, setWindowWidth] = useState();
  const [loading, setLoading] = useState(false);
  const [minLoadingTimeElapsed, setMinLoadingTimeElapsed] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [loaderShow, setLoaderShow] = useState(true);
  const [headerHeight, setHeaderHeight] = useState();
  const [scrolling, setScrolling] = useState(false);
  const [scrollTopVal, setScrollTopVal] = useState(0);

  const siteId = 3708673;
  const hotjarVersion = 6;

  Hotjar.init(siteId, hotjarVersion);

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

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    // If API calls are done and 6 seconds have passed, set loading to false
    if (minLoadingTimeElapsed) {
      setLoaderShow(false);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [minLoadingTimeElapsed, /* your dependencies for API calls being complete */]);

  useEffect(() => {
    setLoading(true);  // Set loading to true when you initiate API calls

    // Calculate the interval time needed to go from 0 to 100 in 5 seconds
    const totalDuration = 5500; // 5 seconds in milliseconds
    const intervalTime = totalDuration / 100; // duration for each increment

    // Initialize loading percentage to 0
    setLoadingPercentage(0);

    // Set an interval to increment the loadingPercentage
    const intervalId = setInterval(() => {
      setLoadingPercentage(prev => {
        if (prev >= 100) {
          clearInterval(intervalId);  // Clear the interval when it reaches 100
          return 100;
        }
        return prev + 1;  // Increment by 1
      });
    }, intervalTime);

    // Set the minimum loading time to 5 seconds
    setTimeout(() => {
      setMinLoadingTimeElapsed(true);
    }, totalDuration);

    return () => {
      clearInterval(intervalId);  // Clear the interval when the component unmounts
    };
  }, []);

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
        <script src={`https://www.googletagmanager.com/gtag/js?id=G-4WWJ8F67H9`} async />
        <script async id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} 
          gtag('js', new Date());
 
          gtag('config', 'G-4WWJ8F67H9');
        `}
        </script>
      </Head>

      <div className="appWrapper">
        {loading && <LogoLoader percentage={loadingPercentage} show={loaderShow} />}
        <Header
          windowWidth={windowWidth}
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
          windowWidth={windowWidth}
          headerHeight={headerHeight}
        />
        <Footer
          scrolling={scrolling}
          scrollTopVal={scrollTopVal}
          windowWidth={windowWidth}
        />
      </div>
    </LoadScript>
  );
}

export default MyApp;



