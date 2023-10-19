import React, { useEffect, useState } from 'react';
import styles from './creditCardPrev.module.scss';

const CreditCardPrev = (props) => {
  const [cardSide, setCardSide] = useState(props?.cardDetails?.cardSide);
  const [ccNumParts, setCcNumParts] = useState(['XXXX', 'XXXX', 'XXXX', 'XXXX']);

  useEffect(() => {
    setCardSide(props?.cardDetails?.cardSide);
  }, [props?.cardDetails?.cardSide]);

  useEffect(() => {
    if (props?.cardDetails?.ccNumber) {
      updateCcNumParts(props.cardDetails.ccNumber);
    } else {
      setCcNumParts(['XXXX', 'XXXX', 'XXXX', 'XXXX']);
    }
  }, [props?.cardDetails]);

  const updateCcNumParts = (fullNumber) => {
    const formattedNumber = fullNumber.replace(/\s/g, ''); // Remove spaces
    const newCcNumParts = [];

    for (let i = 0; i < 4; i++) {
      newCcNumParts.push(formattedNumber.substr(i * 4, 4));
    }

    setCcNumParts(newCcNumParts);
  };

  const printCcNum = (partsArr) => {
    const toPrint = partsArr?.map((part, index) => {
      return <span key={index}>{part}</span>;
    });
    return toPrint;
  };

  return (
    <div className={styles.ccPrevImageWrapper}>
      <div
        className={styles.ccPrevImageFront}
        style={
          cardSide === 'front'
            ? { zIndex: 1, transform: 'scaleX(1)' }
            : { zIndex: -1, transform: 'scaleX(-1)' }
        }
      >
        <div className={styles.logo}>
          <span>Saban Tours Credit Card</span>
        </div>
        <div className={styles.number}>{printCcNum(ccNumParts)}</div>
        <div className={styles.expDate}>
          {props?.cardDetails?.ccDate?.month}/{props?.cardDetails?.ccDate?.year}
        </div>
        <div className={styles.clientName}>{props.cardDetails.fullNameOnCard}</div>
      </div>
      <div
        className={styles.ccPrevImageBack}
        style={
          cardSide === 'back'
            ? { zIndex: 1, transform: 'scaleX(1)' }
            : { zIndex: -1, transform: 'scaleX(-1)' }
        }
      >
        <div className={styles.ccMagneticStripe}></div>
        <div className={styles.cvvWrapper}>
          <span className={styles.title}>CVV</span>
          <span className={styles.cvv}>{props?.cardDetails?.ccCVV}</span>
        </div>
      </div>
    </div>
  );
};

export default CreditCardPrev;
