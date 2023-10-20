import React from "react";
import HomeComp from "../Components/Home/HomeComp.jsx";
import axios from "axios";

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

export const getServerSideProps = async () => {
  let regions = [];
  let services = [];
  let media = [];
  let homepageData = {};

  // Fetch regions
  try {
    const regionRes = await axios.get(`${process.env.DATA_SOURCE}/region?per_page=100`, {
      headers: {
        'Authorization': `${process.env.WORDPRESSTOKEN}`,
      }
    });
    regions = await regionRes.data;

    // Fetch services
    const servicesRes = await axios.get(`${process.env.DATA_SOURCE}/transportation_types?per_page=100`, {
      headers: {
        'Authorization': `${process.env.WORDPRESSTOKEN}`,
      }
    });
    services = await servicesRes.data;

    // Fetch media for services
    const mediaPromises = services.map((service) => {
      const mainImageId = service?.acf?.feat_image;
      if (mainImageId != null) {
        return axios.get(`${process.env.DATA_SOURCE}/media/${mainImageId}`, {
          headers: {
            'Authorization': `${process.env.WORDPRESSTOKEN}`,
          }
        });
      }
      return null;
    });
    
    const mediaResponses = await Promise.all(mediaPromises);
    media = mediaResponses.map(response => response?.data?.source_url || null);

    // Fetch homepage data
    const homepageRes = await axios.get(`${process.env.DATA_SOURCE}/pages?slug=home&acf_format=standard`, {
      headers: {
        'Authorization': `${process.env.WORDPRESSTOKEN}`,
      }
    });
    homepageData = await homepageRes.data[0];

  } catch (error) {
    console.error('An error occurred while fetching data:', error);
  }

  return {
    props: {
      regions,
      services,
      media,
      homepageData,
    }
  };
};

export default Home;
