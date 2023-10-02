import React from "react";
import styles from "./footer.module.scss";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <div className={`${styles.linksComp} ${styles.aboutUs}`}>
          <h3>אודות</h3>
          <ul className={styles.links}>
            <li className={styles.link}>
              <Link href="#">הזמנת נסיעה פרטית</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">מאמרים</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">צור קשר</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">הצהרת נגישות</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">תנאי השימוש באתר</Link>
            </li>
          </ul>
        </div>
        <div className={styles.linksComp}>
          <h3>ניווט מהיר</h3>
          <ul className={styles.links}>
            <li className={styles.link}>
              <Link href="#">הזמנת נסיעה פרטית</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">מאמרים</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">צור קשר</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">הצהרת נגישות</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">תנאי השימוש באתר</Link>
            </li>
          </ul>
        </div>
        <div className={styles.linksComp}>
          <h3>סוגי הסעות</h3>
          <ul className={styles.links}>
            <li className={styles.link}>
              <Link href="#">הזמנת נסיעה פרטית</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">מאמרים</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">צור קשר</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">הצהרת נגישות</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">תנאי השימוש באתר</Link>
            </li>
          </ul>
        </div>
        <div className={styles.linksComp}>
          <h3>אזורי שירות</h3>
          <ul className={styles.links}>
            <li className={styles.link}>
              <Link href="#">הזמנת נסיעה פרטית</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">מאמרים</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">צור קשר</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">הצהרת נגישות</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">תנאי השימוש באתר</Link>
            </li>
          </ul>
        </div>
        <div className={`${styles.linksComp} ${styles.contactLinks}`}>
          <h3>יצירת קשר</h3>
          <ul className={styles.links}>
            <li className={styles.link}>
              <Link href="#">הזמנת נסיעה פרטית</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">מאמרים</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">צור קשר</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">הצהרת נגישות</Link>
            </li>
            <li className={styles.link}>
              <Link href="#">תנאי השימוש באתר</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.creditStripe}>
        <span>כל הזכויות שמורות ל-סבן טורס 2023</span>
        <Link target="_blank" href={'https://ezd.co.il'}>Built With ♡ By EasyDigital</Link>
      </div>
    </footer>
  );
};

export default Footer;
