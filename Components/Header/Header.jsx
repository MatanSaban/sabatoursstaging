import React, { useEffect, useState } from "react";
import styles from "./header.module.scss";
import { MdOutlineThumbUpOffAlt } from "react-icons/md";
import Logo from "../../public/media/SabanToursLogo.svg";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [scrolling, setScrolling] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 0) {
        setScrolling(true);
        console.log("now its 0 - not scrolled");
      } else {
        console.log("now its more than 0 - does scrolled");
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMobileMenuDelay = () => {
    setTimeout(() => {
      setMobileMenu(false);
    }, 500);
  }

  return (
    <header
      className={`${styles.Header} ${
        scrolling ? styles.scrolled : styles.notScrolled
      }`}
    >
      <div className={styles.LogoWrapper}>
        <Link href="/">
          <Image
            className={styles.logo}
            src={Logo}
            height={100}
            width={100}
            alt="לוגו של סבן טורס"
          />
        </Link>
      </div>
      <div className={styles.DesktopMenuWrapper}>
        <ul className={styles.menu}>
          <li className={styles.menuItem} >
            <Link className={styles.menuItemLink} href="/">
              עמוד הבית
            </Link>
          </li>
          <li className={styles.menuItem} >
            <Link className={styles.menuItemLink} href="/">
              סוגי הסעות
            </Link>
          </li>
          <li className={styles.menuItem} >
            <Link className={styles.menuItemLink} href="/">
              סוגי רכבים
            </Link>
          </li>
          <li className={styles.menuItem} >
            <Link className={styles.menuItemLink} href="/">
              מידע כללי
            </Link>
          </li>
          <li className={styles.menuItem} >
            <Link className={styles.menuItemLink} href="/">
              מאמרים
            </Link>
          </li>
          <li className={styles.menuItem} >
            <Link className={styles.menuItemLink} href="/">
              אודותינו
            </Link>
          </li>
          <li className={styles.menuItem} >
            <Link className={styles.menuItemLink} href="/">
              יצירת קשר
            </Link>
          </li>
        </ul>
      </div>
      <div className={styles.ActionButtonWrapper}>
        <button className={`${styles.actionButton} ${styles.pinkButton}`}>
          <span>הזמנת הסעה</span>
          <MdOutlineThumbUpOffAlt />
        </button>
      </div>
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
      {
        <div
          className={`${styles.mobilePopupMenu} ${mobileMenu && styles.active}`}
        >
          <h3 className={styles.menuTitle}>תפריט ראשי</h3>
          <ul className={styles.menu}>
            <li className={styles.menuItem} onClick={() => closeMobileMenuDelay()}>
              <Link className={styles.menuItemLink} href="/">
                עמוד הבית
              </Link>
            </li>
            <li className={styles.menuItem} onClick={() => closeMobileMenuDelay()}>
              <Link className={styles.menuItemLink} href="/">
                סוגי הסעות
              </Link>
            </li>
            <li className={styles.menuItem} onClick={() => closeMobileMenuDelay()}>
              <Link className={styles.menuItemLink} href="/">
                סוגי רכבים
              </Link>
            </li>
            <li className={styles.menuItem} onClick={() => closeMobileMenuDelay()}>
              <Link className={styles.menuItemLink} href="/">
                מידע כללי
              </Link>
            </li>
            <li className={styles.menuItem} onClick={() => closeMobileMenuDelay()}>
              <Link className={styles.menuItemLink} href="/">
                מאמרים
              </Link>
            </li>
            <li className={styles.menuItem} onClick={() => closeMobileMenuDelay()}>
              <Link className={styles.menuItemLink} href="/">
                אודותינו
              </Link>
            </li>
            <li className={styles.menuItem} onClick={() => closeMobileMenuDelay()}>
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
