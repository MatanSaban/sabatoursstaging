import React, { useState } from 'react';
import Way from './Way';
import styles from './priceform.module.scss';

const MultiTargetsTwoWays = (props) => {
  const [routeCount, setRouteCount] = useState(1);

  const addRoute = () => {
    setRouteCount(routeCount + 1);
  };

  const removeRoute = () => {
    if (routeCount > 1) {
      setRouteCount(routeCount - 1);
    }
  };

  return (
    <div className={styles.multiTargetsTwoWays}>
      {Array.from({ length: routeCount }, (_, index) => (
        <Way key={index} {...props} />
      ))}
      <button onClick={addRoute}>Add Route</button>
      <button onClick={removeRoute}>Remove Route</button>
    </div>
  );
};

export default MultiTargetsTwoWays;
