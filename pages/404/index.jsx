import React from 'react';
import styles from './page404.module.scss'
import PageHero from '../../Components/Misc/PageHero';
import Lottie from 'lottie-react';
import animation from '../../public/media/404animation.json'
import Link from 'next/link';
import Head from 'next/head';

const Error404Page = () => {
  return (
    <>
    <Head>
      <title>
        סבן טורס | שגיאה 404
      </title>
    </Head>
    <div className={styles.errorPageWrapper}> 
      <PageHero title={"שגיאה 404 : עמוד לא קיים"} /> 
      <div className={styles.content}>
        <div className={styles.lottieWrapper}>
          <Lottie className={styles.lottie} animationData={animation} autoPlay={true}/>
        </div>
        <h2>
          <span className={styles.firstText}>
          בתור חברת הסעות היינו מאוד שמחים לקחת אתכם גם לפה.. 
          </span>
          <span className={styles.secondText}>
          אבל אין כזה עמוד!
          </span>

        </h2>
        <Link href={"/"}>
        <button>חזרה לעמוד הבית</button>
        </Link>
      </div>
    </div>
    </>
  )
}

export default Error404Page