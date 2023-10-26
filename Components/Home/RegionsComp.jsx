import React from 'react'
import { IoLocationOutline } from 'react-icons/io5';
import styles from './regionsComp.module.scss'
import Link from 'next/link';
import { isMobile } from '../../utils/functions';

const RegionsComp = ({regions, cities}) => {

    console.log('regions');
    console.log(regions);

  return (
    <div className={styles.regions}>
                {regions?.map(region => (
                    <div className={styles.region} key={region.id} style={{backgroundImage: `url(${isMobile() ? region?.acf?.bg_image_mobile  : region?.acf?.bg_image_desktop})`}}>
                        <div className={styles.cover}></div>
                        <h2 className={styles.regionName}>{region.name}</h2>
                        <ul>
                            {cities?.filter(city => city.region.includes(region.id)).map(city => (
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
  )
}

export default RegionsComp