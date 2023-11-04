import blue_green from "../public/media/icon_blue_green.svg";
import pink_blue from "../public/media/icon_pink_blue.svg";
import green_pink from "../public/media/icon_green_pink.svg";
import Image from "next/image";


export function formatDate(dateObj) {
  if (!dateObj) {
    dateObj = new Date();
  }
  let day = dateObj.getDate();
  let month = dateObj.getMonth() + 1; // Months are zero-based
  let year = dateObj.getFullYear();

  // Ensure day and month are two digits
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  return `${day}/${month}/${year}`;
}

export const importantThing = {
  title: "חשוב להגיד",
  things: [
    {
      title: "תנאי ביטול",
      content: [
        "עד 2 ימי עסקים לפני מועד הנסיעה - ללא דמי ביטול.",
        "עד יום עסקים 1 לפני מועד הנסיעה ו/או במקרה של התייצבות הרכב ואי הגעה להסעה, 50% מ-עלות העסקה.",
        "במקרה של נסיעה לכיוון אחד ואי הגעת הנוסעים לאחר התייצבות הרכב - חיוב מלא.",
      ],
    },
    {
      title: "כבישי אגרה",
      content: [
        "נסיעה בכביש 6 הינה בעלות נוספת של 90 ש''ח לכיוון.",
        "נסיעה בכביש מנהרות הכרמל הינה בעלות נוספת של 80 ש''ח לכיוון.",
        "המחירים כוללים מע''מ.",
      ],
    },
    {
      title: "דגשים חשובים",
      content: [
        "בנסיעה מעל 130 ק''מ תתבצע עצירה של 15 דקות )אילת והחרמון - 2 עצירות( ללא עלות.",
        "כל המתנה של 15 דקות או חלק מ15 דקות תחוייב בעלות של 50 ש''ח כולל מע''מ",
        "יש לכבד את הרכב והנהג, לשמור על תקינות הרכב ונקיונו ובמידה והנהג אינו מאשר והנסיעה אינה ארוכה משעה וחצי ברציפות, אין לאכול",
        "ולשתות ברכב למעט מים.",
      ],
      marked: ["הצעה זו תקפה ל-48 שעות מעת שליחתה ועשויה להשתנות מעת לעת."],
    },
  ],
};

export const decodeHTMLEntities = (text) => {
  let parser = new DOMParser();
  let doc = parser.parseFromString(text, "text/html");
  return doc.documentElement.textContent;
};

export const renderPlainText = (htmlText) => {
  return { __html: htmlText };
};

export const customRound = (num) => {
  const lastDigit = num % 10;
  const roundedDownToTen = Math.floor(num / 10) * 10;

  if (lastDigit >= 5) {
    return roundedDownToTen + 10;
  } else {
    return roundedDownToTen;
  }
}

export const handleRouteTypeLabel = (routeType) => {
  if (routeType === "OneWay") {
    return "כיוון אחד";
  } else if (routeType === "TwoWays") {
    return "הלוך וחזור";
  } else if (routeType === "MultiWay") {
    return "רב יעדים";
  }
};

export const handleEventType = (eventType) => {
  let label;
  const eventTypesArr = eventTypes;
  if (eventTypesArr) {
    eventTypesArr.forEach((event) => {
      if (event.value == eventType) {
        label = event.label;
      }
    });
  }
  return label;
};

export const eventTypes = [
  { label: "אירוע פרטי", value: "private event" },
  { label: "אירוע", value: "event" },
  { label: "חתונה", value: "wedding" },
  { label: "נתב''ג", value: "airport" },
  { label: "טיול", value: "trip" },
  { label: "עבודה", value: "work" },
  { label: "בית ספר", value: "school" },
  { label: "יום כיף", value: "funday" },
  { label: "אחר", value: "other" },
];

export  const formatDateToString = (dateObj, dateOrTime) => {
  if (dateObj) {
    if (dateOrTime === "date") {
      const day = dateObj.getDate().toString().padStart(2, "0");
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObj.getFullYear().toString().slice(-2);
      return `${day}/${month}/${year}`;
    } else if (dateOrTime === "time") {
      const hours = dateObj.getHours().toString().padStart(2, "0");
      const minutes = dateObj.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
  }

  return "";
};

export const formatDuration = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 1) {
    return `${hours} שעות ו-${minutes} דקות`;
  } else if (hours == 1) {
    return `${hours} שעות ו-${minutes} דקות`;
  } else if (hours < 1) {
    return `${minutes} דקות`;
  }
};

