import React from "react";
import SinglePost from "../../Components/Misc/SinglePost";




// Function to fetch data for a single page
export async function getStaticProps({ params }) {
    // Fetch the data for the specific area based on the slug
    const response = await fetch(`${process.env.DATA_SOURCE}/service_areas?slug=${params.slug}`, {
        headers: {
            Authorization: `${process.env.WORDPRESSTOKEN}`,
        },
    });
    const data = await response.json(); 
    const pageData = await data[0];

    return { props: { pageData }, revalidate: 60 };
}


const AreaPage = ({ pageData }) => {
    
    return (
        <SinglePost pageData={pageData}/>
    );
};

export default AreaPage;
