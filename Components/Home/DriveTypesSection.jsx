import React from "react";
import Image from "next/image";
import styles from "./homeComp.module.scss";
import Link from "next/link";
import { decodeHTMLEntities } from "../../utils/functions";

const DriveTypesSection = ({ servicesToDisplay }) => {
  console.log(servicesToDisplay);
  return (
    <section className={`${styles.whereWeGo} ${styles.section}`}>
      <h2 className={styles.sectionTitle}>
        לאן אפשר לנסוע עם חברת ההסעות סבן טורס?
      </h2>
      <div className={styles.services}>
        {servicesToDisplay?.map((service) => (
          <Link
            href={`/drive-types/${service.slug}`}
            className={styles.service}
            key={service.id}
          >
            {service?.mainImage && (
              <Image
                src={service?.mainImage}
                width={300}
                height={200}
                alt="service image"
                priority={true}
              />
            )}
            <button className={styles.serviceButton}>
              {/* <i className={styles.serviceIcon}><Image src={`/${service.iconName}`}/>service icon here</i> */}
              <span className={styles.serviceName}>
                {decodeHTMLEntities(service.title.rendered)}
              </span>
            </button>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DriveTypesSection;