export const showDistance = (distance) => {
  return `${distance ? distance.toFixed(1) : 0} ק"מ`;
};

export const isMobile = (windowWidth) => {
  if (windowWidth < 769) {
    return true;
  } else {
    return false;
  }
};

export const translateCarType = (carType) => {
  let carNameStr;
  switch (carType) {
    case "taxi":
      carNameStr = "מונית ספיישל"
      break;
    case "vipTaxi":
      carNameStr = "מונית VIP גדולה"
      break;
    case "minibus14":
      carNameStr = "מיניבוס 14 מקומות"
      break;
    case "minibus19":
      carNameStr = "מיניבוס 19 מקומות"
      break;
    case "midibus":
      carNameStr = "מידיבוס 35 מקומות"
      break;
    case "bus":
      carNameStr = "אוטובוס סטנדרט 55 מקומות"
      break;
    case "maxiBus":
      carNameStr = "אוטובוס מקסי 60 מקומות"
      break;
  }
  return carNameStr;
}

export const showCarImage = (carType) => {
  let carImageName = "";

  switch (carType) {
    case "taxi":
      carImageName = "taxi";
      break;
    case "vipTaxi":
      carImageName = "vipTaxi";
      break;
    case "minibus14":
      carImageName = "minibus14";
      break;
    case "minibus19":
      carImageName = "minibus19";
      break;
    case "midibus":
      carImageName = "midibus";
      break;
    case "bus":
      carImageName = "bus";
      break;
    case "maxiBus":
      carImageName = "maxiBus";
      break;
    default:
      carImageName = "maxiBus";
      break;
  }

  const path = "/media/carTypes/";
  const carImagePath = `${path}${encodeURIComponent(carImageName)}.png`; // Assuming the images are in jpg format

  return carImagePath;
};


export const renderTitles = (titlesAndTextArray, styles) => {
  const jsx = titlesAndTextArray?.map((titleAndText, index) => {

      let LogoImage;

      const positionStyles = getPositionStyles(index);  // Get position styles based on index

      switch (index) {
          case 0:
          case 3:
              LogoImage = <Image 
                  className={`${styles.blue_green}`}
                  src={blue_green}
                  height={450}
                  width={300}
                  alt={"saban tours logo in brand colors - blue and green"}
              />
              break;
          case 1:
          case 4:
              LogoImage = <Image
                  className={`${styles.pink_blue}`}
                  src={pink_blue}
                  height={420}
                  width={250}
                  alt={"saban tours logo in brand colors - pink and blue"}
              />
              break;
          case 2:
          case 5:
              LogoImage = <Image
                  className={`${styles.green_pink}`}
                  src={green_pink}
                  height={255}
                  width={150}
                  alt={"saban tours logo in brand colors - green and pink"}
              />
              break;
          case 3:
          case 6:
              LogoImage = <Image
                  className={`${styles.pink_blue}`}
                  src={pink_blue}
                  height={255}
                  width={150}
                  alt={"saban tours logo in brand colors - pink and blue"}
              />
              break;

          default:
              LogoImage = <Image
                  className={`${styles.blue_green}`}
                  src={blue_green}
                  height={450}
                  width={300}
                  alt={"saban tours logo in brand colors - blue and green"}
              />
              break;
      }

      return (
          <div key={index} className={styles.titleSectionWrapper}>
              <div className={styles.transparentIcon} style={positionStyles}>{LogoImage}</div>
              <div className={styles.titleSection}>
                  <h3 className={styles.title}>{titleAndText.title}</h3>
                  <div className={styles.text} dangerouslySetInnerHTML={{ __html: titleAndText.text }} />
              </div>
          </div>
      )
  })
  return jsx;
}



