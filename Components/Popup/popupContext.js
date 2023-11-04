import { createContext, useState, useContext } from 'react';

const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);

export const PopupProvider = ({ children }) => {
    console.log("children");
    console.log("children");
    console.log("children");
    console.log("children");
    console.log(children);
  const [popup, setPopup] = useState({
    show: false,
    content: null,
    customStyles: {},
  });

  const togglePopup = (show, content, customStyles = {}) => {
    setPopup({ show, content, customStyles });
  };

  return (
    <PopupContext.Provider value={{ popup, togglePopup }}>
      {children}
    </PopupContext.Provider>
  );
};
