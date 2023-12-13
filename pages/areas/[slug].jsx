import React from "react";
import SinglePost from "../../Components/Misc/SinglePost/SinglePost";
import Footer from "../../Components/Footer/Footer";

// Function to fetch data for all the paths
export async function getStaticPaths() {
  // Fetch the list of available slugs
  const response = await fetch(
    `${process.env.DATA_SOURCE}/service_areas?per_page=100`,
    {
      headers: {
        Authorization: `${process.env.WORDPRESSTOKEN}`,
      },
    }
  );
  const areas = await response.json();
  const paths = areas.map((area) => ({
    params: { slug: decodeURIComponent(area.slug) },
  }));

  return { paths, fallback: false };
}

// Function to fetch data for a single page
export async function getStaticProps({ params }) {
  // Fetch the data for the specific area based on the slug
  const response = await fetch(
    `${process.env.DATA_SOURCE}/service_areas?slug=${params.slug}`,
    {
      headers: {
        Authorization: `${process.env.WORDPRESSTOKEN}`,
      },
    }
  );
  const data = await response.json();
  const pageData = await data[0];

  return { props: { pageData }, revalidate: 60 };
}

const AreaPage = ({ pageData }) => {
  return (
    <>
      <SinglePost spType={"area"} pageData={pageData} />
      <Footer />
    </>
  );
};

export default AreaPage;
