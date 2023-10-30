import React from "react";
import styles from "./popup.module.scss";
import { AiFillCloseCircle } from "react-icons/ai";

const Popup = (props) => {
  const handleClose = () => {
    props.setPopup(<Popup show={false} content={props?.content} />);
  };

  console.log({...props?.customStyles});

  return (
    <div
      className={`${styles.popupWrapper} ${
        props.show ? styles.showPopup : styles.hiddenPopup
      }`}
    >
      <div className={styles.popup} style={{...props?.customStyles}}>
        <i className={styles.closePopupButton} onClick={handleClose}>
          <AiFillCloseCircle />
        </i>
        <div className={styles.content}>{props.content}</div>
      </div>
    </div>
  );
};

export default Popup;
