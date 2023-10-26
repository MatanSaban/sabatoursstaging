import React from "react";
import HomeComp from "../Components/Home/HomeComp.jsx";
import axios from "axios";
import logo from '../public/media/faviconSquare.png'
import { updateRegionImages } from "../utils/functions.js";

export async function getServerSideProps(context) {
  try {
    const WORDPRESSTOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJzYWJhbnRvdV9hZG1pbiIsImlhdCI6MTY5Nzg5ODY2MiwiZXhwIjoxODU1NTc4NjYyfQ.oCkMkngRArnT1BwRs6bExWcQ-jsDncZla0SmHMIu588';  // Replace with your actual token
    const DATA_SOURCE = 'https://saban-tours.ussl.co.il/wp-json/wp/v2';  // Replace with your actual API endpoint

    // Fetch regions
    const regionRes = await axios.get(
      `${DATA_SOURCE}/region?per_page=100`,
      {
        headers: {
          'Authorization': WORDPRESSTOKEN,
        }
      }
    );
    const fetchedRegions = regionRes.data;

    // Fetch cities
    const citiesRes = await axios.get(
      `${DATA_SOURCE}/service_areas?per_page=100`,
      {
        headers: {
          'Authorization': WORDPRESSTOKEN,
        }
      }
    );
    const fetchedCities = citiesRes.data;

    // Fetch services
    const servicesRes = await axios.get(
      `${DATA_SOURCE}/transportation_types?per_page=100`,
      {
        headers: {
          'Authorization': WORDPRESSTOKEN,
        }
      }
    );
    let fetchedServices = servicesRes.data;

    // Fetch media
    const mediaPromises = fetchedServices.map((service) => {
      const mainImageId = service?.acf?.feat_image;
      if (mainImageId != null) {
        return axios.get(`${DATA_SOURCE}/media/${mainImageId}`,
          {
            headers: {
              'Authorization': WORDPRESSTOKEN,
            }
          }
        );
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
    const serializableMediaResponses = mediaResponses.map(response => response?.data);

    fetchedServices = fetchedServices.map((service, index) => {
      return {
        ...service,
        mainImage: serializableMediaResponses[index]?.source_url || null,
      };
    });

    // Fetch homepage data
    const homepageRes = await axios.get(
      `${DATA_SOURCE}/pages?slug=home&acf_format=standard`,
      {
        headers: {
          'Authorization': WORDPRESSTOKEN,
        }
      }
    );
    const fetchedHomepage = homepageRes.data[0];

    const updatedRegions = await Promise.all(fetchedRegions.map(updateRegionImages));


    return {
      props: {
        initialData: {
          regions: updatedRegions,
          cities: fetchedCities,
          services: fetchedServices,
          media: serializableMediaResponses,  // Now should be serializable
          homepageData: fetchedHomepage,
        },
      },
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      props: {
        ...initialData
      },
    };
  }
}

const handleButton = () => {
  Notification.requestPermission().then(perm => {
    if (perm === "granted") {
      const notification = new Notification("הודעה חדשה מ-סבן טורס", {
        body: "רציתי לדעת שאת שלי, \n רציתי לקחת אותך איתי \n למקום אחר, שם נוכל לאהוב ולגדול",
        data: {hello: "world"}, 
        icon: logo.src
      })

      notification.addEventListener("show", e => {
        console.log("e")
        console.log()
      })
    } 
  })
}


const Home = (props) => {
  return (
    <div>
      <HomeComp
        regions={props?.initialData?.regions}
        cities={props?.initialData?.cities}
        services={props?.initialData?.services}
        windowWidth={props?.windowWidth}
        handlePopup={props.handlePopup}
        sendDataToApp={props?.sendDataToApp}
        userRoute={props?.userRoute}
        media={props?.initialData?.media}
        homepageData={props?.initialData?.homepageData}
      />
      <button onClick={() => handleButton()}>נוטיפיקיישן</button>
    </div>
  );
};

export default Home;
