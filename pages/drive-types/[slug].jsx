import React from "react";
import SinglePost from "../../Components/Misc/SinglePost";


// Function to fetch data for all the paths
export async function getStaticPaths() {
    // Fetch the list of available slugs
    const response = await fetch(`${process.env.DATA_SOURCE}/transportation_types?per_page=100`, {
        headers: {
            Authorization: `${process.env.WORDPRESSTOKEN}`,
        },
    });
    const dTypes = await response.json();
    const paths = dTypes.map(dType => ({
        params: { slug: decodeURIComponent(dType.slug) },
    }));

    return { paths, fallback: false };
}

// Function to fetch data for a single page
export async function getServerSideProps({ params }) {
    // Fetch the data for the specific area based on the slug
    const response = await fetch(`${process.env.DATA_SOURCE}/transportation_types?slug=${params.slug}`, {
        headers: {
            Authorization: `${process.env.WORDPRESSTOKEN}`,
        },
    });
    const data = await response.json(); 
    const pageData = await data[0];

    return { props: { pageData } };
}


const DriveType = ({ pageData }) => {

    return (
        <SinglePost pageData={pageData}/>
    );
};

export default DriveType;