export const getPositionStyles = (index) => {
  switch (index) {
      case 0:
          return { left: '0%', top: '-20%' };
      case 1:
          return { left: '80%', bottom: '20px' };
      case 2:
          return { left: '30%', top: '-20%' };
      case 3:
          return { right: '-50px', top: '10%' };
      case 4:
          return { left: '20%', top: '0%' };
      case 5:
          return { right: '10%', top: '0%' };
      case 6:
          return { left: '0%', top: '0%' };
      default:
          return { left: '35%', top: '20%', transform: "translate(-50%, -50%)" };
  }
};


export const fetchImage = async (imgId) => {
  try {
      const res = await fetch(`${process.env.DATA_SOURCE}/media/${imgId}`, {
          headers: {
              Authorization: `${process.env.WORDPRESSTOKEN}`,
          },
      });
      if (!res.ok) {
          throw new Error(`Failed to fetch image ${imgId}: ${res.statusText}`);
      }
      const data = await res.json();
      return data.source_url;  // Corrected path to access the URL
  } catch (error) {
      console.error(`Error fetching image ${imgId}:`, error);
      return null;  // return null in case of an error
  }
};

export const updateRegionImages = async (reg) => {
  const [desktopImageUrl, mobileImageUrl] = await Promise.all([
      fetchImage(reg?.acf?.bg_image_desktop),
      fetchImage(reg?.acf?.bg_image_mobile)
  ]);
  const newReg = {
      ...reg,
      acf: {
          bg_image_desktop: desktopImageUrl ? desktopImageUrl : null,
          bg_image_mobile: mobileImageUrl ? mobileImageUrl : null
      }
  };
  return newReg;
};

export const metaContent = (spType, title) => {
  let content;
  if (spType === "area") {
      content = `צריכים שירות הסעות ב${title}? הגעתם למקום הנכון! \n 
      שירות הסעות בעיר ${title} מתבטא בנסיעות מהעיר ${title} לעיר אחרת או מעיר אחרת ל${title} או גם שירות נסיעה בתוך ${title}. \n
      עם חברת ההסעות סבן טורס, תגיעו למעוז חפצכם במהירות, נוחות, אדיבות ושירות שעוד לא חוויתם.`
  } else {
      content = `מתעניינים בשירות ${returnTitle(false, title, spType)}? הגעתם למקום הנכון! \n
      עם חברת ההסעות סבן טורס, תקבלו שירות ${returnTitle(false, title, spType)} ברמה הגבוהה ביותר, בהבטחה!\n 
      בתור חברת הסעות מה שמתווה את דרכינו הוא קודם כל שירות איכותי ואדיב, לאחר מכן נוחות ההסעה ולבסוף מחיר הוגן. \n 
      לכן אנחנו מבטיחים לכם שירות מדהים בשירות ${returnTitle(false, title, spType)}.
      `
  }
  return content;
}

