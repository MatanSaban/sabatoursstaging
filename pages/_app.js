// pages/_app.js

import "../styles/globals.scss";
import "../styles/global.css"; // Import the global.css file for global styles
import Header from "../Components/Header/Header.jsx";
import Footer from "../Components/Footer/Footer.jsx";
import { LoadScript } from "@react-google-maps/api";
import Popup from "../Components/Popup/Popup";
import { useState } from "react";

const libraries = ["places"]; // define the libraries needed


function MyApp({ Component, pageProps }) {
  console.log("MyApp comp render");


  const [popup, setPopup] = useState(<Popup show={false} />);

  const handlePopup = (bool, content) => {
    return setPopup(<Popup show={bool} content={content} setPopup={setPopup} />)
  }

  const [userRoute, setUserRoute] = useState();

  const sendDataToApp = (a, b, c, d, e, f) => {
    setUserRoute({ ...a, ...b });
  }

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDqXMWSWoY417DNKERQid8teEuoxBjMLLo"
      libraries={libraries}
    >
      <div className="appWrapper">
        <Header />
        {popup}
        <Component {...pageProps} handlePopup={handlePopup} sendDataToApp={sendDataToApp} userRoute={userRoute} />
        <Footer />
      </div>
    </LoadScript>
  );
}

export default MyApp;
