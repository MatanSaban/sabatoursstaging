import React from 'react';
import styles from './areas.module.scss';
import Link from 'next/link';
import PageHero from '../../Components/Misc/PageHero';
import {IoLocationOutline} from 'react-icons/io5'
import { isMobile } from '../../utils/functions';

export async function getStaticProps() {
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

    const fetchImage = async (imgId) => {
        try {
            const res = await fetch(`${process.env.DATA_SOURCE}/media/${imgId}`, {
                headers: {
                    Authorization: `${process.env.WORDPRESSTOKEN}`,
                },
            });
            if (!res.ok) {
                throw new Error(`Failed to fetch image ${imgId}: ${res.statusText}`);
            }
            const data = await res.json();
            return data.source_url;  // Corrected path to access the URL
        } catch (error) {
            console.error(`Error fetching image ${imgId}:`, error);
            return null;  // return null in case of an error
        }
    };
    
    

    const updateRegionImages = async (reg) => {
        const [desktopImageUrl, mobileImageUrl] = await Promise.all([
            fetchImage(reg?.acf?.bg_image_desktop),
            fetchImage(reg?.acf?.bg_image_mobile)
        ]);
        const newReg = {
            ...reg,
            acf: {
                bg_image_desktop: desktopImageUrl ? desktopImageUrl : null,
                bg_image_mobile: mobileImageUrl ? mobileImageUrl : null
            }
        };
        return newReg;
    };
    

    const updatedRegions = await Promise.all(regions.map(updateRegionImages));

    return { props: { cities, regions: updatedRegions } };
}

const Areas = ({ cities, regions }) => {
    return (
        <div className={styles.regionsWrapper}>
            <PageHero title={"אזורי השירות של סבן טורס"}/> 
            <div className={styles.regions}>
                {regions.map(region => (
                    <div className={styles.region} key={region.id} style={{backgroundImage: `url(${isMobile() ? region?.acf?.bg_image_mobile  : region?.acf?.bg_image_desktop})`}}>
                        <div className={styles.cover}></div>
                        <h2 className={styles.regionName}>{region.name}</h2>
                        <ul>
                            {cities.filter(city => city.region.includes(region.id)).map(city => (
                                <li className={styles.listItem} key={city.id}>
                                    <Link className={styles.link} href={`/areas/${city.slug}`}>
                                        <IoLocationOutline/><span className={styles.cityName}>{city.title.rendered}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Areas;
