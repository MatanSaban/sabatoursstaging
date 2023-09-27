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

const libraries = ["places"]; // define the libraries needed

function MyApp({ Component, pageProps }) {
  const [userRoute, setUserRoute] = useState();
  const [popup, setPopup] = useState(<Popup show={false} />);
  const [regions, setRegions] = useState([]);
  const [services, setServices] = useState([]);
  const [media, setMedia] = useState([]);
  const [homepageData, setHomepageData] = useState();
  const [windowWidth, setWindowWidth] = useState();
  console.log("MyApp comp render");

  const handlePopup = (bool, content) => {
    return setPopup(
      <Popup show={bool} content={content} setPopup={setPopup} />
    );
  };

  const sendDataToApp = (a, b, c, d, e, f) => {
    setUserRoute({ ...a, ...b });
  };

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    // load post types relevant for home page + when user enters the website.
    const fetchData = async () => {
      try {
        // Fetch regions
        const regionRes = await axios.get(
          `${process.env.DATA_SOURCE}/region?per_page=100`
        );
        let fetchedRegions = regionRes.data;

        // Fetch cities
        const citiesRes = await axios.get(
          `${process.env.DATA_SOURCE}/service_areas?per_page=100`
        );
        let fetchedCities = citiesRes.data;

        const services = await axios.get(
          `${process.env.DATA_SOURCE}/transportation_types?per_page=100`
        );
        let fetchedServices = services.data;

        const mediaPromises = fetchedServices.map((service) => {
          console.log("service");
          console.log(service);
          const mainImageId = service?.acf?.feat_image;
          if (mainImageId != null) {
            return axios.get(`${process.env.DATA_SOURCE}/media/${mainImageId}`);
          }
        });

        const mediaResponses = await Promise.all(mediaPromises);

        fetchedServices = fetchedServices.map((service, index) => {
          return {
            ...service,
            mainImage: mediaResponses[index]?.data?.source_url || null,
          };
        });

        setServices(fetchedServices);

        // Associate cities with their respective regions
        fetchedRegions = fetchedRegions.map((region) => {
          const cities = fetchedCities.filter(
            (city) => city.region[0] === region.id
          );
          return {
            ...region,
            cities,
          };
        });
        setRegions(fetchedRegions);

        const homepageRes = await axios.get(
          `${process.env.DATA_SOURCE}/pages?slug=home&acf_format=standard`
        );
        const fetchHomepage = homepageRes.data[0];
        setHomepageData(fetchHomepage);

      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchData();
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
        <meta name="theme-color" content="#000000" />
      </Head>

      <div className="appWrapper">
        <Header
          regions={regions}
          services={services}
          windowWidth={windowWidth}
          media={media}
        />
        {popup}
        <Component
          {...pageProps}
          handlePopup={handlePopup}
          sendDataToApp={sendDataToApp}
          userRoute={userRoute}
          regions={regions}
          services={services}
          windowWidth={windowWidth}
          media={media}
          homepageData={homepageData}
        />
        <Footer
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
