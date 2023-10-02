import Image from 'next/image'
import React from 'react'
import Logo from '../../public/media/Logo.gif';
import styles from './logoLoader.module.scss'

const LogoLoader = ({percentage, show}) => {

    const loadingStyles = (percentage) => {
        switch (percentage) {
          case 0:
            return {};
          case 25:
            return { backgroundColor: "#000", color: "#fff" };
          case 50:
            return { backgroundColor: "#b2ffb9" , color: "#fff" };
          case 75:
            return { backgroundColor: "#4bbd55" , color: "#fff" };
          case 100:
            return { backgroundColor: "#209e00" , color: "#fff" };
          default:
            return {};
        }
      };
    

  return (
    <div className={`${styles.LogoAnimationWrapper} ${!show && styles.dontShow}`}>
        <Image className={styles.LogoAnimation} src={Logo} alt='סבן טורס, העמוד בטעינה' />
        <div className={styles.LoaderPercentage} style={loadingStyles(percentage)}>{percentage}%</div>
        <h3 className={styles.LoaderTitle}>מיד האתר יעלה, טוען...</h3>
    </div>
  )
}

export default LogoLoader