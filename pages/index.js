import React from "react";
import HomeComp from "../Components/Home/HomeComp.jsx";
const Home = (props) => {
  return (
    <div>
      <HomeComp
        regions={props?.regions}
        services={props?.services}
        windowWidth={props?.windowWidth}
        handlePopup={props.handlePopup}
        sendDataToApp={props?.sendDataToApp}
        userRoute={props?.userRoute}
        media={props?.media}
        homepageData={props?.homepageData}
      />
    </div>
  );
};

export default Home;
