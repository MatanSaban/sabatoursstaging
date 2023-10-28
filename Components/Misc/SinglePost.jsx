import React from 'react'
import PricingTable from './PricingTable'
import PageHero from './PageHero'
import Head from 'next/head'
import { renderTitles } from '../../utils/functions'
import styles from './singlePost.module.scss'

const SinglePost = ({pageData, spType}) => {

    const metaTitle = () => {
        let title;
        if (spType === "area") {
            title = `סבן טורס | שירות הסעות ב${pageData?.acf?.title}`
         } else {
             title = `סבן טורס | שירות הסעות בנושא: ${pageData?.acf?.title}`
         }   
        return title;

    }

    const metaContent = () => {
        let content;
        if (spType === "area") {
            content = `צריכים שירות הסעות ב ${pageData?.acf?.title}? הגעתם למקום הנכון!`
        } else {
            content = `מתעניינים בשירות הסעות בנושא ${pageData?.acf?.title}? הגעתם למקום הנכון!`
        }
        return content;
    }

    const postTitle = () => {
        let title;
        if (spType === "area") {
           title = `שירות הסעות ב ${pageData?.acf?.title}`
        } else {
            title = `שירות הסעות בנושא: ${pageData?.acf?.title}`
        }  
        return title;
    }

  return (
    <div className={styles.singlePostWrapper}>
            <Head>
                <title>
                    {metaTitle()}
                </title>
                <meta name="description" content={metaContent()}/>
            </Head>
            <PageHero title={postTitle()} />
            <div className={styles.contentWrapper}>
                <div className={styles.content}>
                    <div className={styles.introductionWrapper}>
                        <div className={styles.introduction}>
                            <h2>{pageData?.acf?.content?.Introduction_title}</h2>
                            <div dangerouslySetInnerHTML={{ __html: pageData?.acf?.content?.Introduction_content }} />
                        </div>
                    </div>
                    <div className={styles.titlesWrapper}>
                        <div className={styles.titles}>
                            {renderTitles(pageData?.acf?.content?.titles_and_texts, styles)}
                        </div>
                    </div>
                </div>
            </div>
            {pageData?.acf?.pricing_table && <div className={styles.pricingTable}>
                <PricingTable tableObj={pageData?.acf?.pricing_table} cityName={pageData?.acf?.title} />
            </div>}
        </div>
  )
}

export default SinglePost