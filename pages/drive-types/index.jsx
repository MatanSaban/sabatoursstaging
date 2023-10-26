import React from "react";
import styles from "./driveTypes.module.scss";
import Link from "next/link";
import PageHero from "../../Components/Misc/PageHero";
import { decodeHTMLEntities } from "../../utils/functions";
import Image from "next/image";

export async function getServerSideProps() {
  // Fetch the list of available areas and regions
  const transportationTypesRes = await fetch(`${process.env.DATA_SOURCE}/transportation_types?per_page=100`, {
    headers: {
      Authorization: `${process.env.WORDPRESSTOKEN}`,
    },
  })

  const transportationTypes = await transportationTypesRes.json();


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


const updateDtImages = async (DriveType) => {
  const [desktopImageUrl] = await Promise.all([
      fetchImage(DriveType?.acf?.feat_image),
  ]);
  const newReg = {
      ...DriveType,
      acf: {
          feat_image: desktopImageUrl ? desktopImageUrl : null,
      }
  };
  return newReg;
};

const updatedDts = await Promise.all(transportationTypes.map(updateDtImages));

  return { props: { driveTypes: updatedDts } };
}

const DriveTypes = ({ driveTypes }) => {
  return (
    <div className={styles.driveTypesWrapper}>
      <PageHero title={"סוגי ההסעות שלנו"}/>
      <div className={styles.services}>
        {driveTypes?.map((service) => (
          <Link href={`/drive-types/${service?.slug}`} className={styles.service} key={service?.id}>
            <Image src={service.acf.feat_image} width={300} height={200} alt="service image" />
            <button className={styles.serviceButton}>
              {/* <i className={styles.serviceIcon}><Image src={`/${service.iconName}`}/>service icon here</i> */}
              <span className={styles.serviceName}>
                {decodeHTMLEntities(service?.title?.rendered)}
              </span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
    ;
};

export default DriveTypes;
