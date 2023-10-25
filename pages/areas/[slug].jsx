import React from "react";
import PageHero from "../../Components/Misc/PageHero";
import Head from "next/head";
import styles from './areas.module.scss';
import blue_green from "../../public/media/icon_blue_green.svg";
import pink_blue from "../../public/media/icon_pink_blue.svg";
import green_pink from "../../public/media/icon_green_pink.svg";
import Image from "next/image";
import PricingTable from "./PricingTable";


// Function to fetch data for all the paths
export async function getStaticPaths() {
    // Fetch the list of available slugs
    const response = await fetch(`${process.env.DATA_SOURCE}/service_areas`, {
        headers: {
            Authorization: `${process.env.WORDPRESSTOKEN}`,
        },
    });
    const areas = await response.json();
    const paths = areas.map(area => ({
        params: { slug: decodeURIComponent(area.slug) },
    }));

    return { paths, fallback: false };
}

// Function to fetch data for a single page
export async function getStaticProps({ params }) {
    // Fetch the data for the specific area based on the slug
    const response = await fetch(`${process.env.DATA_SOURCE}/service_areas?slug=${params.slug}`, {
        headers: {
            Authorization: `${process.env.WORDPRESSTOKEN}`,
        },
    });
    const data = await response.json(); 
    const pageData = await data[0];

    return { props: { pageData } };
}


const AreaPage = ({ pageData }) => {

    const renderTitles = (titlesAndTextArray) => {
        const jsx = titlesAndTextArray?.map((titleAndText, index) => {

            let LogoImage;

            const positionStyles = getPositionStyles(index);  // Get position styles based on index

            switch (index) {
                case 0:
                    LogoImage = <Image
                        className={`${styles.blue_green}`}
                        src={blue_green}
                        height={450}
                        width={300}
                        alt={"saban tours logo in brand colors - blue and green"}
                    />
                    break;
                case 1:
                    LogoImage = <Image
                        className={`${styles.pink_blue}`}
                        src={pink_blue}
                        height={420}
                        width={250}
                        alt={"saban tours logo in brand colors - pink and blue"}
                    />
                    break;
                case 2:
                    LogoImage = <Image
                        className={`${styles.green_pink}`}
                        src={green_pink}
                        height={255}
                        width={150}
                        alt={"saban tours logo in brand colors - green and pink"}
                    />
                    break;
                case 3:
                    LogoImage = <Image
                        className={`${styles.pink_blue}`}
                        src={pink_blue}
                        height={255}
                        width={150}
                        alt={"saban tours logo in brand colors - pink and blue"}
                    />
                    break;

                default:
                    LogoImage = <Image
                        className={`${styles.blue_green}`}
                        src={blue_green}
                        height={450}
                        width={300}
                        alt={"saban tours logo in brand colors - blue and green"}
                    />
                    break;
            }

            return (
                <div key={index} className={styles.titleSectionWrapper}>
                    <div className={styles.transparentIcon} style={positionStyles}>{LogoImage}</div>
                    <div className={styles.titleSection}>
                        <h3 className={styles.title}>{titleAndText.title}</h3>
                        <div className={styles.text} dangerouslySetInnerHTML={{ __html: titleAndText.text }} />
                    </div>
                </div>
            )
        })
        return jsx;
    }



    const getPositionStyles = (index) => {
        switch (index) {
            case 0:
                return { left: '0%', top: '-20%' };
            case 1:
                return { left: '80%', bottom: '20px' };
            case 2:
                return { left: '30%', top: '-20%' };
            case 3:
                return { right: '-50px', top: '10%' };
            default:
                return { left: '35%', top: '20%', transform: "translate(-50%, -50%)" };
        }
    };

    

    return (
        <div className={styles.singleAreaWrapper}>
            <Head>
                <title>
                    {`סבן טורס | שירות הסעות ב${pageData?.acf?.title}`}
                </title>
            </Head>
            <PageHero title={`שירות הסעות ב${pageData?.acf?.title}`} />
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
                            {renderTitles(pageData?.acf?.content?.titles_and_texts)}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.pricingTable}>
                <PricingTable tableObj={pageData?.acf?.pricing_table} cityName={pageData?.acf?.title} />
            </div>
        </div>
    );
};

export default AreaPage;
