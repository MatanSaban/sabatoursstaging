import React from 'react'
import PricingTable from './PricingTable'
import PageHero from './PageHero'
import Head from 'next/head' 
import { metaContent, renderTitles, returnTitle } from '../../utils/functions'
import styles from './singlePost.module.scss'

const SinglePost = ({pageData, spType}) => {    

  return (
    <div className={styles.singlePostWrapper}>
            <Head>
                <title>
                    {returnTitle(true, pageData?.acf?.title, spType)}
                </title>
                <meta name="description" content={metaContent(spType, pageData?.acf?.title)}/>
            </Head>
            <PageHero title={returnTitle(false, pageData?.acf?.title, spType)} />
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