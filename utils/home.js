import axios from "axios";

import { updateRegionImages } from "../utils/functions.js";

const WORDPRESSTOKEN = process.env.WORDPRESSTOKEN;
const DATA_SOURCE = process.env.DATA_SOURCE;

export const getFetchRegions = async () => {
  const regionRes = await axios.get(`${DATA_SOURCE}/region?per_page=100`, {
    headers: {
      Authorization: WORDPRESSTOKEN,
    },
  });
  return regionRes.data;
};

export const getFetchedCities = async () => {
  const citiesRes = await axios.get(
    `${DATA_SOURCE}/service_areas?per_page=100`,
    {
      headers: {
        Authorization: WORDPRESSTOKEN,
      },
    }
  );
  return citiesRes.data;
};

export const getFetchedServices = async () => {
  const servicesRes = await axios.get(
    `${DATA_SOURCE}/transportation_types?per_page=100`,
    {
      headers: {
        Authorization: WORDPRESSTOKEN,
      },
    }
  );
  return servicesRes.data;
};

export const getMainImageId = async (mainImageId) => {
  axios.get(`${DATA_SOURCE}/media/${mainImageId}`, {
    headers: {
      Authorization: WORDPRESSTOKEN,
    },
  });
};

// export const getMediaPromises = (mainImageId) =>
//   axios.get(`${DATA_SOURCE}/media/${mainImageId}`, {
//     headers: {
//       Authorization: WORDPRESSTOKEN,
//     },
//   });

export const getFetchedHomePage = async () =>
  axios.get(`${DATA_SOURCE}/pages?slug=home&acf_format=standard`, {
    headers: {
      Authorization: WORDPRESSTOKEN,
    },
  });
