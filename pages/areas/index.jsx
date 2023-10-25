import React from 'react';
import styles from './Areas.module.scss';
import Link from 'next/link';

export async function getStaticProps() {
    // Fetch the list of available areas
    const response = await fetch(`${process.env.DATA_SOURCE}/service_areas`, {
        headers: {
            Authorization: `${process.env.WORDPRESSTOKEN}`,
        },
    });
    const areas = await response.json();

    return { props: { areas } };
}

const Areas = ({ areas }) => {
    return (
        <div className={styles.areasWrapper}>
            <h1>Service Areas</h1>
            <ul>
                {areas.map(area => (
                    <li key={area.slug}>
                        <Link href={`/areas/${area.slug}`}>
                        {area.acf.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Areas;
