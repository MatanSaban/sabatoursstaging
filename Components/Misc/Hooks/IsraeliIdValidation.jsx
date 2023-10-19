import { useState } from 'react';

function useIsraeliIdValidation() {
  const [isValid, setIsValid] = useState(null);

  const validateIsraeliId = (id) => {
    if (id.length !== 9) {
        setIsValid(false);
      return false;
    }
    id = String(id).trim();
    if (id.length > 9 || isNaN(id)) {
      setIsValid(false);
      return false;
    }

    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;

    const isValidId = Array.from(id, Number).reduce((counter, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return counter + (step > 9 ? step - 9 : step);
    }) % 10 === 0;

    setIsValid(isValidId);
    return isValidId;
  };

  return [isValid, validateIsraeliId];
}

export default useIsraeliIdValidation;
