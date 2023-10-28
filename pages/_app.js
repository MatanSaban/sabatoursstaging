// pages/_app.js

import "../styles/globals.scss";
import "../styles/global.css"; // Import the global.css file for global styles
import Header from "../Components/Header/Header.jsx";
import Footer from "../Components/Footer/Footer.jsx";
import { LoadScript } from "@react-google-maps/api";
import Popup from "../Components/Popup/Popup";
import { useState, useEffect } from "react";
import Head from "next/head";
import LogoLoader from "../Components/Misc/Loading";
import PageWrapper from "../Components/Misc/PageWrapper";


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
  }, [minLoadingTimeElapsed /* your dependencies for API calls being complete */]);

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
        <meta name="robots" content="all" />
        <meta name="description" content="סבן טורס הינה חברת הסעות מובילה הנותנת שירותי הסעות מקצועיים ואמינים בכל רחבי ישראל."/>
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
        {/* <!-- Hotjar Tracking Code for https://saban-tours.co.il/ --> */}
        <script> {`
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:3708673,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `}
        </script>
      </Head>

      <div className="appWrapper">
        {loading && <LogoLoader percentage={loadingPercentage} showPercentage={true} show={loaderShow} />}
        <Header
          windowWidth={windowWidth}
          setHeaderHeight={setHeaderHeight}
          scrolling={scrolling}
          scrollTopVal={scrollTopVal}
        />
        {popup}
        <PageWrapper
          scrolling={scrolling}
          scrollTopVal={scrollTopVal}
          {...pageProps}
          handlePopup={handlePopup}
          sendDataToApp={sendDataToApp}
          userRoute={userRoute}
          windowWidth={windowWidth}
          headerHeight={headerHeight}
        >
          <Component {...pageProps} />
        </PageWrapper>
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



