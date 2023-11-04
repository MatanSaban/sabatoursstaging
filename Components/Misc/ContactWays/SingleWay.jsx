import React from 'react';
import styles from './SingleWay.module.scss'
import Link from 'next/link';

const SingleWay = ({type, title, value, linkText, linkPath, target}) => {
    return (
            <Link className={`${styles.way} ${styles[type]}`} href={linkPath} target={target}>
            <h3 className={styles.wayTitle}> 
                {title}
            </h3>
            <p className={styles.wayValue}>
                {value}
            </p>
                <span className={styles.wayLink}>
                {linkText}
                </span>
            </Link>
    )
}

export default SingleWay