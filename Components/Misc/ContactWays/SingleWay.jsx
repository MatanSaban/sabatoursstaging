import React from 'react';
import styles from './contactWays.module.scss'
import Link from 'next/link';

const SingleWay = ({type, title, value, linkText, linkPath}) => {
    return (
            <Link className={`${styles.way} ${styles[type]}`} href={linkPath}>
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