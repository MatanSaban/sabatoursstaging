import React from 'react';
import styles from './pageHero.module.scss'

const PageHero = ({title}) => {
    return (
        <div className={styles.pageHero}>
            <h1>{title}</h1>
        </div>
    )
}

export default PageHero