export const returnTitle = (isMetaTitle, title, spType) => { 
  title = decodeHTMLEntities(title)
  const baseTitle = spType === "area" 
      ? `שירות הסעות ב${title}` 
      : `שירות ${title}`;
  
  return isMetaTitle ? `סבן טורס | ${baseTitle}` : baseTitle;
};
const emailPreText = "mailto:office@sabantours.co.il?subject=%D7%91%D7%A7%D7%A9%D7%94%20%D7%9C%D7%94%D7%A6%D7%A2%D7%AA%20%D7%9E%D7%97%D7%99%D7%A8&body=%D7%94%D7%99%D7%99%20%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%91%D7%A7%D7%A9%20%D7%94%D7%A6%D7%A2%D7%AA%20%D7%9E%D7%97%D7%99%D7%A8%20%D7%A2%D7%91%D7%95%D7%A8%20%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99%20%D7%94%D7%94%D7%A1%D7%A2%D7%95%D7%AA%20%D7%A9%D7%9C%D7%9B%D7%9D.%0A%0A-%20%D7%A4%D7%A8%D7%98%D7%99%20%D7%94%D7%9E%D7%96%D7%9E%D7%99%D7%9F%0A%D7%A9%D7%9D%20%D7%A4%D7%A8%D7%98%D7%99%3A%20%0A%D7%A9%D7%9D%20%D7%9E%D7%A9%D7%A4%D7%97%D7%94%3A%20%0A%D7%98%D7%9C%D7%A4%D7%95%D7%9F%20%D7%9C%D7%97%D7%96%D7%A8%D7%94%3A%20%0A%0A-%20%D7%A4%D7%A8%D7%98%D7%99%20%D7%94%D7%94%D7%A1%D7%A2%D7%94%0A%D7%AA%D7%90%D7%A8%D7%99%D7%9A%20%D7%94%D7%94%D7%A1%D7%A2%D7%94%3A%20%0A%D7%9B%D7%99%D7%95%D7%95%D7%9F%20%D7%94%D7%94%D7%A1%D7%A2%D7%94%20%3A%20%D7%9B%D7%99%D7%95%D7%95%D7%9F%20%D7%90%D7%97%D7%93%20%2F%20%D7%94%D7%9C%D7%95%D7%9A%20%D7%95%D7%A9%D7%95%D7%91%20-%20%D7%A0%D7%90%20%D7%9C%D7%94%D7%A9%D7%90%D7%99%D7%A8%20%D7%A8%D7%A7%20%D7%90%D7%AA%20%D7%9B%D7%99%D7%95%D7%95%D7%9F%20%D7%94%D7%A0%D7%A1%D7%99%D7%A2%D7%94%20%D7%A9%D7%91%D7%A8%D7%A6%D7%95%D7%A0%D7%9B%D7%9D%20%D7%9C%D7%91%D7%A6%D7%A2%0A%D7%A0%D7%A7%D7%95%D7%93%D7%AA%20%D7%94%D7%AA%D7%99%D7%99%D7%A6%D7%91%D7%95%D7%AA%20%3A%20%0A%D7%A9%D7%A2%D7%AA%20%D7%94%D7%AA%D7%99%D7%99%D7%A6%D7%91%D7%95%D7%AA%3A%20%0A%D7%A0%D7%A7%D7%95%D7%93%D7%AA%20%D7%99%D7%A2%D7%93%3A%20%0A%D7%A2%D7%A6%D7%99%D7%A8%D7%95%D7%AA%20%D7%91%D7%93%D7%A8%D7%9A%20%3A%20%0A-%20%D7%90%D7%9D%20%D7%99%D7%A9%20%D7%A2%D7%A6%D7%99%D7%A8%D7%95%D7%AA%20%D7%91%D7%93%D7%A8%D7%9A%2C%20%D7%A0%D7%90%20%D7%9C%D7%A6%D7%99%D7%99%D7%9F%20%D7%90%D7%AA%20%D7%94%D7%9B%D7%AA%D7%95%D7%91%D7%95%D7%AA."
export const contactWaysJson = [
  {
      desktopNumber: 1,
      mobileNumber: 1,
      type: "phone",
      title: "טלפון",
      value: "קבלו הצעת מחיר טלפונית במספר הטלפון שלנו : 052-798-4133",
      linkText: "התקשר עכשיו",
      linkPath: "tel:+972527984133",
      target: false,
  },
  {
      desktopNumber: 2,
      mobileNumber: 2,
      type: "whatsapp",
      title: "whatsapp",
      value: "דברו איתנו בוואטסאפ וקבלו הצעת מחיר מיידית",
      linkText: "שליחת הודעה",
      linkPath: "https://wa.me/+972527984133",
      target: "_blank",
  },
  {
      desktopNumber: 3,
      mobileNumber: 3,
      type: "onlineForm",
      title: "הצעת מחיר אונליין",
      value: "מלאו פרטי נסיעה בטופס וקבלו הצעת מחיר מיידית אונליין",
      linkText: "הצעת מחיר אונליין",
      linkPath: "/online-offer",
      target: false,
  },
  {
      desktopNumber: 4,
      mobileNumber: 4,
      type: "contactForm",
      title: "טופס השארת פרטים",
      value: "השאירו פרטים בטופס אונליין ונחזור אליכם בהקדם",
      linkText: "מילוי הטופס",
      linkPath: "/contact",
      target: false,
  },
  {
      desktopNumber: 5,
      mobileNumber: 5,
      type: "email",
      title: "אימייל",
      value: "שלחו לנו מייל ונתקדם משם office@sabantours.co.il",
      linkText: "שליחת מייל",
      linkPath: emailPreText,
      target: false,
  },
];

