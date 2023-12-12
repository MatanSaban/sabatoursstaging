import React, { useEffect, useRef, useState } from "react";
import styles from "./header.module.scss";
import ActionButton from "./ActionButton";
import Link from "next/link";
import LottieLogoAnim from "../../public/media/LogoAnimationLottie.json";
import Lottie from "lottie-react";
import { isMobile } from "../../utils/functions";
// import dynamic from "next/dynamic";

const Header = (props) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const lottieRef = useRef();
  // const Lottie = dynamic(() => {
  //   import("lottie-react");
  // });

  const closeMobileMenuDelay = () => {
    setTimeout(() => {
      setMobileMenu(false);
    }, 500);
  };

  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      props?.setHeaderHeight(height);
    }
  }, []);

  return (
    <header
      ref={headerRef}
      className={`${styles.Header} ${
        props?.scrolling ? styles.scrolled : styles.notScrolled
      }`}
    >
      {isMobile(props?.windowWidth) && (
        <ActionButton
          windowWidth={props?.windowWidth}
          handlePopup={props?.handlePopup}
          styles={styles}
        />
      )}
      <div className={styles.LogoWrapper}>
        <Link className={styles.logoLink} href="/">
          {/* <Image className={styles.logo} src={Logo} alt='סבן טורס, העמוד בטעינה' />
           */}
          <Lottie
            onLoopComplete={() => {
              lottieRef.current.goToAndStop(120, true);
              setTimeout(() => {
                lottieRef.current.goToAndPlay(0, true);
              }, 30000);
            }}
            animationData={LottieLogoAnim}
            loop={true}
            lottieRef={lottieRef}
          />
        </Link>
      </div>
      <div className={styles.DesktopMenuWrapper}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <Link className={styles.menuItemLink} href="/">
              עמוד הבית
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link className={styles.menuItemLink} href="/areas">
              אזורי שירות
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link className={styles.menuItemLink} href="/drive-types">
              סוגי הסעות
            </Link>
          </li>
          {/* <li className={styles.menuItem} >
            <Link className={styles.menuItemLink} href="/drive-types">
              סוגי רכבים
            </Link>
          </li> */}
          {/* <li className={styles.menuItem} >
            <Link className={styles.menuItemLink} href="/">
              מאמרים
            </Link>
          </li> */}
          {/* <li className={styles.menuItem} >
            <Link className={styles.menuItemLink} href="/">
              אודותינו
            </Link>
          </li> */}
          <li className={styles.menuItem}>
            <Link className={styles.menuItemLink} href="/">
              יצירת קשר
            </Link>
          </li>
        </ul>
      </div>
      {!isMobile(props?.windowWidth) && (
        <ActionButton
          windowWidth={props?.windowWidth}
          handlePopup={props?.handlePopup}
          styles={styles}
        />
      )}
      <div className={styles.mobileMenuWrapper}>
        <div
          className={`${styles.MobileMenu} ${mobileMenu && styles.active}`}
          onClick={() => {
            setMobileMenu(!mobileMenu);
          }}
        >
          <div className={`${styles.line} ${styles.top}`}></div>
          <div className={`${styles.line} ${styles.center}`}></div>
          <div className={`${styles.line} ${styles.bottom}`}></div>
        </div>
      </div>

      {
        <div
          className={`${styles.mobilePopupMenu} ${mobileMenu && styles.active}`}
        >
          <h3 className={styles.menuTitle}>תפריט ראשי</h3>
          <ul className={styles.menu}>
            <li
              className={styles.menuItem}
              onClick={() => closeMobileMenuDelay()}
            >
              <Link className={styles.menuItemLink} href="/">
                עמוד הבית
              </Link>
            </li>
            <li
              className={styles.menuItem}
              onClick={() => closeMobileMenuDelay()}
            >
              <Link className={styles.menuItemLink} href="/areas">
                אזורי שירות
              </Link>
            </li>
            <li
              className={styles.menuItem}
              onClick={() => closeMobileMenuDelay()}
            >
              <Link className={styles.menuItemLink} href="/drive-types">
                סוגי הסעות
              </Link>
            </li>
            {/* <li className={styles.menuItem} onClick={() => closeMobileMenuDelay()}>
              <Link className={styles.menuItemLink} href="/">
                סוגי רכבים
              </Link>
            </li> */}
            {/* <li className={styles.menuItem} onClick={() => closeMobileMenuDelay()}>
              <Link className={styles.menuItemLink} href="/">
                מאמרים
              </Link>
            </li> */}
            {/* <li className={styles.menuItem} onClick={() => closeMobileMenuDelay()}>
              <Link className={styles.menuItemLink} href="/">
                אודותינו
              </Link>
            </li> */}
            <li
              className={styles.menuItem}
              onClick={() => closeMobileMenuDelay()}
            >
              <Link className={styles.menuItemLink} href="/">
                יצירת קשר
              </Link>
            </li>
          </ul>
        </div>
      }
    </header>
  );
};

export default Header;
