import { useState } from 'react';

const useCardNumberValidation = () => {
  const [isValidCC, setIsValidCC] = useState(null);

  const validateCardNumber = (cardNumber) => {
    let isValid;

    // Remove all spaces and non-numeric characters
    const sanitizedCardNumber = String(cardNumber).replace(/\D+/g, '');

    if (sanitizedCardNumber.length !== 16) {
        setIsValidCC(isValid);
        return isValid;
        }

    let sum = 0;

    // Loop through the sanitized card number digits starting from the rightmost digit
    for (let i = sanitizedCardNumber.length - 1, toggle = true; i >= 0; i--) {
      let digit = parseInt(sanitizedCardNumber[i], 10);
      let weight = toggle ? 1 : 2; // Weight alternates between 1 and 2, starting from the rightmost digit

      // Multiply the digit by its weight
      let product = digit * weight;
      // If the product is two-digit, sum its digits
      if (product > 9) {
        product = Math.floor(product / 10) + (product % 10);
      }
      // Add the product to the sum
      sum += product;
      // Toggle the weight for the next iteration
      toggle = !toggle;
    }
    // Check if the sum is divisible by 10
    isValid = sum % 10 === 0;

    setIsValidCC(isValid);
    return isValid;
  };

  return [isValidCC, validateCardNumber];
};

export default useCardNumberValidation;
