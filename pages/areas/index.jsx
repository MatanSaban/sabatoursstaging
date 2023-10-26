import React from 'react';
import styles from './areas.module.scss';
import PageHero from '../../Components/Misc/PageHero';
import RegionsComp from '../../Components/Home/RegionsComp';
import { fetchImage, updateRegionImages } from '../../utils/functions';

export async function getStaticProps () {
    // Fetch the list of available areas and regions
    const [citiesResponse, regionsResponse] = await Promise.all([
        fetch(`${process.env.DATA_SOURCE}/service_areas?per_page=100`, {
            headers: {
                Authorization: `${process.env.WORDPRESSTOKEN}`,
            },
        }),
        fetch(`${process.env.DATA_SOURCE}/region`, {
            headers: {
                Authorization: `${process.env.WORDPRESSTOKEN}`,
            },
        }),
    ]);

    const cities = await citiesResponse.json();
    const regions = await regionsResponse.json();

    const updatedRegions = await Promise.all(regions.map(updateRegionImages));

    return { props: { cities, regions: updatedRegions }, revalidate: 60 };
}

const Areas = ({ cities, regions }) => {
    return (
        <div className={styles.regionsWrapper}>
            <PageHero title={"אזורי השירות של סבן טורס"}/> 
            <RegionsComp regions={regions} cities={cities} />
        </div>
    );
};
export default Areas;
