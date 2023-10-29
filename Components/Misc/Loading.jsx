import React from 'react'
import Logo from '../../public/media/LogoAnimationLottie.json';
import styles from './logoLoader.module.scss'
import Lottie from 'lottie-react';

const LogoLoader = ({percentage, show, showPercentage}) => {

  return (
    <div className={`${styles.LogoAnimationWrapper} ${!show && styles.dontShow}`}>
        <Lottie className={styles.LogoAnimation} animationData={Logo} alt='ברוכים הבאים לסבן טורס, העמוד בטעינה' autoPlay={true}/>
        {
          showPercentage && 
        <div className={styles.LoaderPercentage} style={{background:`linear-gradient(90deg, #76ad24 ${percentage}%,  #ffffff 0%)`, color: `${percentage > 48 && "#fff" }`, textShadow: `${percentage > 48 && "0 0 10px #000"}`}}>{percentage}%</div>
        }
        <h3 className={styles.LoaderTitle}>מיד האתר יעלה, טוען...</h3>
    </div>
  )
}

export default LogoLoader