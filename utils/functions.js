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
  var parser = new DOMParser();
  var doc = parser.parseFromString(text, "text/html");
  return doc.documentElement.textContent;
};
