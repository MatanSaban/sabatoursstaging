import axios from 'axios';
import { useRouter } from 'next/router';

import React from 'react'

const DriveType = (props) => {
    console.log('props of [slug]');
    console.log(props);
    const router = useRouter();
    const { slug } = router.query;
    return (
        <div>{slug}</div>
    )
}

export default DriveType

export async function getStaticPaths() {
    const res = await axios.get(`${process.env.DATA_SOURCE}/transportation_types`, {
        headers: {
          Authorization: `${process.env.WORDPRESSTOKEN}`,
        },
      });
    const driveTypes = res.data;

    const paths = driveTypes.map((driverType) => ({
        params: { slug: driverType.slug },
    }));

    return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
    const res = await axios.get(`${process.env.DATA_SOURCE}/transportation_types?slug=${params.slug}`, {
        headers: {
          Authorization: `${process.env.WORDPRESSTOKEN}`,
        },
      });
    const post = res.data[0];

    return { props: { post }, revalidate: 60 };
}