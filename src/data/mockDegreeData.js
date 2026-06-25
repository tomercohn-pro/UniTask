/**
 * mockDegreeData.js
 * מאגר מידע מדומה של קורסים ומטלות לפי תואר אקדמי.
 * נועד לסנכרון Moodle מדומה — כל לחיצה בוחרת מטלות אקראיות מתוך הרשימה.
 */

export const DEGREES = {

  // ─── מנהל עסקים ───────────────────────────────────────────────
  'ba-general': {
    label: 'מנהל עסקים (כללי)',
    courses: [
      'עקרונות הניהול', 'מבוא לכלכלה עסקית', 'תקשורת עסקית',
      'חשבונאות ניהולית', 'שיווק', 'מימון ארגוני', 'משפט מסחרי', 'אתיקה עסקית',
    ],
    tasks: [
      { title: 'תרגיל: ניתוח SWOT לחברה לבחירתך', daysOffset: 5, is_urgent: false },
      { title: 'סיכום מאמר: תיאוריות ניהול עכשוויות', daysOffset: 8, is_urgent: false },
      { title: 'הגשה: תוכנית עסקית ראשונית', daysOffset: 12, is_urgent: true },
      { title: 'בחינת אמצע סמסטר - עקרונות ניהול', daysOffset: 3, is_urgent: true },
      { title: 'מצגת קבוצתית: אסטרטגיה תחרותית', daysOffset: 14, is_urgent: false },
      { title: 'תרגיל שיווק: ניתוח שוק יעד', daysOffset: 7, is_urgent: false },
      { title: 'קריאת חובה: פרקים 1-4 בניהול ארגוני', daysOffset: 2, is_urgent: false },
      { title: 'עבודה סמינריונית: מנהיגות ואפקטיביות ארגונית', daysOffset: 21, is_urgent: false },
      { title: 'תרגיל חשבונאות: ניתוח דוחות כספיים', daysOffset: 6, is_urgent: false },
      { title: 'הרצאת אורח: כתיבת תקציר מנהלים', daysOffset: 4, is_urgent: false },
    ],
  },

  'ba-mis': {
    label: 'מנהל עסקים - התמחות במערכות מידע',
    courses: [
      'ניתוח ועיצוב מערכות מידע', 'ERP ומערכות ארגוניות', 'בסיסי נתונים ו-SQL',
      'ניהול פרויקטים טכנולוגיים', 'BI ומודיעין עסקי', 'אבטחת מידע ארגונית',
      'שיטות מחקר כמותיות', 'ניהול שינוי טכנולוגי',
    ],
    tasks: [
      { title: 'פרויקט SQL: בניית מסד נתונים לניהול לקוחות', daysOffset: 7, is_urgent: false },
      { title: 'ניתוח מערכת ERP: מקרה בוחן SAP', daysOffset: 10, is_urgent: false },
      { title: 'מצגת BI: דשבורד ניהולי ב-Power BI', daysOffset: 12, is_urgent: true },
      { title: 'עבודה: תכנון ארכיטקטורת מידע לארגון', daysOffset: 14, is_urgent: false },
      { title: 'בחינה: ניתוח ועיצוב מערכות מידע', daysOffset: 3, is_urgent: true },
      { title: 'תרגיל: מיפוי תהליכים עסקיים ב-BPMN', daysOffset: 5, is_urgent: false },
      { title: 'הגשה: מסמך דרישות מערכת (SRS)', daysOffset: 9, is_urgent: false },
      { title: 'קריאה: מאמר על הטמעת מערכות ERP בחברות בינוניות', daysOffset: 2, is_urgent: false },
      { title: 'תרגיל: ניתוח נתונים ב-Excel מתקדם', daysOffset: 4, is_urgent: false },
      { title: 'פרויקט גמר: מערכת מידע ניהולית מלאה', daysOffset: 28, is_urgent: false },
      { title: 'עבודה: מדיניות אבטחת מידע לארגון בינוני', daysOffset: 18, is_urgent: false },
      { title: 'תרגיל: תכנון DFD ו-ERD למערכת הזמנות', daysOffset: 6, is_urgent: false },
    ],
  },

  'ba-marketing': {
    label: 'מנהל עסקים - התמחות שיווק',
    courses: [
      'שיווק דיגיטלי', 'התנהגות צרכנים', 'מחקר שוק', 'ניהול מותג',
      'פרסום ויחסי ציבור', 'שיווק תוכן', 'אנליטיקס שיווקי', 'ניהול מוצר',
    ],
    tasks: [
      { title: 'תוכנית קמפיין שיווקי ברשתות חברתיות', daysOffset: 6, is_urgent: false },
      { title: 'ניתוח התנהגות צרכנים: מחקר שאלון', daysOffset: 9, is_urgent: false },
      { title: 'בניית פרסונות לקוח (Customer Personas)', daysOffset: 5, is_urgent: false },
      { title: 'הגשה: אסטרטגיית מותג לחברת סטארטאפ', daysOffset: 14, is_urgent: true },
      { title: 'ניתוח Google Analytics: דוח תנועה חודשי', daysOffset: 3, is_urgent: false },
      { title: 'עבודה: תכנית שיווק תוכן ל-6 חודשים', daysOffset: 12, is_urgent: false },
      { title: 'מצגת: ניתוח מתחרים בשוק האופנה', daysOffset: 7, is_urgent: false },
      { title: 'תרגיל SEO: מחקר מילות מפתח ואופטימיזציה', daysOffset: 4, is_urgent: false },
      { title: 'פרויקט: קמפיין פרסומי מלא כולל תקציב', daysOffset: 20, is_urgent: false },
      { title: 'בחינה: מחקר שוק ומתודולוגיות', daysOffset: 2, is_urgent: true },
    ],
  },

  'ba-finance': {
    label: 'מנהל עסקים - התמחות מימון',
    courses: [
      'ניהול פיננסי', 'שוק ההון', 'ניתוח השקעות', 'ניהול סיכונים',
      'חשבונאות מתקדמת', 'מיסוי ותכנון מס', 'מימון בינלאומי', 'נגזרים פיננסיים',
    ],
    tasks: [
      { title: 'ניתוח מניה: הכנת דוח due diligence', daysOffset: 7, is_urgent: false },
      { title: 'תרגיל: בניית מודל DCF (Discounted Cash Flow)', daysOffset: 5, is_urgent: false },
      { title: 'עבודה: ניתוח דוחות כספיים של 3 חברות ציבוריות', daysOffset: 10, is_urgent: true },
      { title: 'בחינת אמצע: ניהול פיננסי', daysOffset: 3, is_urgent: true },
      { title: 'סימולציית מסחר: תיק השקעות וירטואלי', daysOffset: 14, is_urgent: false },
      { title: 'מצגת: ניהול סיכוני אשראי בבנק מסחרי', daysOffset: 8, is_urgent: false },
      { title: 'תרגיל Excel: מודל תמחיר אופציות Black-Scholes', daysOffset: 6, is_urgent: false },
      { title: 'הגשה: תכנית מיסוי לעסק עצמאי', daysOffset: 11, is_urgent: false },
      { title: 'קריאת חובה: דוח יציבות פיננסית של בנק ישראל', daysOffset: 2, is_urgent: false },
      { title: 'פרויקט גמר: המלצות השקעה לקרן פנסיה', daysOffset: 25, is_urgent: false },
    ],
  },

  'ba-hr': {
    label: 'מנהל עסקים - התמחות משאבי אנוש',
    courses: [
      'גיוס ומיון', 'פיתוח ארגוני', 'דיני עבודה', 'תכנון כוח אדם',
      'הדרכה ופיתוח', 'שכר ותגמול', 'ניהול ביצועים', 'תרבות ארגונית',
    ],
    tasks: [
      { title: 'עבודה: עיצוב תהליך גיוס לתפקיד מנהלי', daysOffset: 6, is_urgent: false },
      { title: 'ניתוח מקרה: ניהול קונפליקט בין עובדים', daysOffset: 8, is_urgent: false },
      { title: 'הגשה: תוכנית הדרכה שנתית לצוות מכירות', daysOffset: 12, is_urgent: true },
      { title: 'תרגיל דיני עבודה: ניתוח חוזה עבודה', daysOffset: 4, is_urgent: false },
      { title: 'מצגת: מודלים לניהול ביצועים (OKR vs KPI)', daysOffset: 9, is_urgent: false },
      { title: 'ראיון גיוס מדומה + משוב', daysOffset: 5, is_urgent: false },
      { title: 'עבודה: מחקר תרבות ארגונית בחברת Hi-Tech', daysOffset: 15, is_urgent: false },
      { title: 'בחינה: דיני עבודה ויחסי עבודה', daysOffset: 3, is_urgent: true },
      { title: 'תכנון מדיניות שכר ותגמול לחברת סטארטאפ', daysOffset: 10, is_urgent: false },
    ],
  },

  // ─── מדעי המחשב ────────────────────────────────────────────────
  'cs': {
    label: 'מדעי המחשב',
    courses: [
      'מבני נתונים ואלגוריתמים', 'תכנות מונחה עצמים (Java)', 'מערכות הפעלה',
      'רשתות תקשורת', 'בסיסי נתונים', 'תורת הסיבוכיות', 'בינה מלאכותית', 'ממשקי משתמש',
    ],
    tasks: [
      { title: 'תרגיל: מימוש עץ AVL ב-Java', daysOffset: 5, is_urgent: false },
      { title: 'פרויקט: שרת TCP/UDP מרובה חיבורים', daysOffset: 10, is_urgent: false },
      { title: 'בחינת אמצע: אלגוריתמים ומבני נתונים', daysOffset: 3, is_urgent: true },
      { title: 'תרגיל SQL: שאילתות מורכבות ואופטימיזציה', daysOffset: 6, is_urgent: false },
      { title: 'פרויקט OS: מימוש Scheduler בסביבת Linux', daysOffset: 14, is_urgent: true },
      { title: 'הגשה: ניתוח סיבוכיות של אלגוריתמי מיון', daysOffset: 7, is_urgent: false },
      { title: 'מימוש BFS/DFS על גרף לא מכוון', daysOffset: 4, is_urgent: false },
      { title: 'תרגיל AI: מימוש Minimax עם Alpha-Beta Pruning', daysOffset: 9, is_urgent: false },
      { title: 'פרויקט UI: אפליקציית ניהול משימות ב-React', daysOffset: 18, is_urgent: false },
      { title: 'בחינה: בסיסי נתונים ו-SQL', daysOffset: 2, is_urgent: true },
      { title: 'עבודה: אבטחת מידע — ניתוח פגיעויות OWASP Top 10', daysOffset: 12, is_urgent: false },
    ],
  },

  'software-eng': {
    label: 'הנדסת תוכנה',
    courses: [
      'הנדסת תוכנה (Software Engineering)', 'בדיקות תוכנה', 'ארכיטקטורת מערכות',
      'DevOps ו-CI/CD', 'פיתוח Agile/Scrum', 'עיצוב ממשקי משתמש (UX)',
      'קריפטוגרפיה ואבטחה', 'מחשוב ענן',
    ],
    tasks: [
      { title: 'פרויקט: עיצוב מערכת מיקרו-שירותים (Microservices)', daysOffset: 14, is_urgent: false },
      { title: 'כתיבת Unit Tests ל-REST API (Jest)', daysOffset: 5, is_urgent: false },
      { title: 'הגדרת Pipeline ב-GitHub Actions', daysOffset: 7, is_urgent: false },
      { title: 'תרגיל Design Patterns: Singleton, Factory, Observer', daysOffset: 4, is_urgent: false },
      { title: 'Sprint Review: הצגת Sprint 3 לסטייקהולדרים', daysOffset: 3, is_urgent: true },
      { title: 'מסמך ארכיטקטורה: מערכת הזמנות מבוזרת', daysOffset: 10, is_urgent: false },
      { title: 'פרויקט: Dockerize אפליקציית Node.js', daysOffset: 6, is_urgent: false },
      { title: 'בחינה: בדיקות תוכנה ו-QA', daysOffset: 2, is_urgent: true },
      { title: 'קוד ריוויו: Peer Review לפרויקט שיתופי', daysOffset: 5, is_urgent: false },
      { title: 'הגשה: עבודה סמינריונית על Agile בארגונים גדולים', daysOffset: 20, is_urgent: false },
    ],
  },

  'electrical-eng': {
    label: 'הנדסת חשמל ואלקטרוניקה',
    courses: [
      'מעגלים חשמליים', 'אלקטרוניקה אנלוגית', 'עיבוד אותות', 'אלקטרומגנטיקה',
      'מערכות בקרה', 'תקשורת דיגיטלית', 'VLSI ועיצוב שבבים', 'אנרגיה מתחדשת',
    ],
    tasks: [
      { title: 'תרגיל: ניתוח מעגל RC בתחום התדר', daysOffset: 4, is_urgent: false },
      { title: 'פרויקט: בניית מגבר מפלצת בלוח ניסויים', daysOffset: 9, is_urgent: false },
      { title: 'הגשה: סימולציית SPICE למעגל מגבר-OP AMP', daysOffset: 6, is_urgent: false },
      { title: 'בחינת אמצע: אלקטרומגנטיקה ומשוואות מקסוול', daysOffset: 2, is_urgent: true },
      { title: 'תרגיל עיבוד אותות: FFT ו-IFFT ב-MATLAB', daysOffset: 7, is_urgent: false },
      { title: 'פרויקט: מערכת בקרה PID ל-DC Motor', daysOffset: 12, is_urgent: false },
      { title: 'הגשה: תכנון מערכת סולארית לבית מגורים', daysOffset: 15, is_urgent: false },
      { title: 'עבודה מעבדה: מדידת ספקטרום FM', daysOffset: 3, is_urgent: false },
      { title: 'תרגיל VHDL: מימוש מונה סינכרוני', daysOffset: 8, is_urgent: false },
    ],
  },

  'industrial-eng': {
    label: 'הנדסה תעשייה וניהול',
    courses: [
      'חקר ביצועים', 'ניהול ייצור ותפעול', 'שרשרת אספקה', 'בטיחות תעסוקתית',
      'סטטיסטיקה הנדסית', 'איכות ו-Six Sigma', 'סימולציה', 'הנדסת גורמי אנוש',
    ],
    tasks: [
      { title: 'תרגיל: מודל תכנות לינארי לתכנון ייצור', daysOffset: 5, is_urgent: false },
      { title: 'פרויקט: ניתוח שרשרת ערך (VSM) בפס ייצור', daysOffset: 12, is_urgent: false },
      { title: 'הגשה: תוכנית שיפור תהליך לפי Lean Six Sigma', daysOffset: 14, is_urgent: true },
      { title: 'בחינה: חקר ביצועים ותכנות לינארי', daysOffset: 3, is_urgent: true },
      { title: 'סימולציית Arena: מערכת תורים במחסן', daysOffset: 8, is_urgent: false },
      { title: 'מצגת: ניהול שרשרת אספקה — מקרה Amazon', daysOffset: 6, is_urgent: false },
      { title: 'תרגיל: תוכנית בקרת איכות SPC לקו ייצור', daysOffset: 7, is_urgent: false },
      { title: 'עבודה: מחקר FMEA לציוד ייצור תעשייתי', daysOffset: 10, is_urgent: false },
      { title: 'תרגיל ארגונומיה: הערכת עומס פיזי בקו הרכבה', daysOffset: 4, is_urgent: false },
    ],
  },

  // ─── משפטים ────────────────────────────────────────────────────
  'law': {
    label: 'משפטים (LLB)',
    courses: [
      'דיני חוזים', 'דיני נזיקין', 'משפט חוקתי', 'משפט פלילי',
      'דיני קניין', 'דיני עבודה', 'דיני חברות', 'סדר הדין האזרחי',
    ],
    tasks: [
      { title: 'ניתוח פסיקה: פס"ד בנושא הפרת חוזה', daysOffset: 5, is_urgent: false },
      { title: 'עבודה סמינריונית: חופש הביטוי מול לשון הרע', daysOffset: 18, is_urgent: false },
      { title: 'תרגיל: ניסוח כתב תביעה בנושא נזיקין', daysOffset: 7, is_urgent: true },
      { title: 'בחינת אמצע: דיני חוזים', daysOffset: 3, is_urgent: true },
      { title: 'קריאת חובה: פרקים נבחרים בחוק החוזים', daysOffset: 2, is_urgent: false },
      { title: 'הכנה לוויכוח משפטי (Moot Court)', daysOffset: 10, is_urgent: false },
      { title: 'ניתוח חקיקה: תיקון לחוק הגנת הפרטיות', daysOffset: 6, is_urgent: false },
      { title: 'מצגת: השוואת מערכות משפט — קונטיננטלי מול קומון לו', daysOffset: 9, is_urgent: false },
      { title: 'תרגיל: ניסוח הסכם שכירות ועיון בסעיפים בעייתיים', daysOffset: 4, is_urgent: false },
      { title: 'עבודה: הגנת עובדים בעידן הגיג Economy', daysOffset: 14, is_urgent: false },
    ],
  },

  // ─── פסיכולוגיה ────────────────────────────────────────────────
  'psychology': {
    label: 'פסיכולוגיה',
    courses: [
      'פסיכולוגיה חברתית', 'פסיכולוגיה קוגניטיבית', 'מחקר ושיטות', 'פסיכופתולוגיה',
      'פסיכולוגיה התפתחותית', 'עצות ופסיכותרפיה', 'נוירופסיכולוגיה', 'פסיכולוגיה ארגונית',
    ],
    tasks: [
      { title: 'סיכום מאמר: תיאוריית ההתקשרות של בולבי', daysOffset: 4, is_urgent: false },
      { title: 'ניסוי מחקרי: הטיות קוגניטיביות בקבלת החלטות', daysOffset: 9, is_urgent: false },
      { title: 'הגשה: תיאור מקרה קליני (Case Study)', daysOffset: 12, is_urgent: true },
      { title: 'בחינה: פסיכופתולוגיה ו-DSM-5', daysOffset: 3, is_urgent: true },
      { title: 'תרגיל: עיצוב שאלון מחקרי ובדיקת מהימנות', daysOffset: 7, is_urgent: false },
      { title: 'קריאה: פרקים ב-Thinking, Fast and Slow', daysOffset: 2, is_urgent: false },
      { title: 'עבודה: ניתוח מחקר אורכי על התפתחות ילדים', daysOffset: 14, is_urgent: false },
      { title: 'מצגת: תיאוריות מוטיבציה בפסיכולוגיה ארגונית', daysOffset: 8, is_urgent: false },
      { title: 'תרגיל: ניתוח SPSS — מחקר כמותי', daysOffset: 5, is_urgent: false },
    ],
  },

  // ─── כלכלה ─────────────────────────────────────────────────────
  'economics': {
    label: 'כלכלה',
    courses: [
      'מיקרוכלכלה', 'מקרוכלכלה', 'כלכלה בינלאומית', 'כלכלה מוניטרית',
      'כלכלה התנהגותית', 'אקונומטריקה', 'כלכלה ציבורית', 'תורת המשחקים',
    ],
    tasks: [
      { title: 'תרגיל: ניתוח שיווי משקל בשוק תחרותי ומונופוליסטי', daysOffset: 5, is_urgent: false },
      { title: 'הגשה: סקירה של מדיניות פיסקלית בישראל', daysOffset: 10, is_urgent: false },
      { title: 'בחינה: מיקרוכלכלה', daysOffset: 2, is_urgent: true },
      { title: 'תרגיל אקונומטריקה: רגרסיה ב-R', daysOffset: 7, is_urgent: false },
      { title: 'מצגת: משחק האולטימטום — ניסוי כלכלה התנהגותית', daysOffset: 6, is_urgent: false },
      { title: 'עבודה: ניתוח השפעת ריבית בנק ישראל על שוק הדיור', daysOffset: 15, is_urgent: false },
      { title: 'קריאת חובה: "הון בעשרים ואחת" — סיכום פרק 3', daysOffset: 3, is_urgent: false },
      { title: 'תרגיל תורת משחקים: שיווי משקל נאש', daysOffset: 8, is_urgent: false },
      { title: 'עבודה: מודל IS-LM ויישום לכלכלה ישראלית', daysOffset: 12, is_urgent: false },
    ],
  },

  // ─── חינוך ─────────────────────────────────────────────────────
  'education': {
    label: 'חינוך והוראה',
    courses: [
      'מבוא לפדגוגיה', 'פסיכולוגיה חינוכית', 'הוראה מתמחה', 'הערכה ומדידה',
      'חינוך מיוחד', 'טכנולוגיה בחינוך', 'ניהול כיתה', 'חינוך לערכים',
    ],
    tasks: [
      { title: 'עבודת תצפית: תצפית בשיעור ומשוב מודרך', daysOffset: 5, is_urgent: false },
      { title: 'תכנית שיעור: יחידה של 5 שיעורים בנושא אוכלוסיות', daysOffset: 8, is_urgent: false },
      { title: 'הגשה: עבודה על תיאוריות למידה (ויגוצקי, פיאז\'ה)', daysOffset: 10, is_urgent: true },
      { title: 'ניתוח כלי הערכה: בחינה מול פורטפוליו', daysOffset: 6, is_urgent: false },
      { title: 'הכנת משחק חינוכי לכיתה ד\'', daysOffset: 7, is_urgent: false },
      { title: 'בחינה: פסיכולוגיה חינוכית', daysOffset: 3, is_urgent: true },
      { title: 'מצגת: שימוש ב-AI ככלי הוראה בכיתה', daysOffset: 9, is_urgent: false },
      { title: 'עבודה: אסטרטגיות לניהול כיתה הטרוגנית', daysOffset: 14, is_urgent: false },
      { title: 'תרגיל: עיצוב משימת חקר לכיתה', daysOffset: 4, is_urgent: false },
    ],
  },

  // ─── סיעוד ─────────────────────────────────────────────────────
  'nursing': {
    label: 'סיעוד',
    courses: [
      'אנטומיה ופיזיולוגיה', 'פרמקולוגיה', 'סיעוד בסיסי', 'סיעוד פנימי וכירורגי',
      'סיעוד ילדים', 'חדר מיון וטיפול נמרץ', 'אתיקה רפואית', 'מחקר סיעודי',
    ],
    tasks: [
      { title: 'הגשה: דוח ניתוח מקרה פרמקולוגי', daysOffset: 6, is_urgent: false },
      { title: 'בחינה: אנטומיה ופיזיולוגיה — מערכת הלב', daysOffset: 2, is_urgent: true },
      { title: 'עבודת מעשה: תרגול פרוצדורות סטרילי', daysOffset: 5, is_urgent: false },
      { title: 'מצגת: תוכנית סיעודית למטופל כרוני (סוכרת Type 2)', daysOffset: 9, is_urgent: true },
      { title: 'סיכום קריאה: מחקר על מניעת זיהומים בבית חולים', daysOffset: 3, is_urgent: false },
      { title: 'עבודה: אתיקה סיעודית — דילמות בסוף חיים', daysOffset: 13, is_urgent: false },
      { title: 'תרגיל: חישוב מינון תרופות ורישום ממוחשב', daysOffset: 4, is_urgent: false },
      { title: 'סימולציה: OSCE — בדיקת אחות מלאה', daysOffset: 7, is_urgent: true },
    ],
  },

  // ─── תקשורת ────────────────────────────────────────────────────
  'communication': {
    label: 'תקשורת ועיתונאות',
    courses: [
      'עיתונאות דיגיטלית', 'תיאוריות תקשורת', 'עריכה וכתיבה', 'רדיו וטלוויזיה',
      'יחסי ציבור', 'פוליטיקה ומדיה', 'פרסום וקריאייטיב', 'תקשורת חברתית ורשתות',
    ],
    tasks: [
      { title: 'כתיבת כתבת עיון על נושא חברתי עכשווי (800 מילה)', daysOffset: 5, is_urgent: false },
      { title: 'הגשה: ניתוח שיח רשתות חברתיות', daysOffset: 7, is_urgent: false },
      { title: 'עריכת קטע ראיון לרדיו (3 דקות)', daysOffset: 6, is_urgent: false },
      { title: 'בחינה: תיאוריות תקשורת', daysOffset: 3, is_urgent: true },
      { title: 'עבודה: תוכנית יחסי ציבור לקמפיין חברתי', daysOffset: 12, is_urgent: false },
      { title: 'יצירת קמפיין ויראלי בתקציב אפס', daysOffset: 9, is_urgent: false },
      { title: 'תרגיל: כתיבת ידיעה תקשורתית ועמידה בדדליין', daysOffset: 2, is_urgent: true },
      { title: 'ניתוח תוכן: כיסוי עיתונאי של אירוע בחירות', daysOffset: 10, is_urgent: false },
      { title: 'פרויקט: עיתון דיגיטלי קבוצתי — מהדורה ראשונה', daysOffset: 18, is_urgent: false },
    ],
  },

  // ─── אדריכלות ───────────────────────────────────────────────────
  'architecture': {
    label: 'אדריכלות',
    courses: [
      'עיצוב אדריכלי א\'', 'היסטוריה של האדריכלות', 'טכנולוגיות בנייה', 'סטטיקה ובינוי',
      'תכנון עירוני', 'ייעוץ אנרגטי', 'BIM ו-Revit', 'אדריכלות נוף',
    ],
    tasks: [
      { title: 'פרויקט עיצוב: בית מגורים חד-משפחתי — תוכניות וחזיתות', daysOffset: 14, is_urgent: false },
      { title: 'מודל ב-Revit: בניין ציבורי 3 קומות', daysOffset: 10, is_urgent: true },
      { title: 'הגשת מקט: שכונת מגורים בקנה מידה 1:500', daysOffset: 12, is_urgent: false },
      { title: 'בחינה: סטטיקה ומבנים', daysOffset: 3, is_urgent: true },
      { title: 'עבודה: ניתוח מבנה היסטורי (בזיליקה פלשתינאית)', daysOffset: 7, is_urgent: false },
      { title: 'תרגיל: חישוב אנרגיה ובידוד תרמי לבניין ירוק', daysOffset: 8, is_urgent: false },
      { title: 'מצגת: חזון תכנוני לרחוב עורקי בתל אביב', daysOffset: 9, is_urgent: false },
      { title: 'הכנת לוח B0: פרויקט גמר שנה א\'', daysOffset: 21, is_urgent: false },
    ],
  },

  // ─── עבודה סוציאלית ────────────────────────────────────────────
  'social-work': {
    label: 'עבודה סוציאלית',
    courses: [
      'תיאוריות בעבודה סוציאלית', 'עבודה סוציאלית פרטנית', 'עבודה סוציאלית קהילתית',
      'מדיניות רווחה', 'ניהול שירותים חברתיים', 'עבודה עם קשישים', 'ילדים בסיכון', 'אתיקה מקצועית',
    ],
    tasks: [
      { title: 'הגשה: ניתוח מקרה — פגיעה במשפחה', daysOffset: 7, is_urgent: true },
      { title: 'עבודה: מדיניות רווחה ואי-שוויון חברתי בישראל', daysOffset: 12, is_urgent: false },
      { title: 'ביקור שדה: תצפית במרכז קהילתי + דוח', daysOffset: 8, is_urgent: false },
      { title: 'מצגת: עבודה עם ניצולי אלימות במשפחה', daysOffset: 9, is_urgent: false },
      { title: 'בחינה: תיאוריות בעבודה סוציאלית', daysOffset: 3, is_urgent: true },
      { title: 'תוכנית התערבות: סיוע לנוער בסיכון', daysOffset: 14, is_urgent: false },
      { title: 'דיון: דילמה אתית — דיווח חובה נגד רצון מטופל', daysOffset: 5, is_urgent: false },
      { title: 'קריאה: ממשק בין עו"ס לרשויות חוק', daysOffset: 4, is_urgent: false },
    ],
  },

  // ─── ביוטכנולוגיה ──────────────────────────────────────────────
  'biotech': {
    label: 'ביוטכנולוגיה ומדעי החיים',
    courses: [
      'ביולוגיה מולקולרית', 'גנטיקה', 'ביוכימיה', 'מיקרוביולוגיה',
      'ביואינפורמטיקה', 'ביוטכנולוגיה תעשייתית', 'ביואתיקה', 'כימיה אורגנית',
    ],
    tasks: [
      { title: 'דוח מעבדה: PCR לזיהוי מוטציה גנטית', daysOffset: 5, is_urgent: false },
      { title: 'עבודה: ניתוח רצף DNA ב-BLAST', daysOffset: 7, is_urgent: false },
      { title: 'בחינה: ביוכימיה — מטבוליזם ואנזימים', daysOffset: 3, is_urgent: true },
      { title: 'פרויקט: תרבית תאים וניתוח viability', daysOffset: 10, is_urgent: false },
      { title: 'מצגת: עריכה גנטית CRISPR-Cas9 — הזדמנויות וסיכונים', daysOffset: 8, is_urgent: false },
      { title: 'הגשה: ביואתיקה — ניסויים בבעלי חיים', daysOffset: 12, is_urgent: false },
      { title: 'תרגיל ביואינפורמטיקה: יישור רצפים מרובה (Multiple Alignment)', daysOffset: 6, is_urgent: false },
      { title: 'דוח ניסוי: SDS-PAGE לזיהוי חלבונים', daysOffset: 4, is_urgent: false },
    ],
  },

  // ─── חשבונאות ───────────────────────────────────────────────────
  'accounting': {
    label: 'חשבונאות',
    courses: [
      'חשבונאות פיננסית א\'', 'חשבונאות ניהולית', 'תקני IFRS', 'ביקורת חשבונות',
      'מיסוי הכנסה', 'חשבונאות עלויות', 'ניתוח דוחות כספיים', 'חשבונאות דיגיטלית',
    ],
    tasks: [
      { title: 'תרגיל: רישום יומן ספר ראשי — 30 פעולות', daysOffset: 3, is_urgent: false },
      { title: 'הכנת דוח רווח והפסד מלא לחברה פיקטיבית', daysOffset: 7, is_urgent: false },
      { title: 'עבודה: ניתוח דוחות IFRS של חברה ציבורית', daysOffset: 10, is_urgent: true },
      { title: 'בחינה: חשבונאות פיננסית א\'', daysOffset: 2, is_urgent: true },
      { title: 'תרגיל: חישוב נקודת האיזון ותכנון עלויות', daysOffset: 5, is_urgent: false },
      { title: 'עבודת ביקורת: תוכנית ביקורת שנתית לחברת מסחר', daysOffset: 13, is_urgent: false },
      { title: 'מצגת: טכנולוגיה בחשבונאות — RPA ו-AI בביקורת', daysOffset: 9, is_urgent: false },
      { title: 'תרגיל מיסוי: חישוב מס הכנסה ליחיד ולחברה', daysOffset: 6, is_urgent: false },
      { title: 'הכנת מאזן + תזרים מזומנים', daysOffset: 8, is_urgent: false },
    ],
  },

  // ─── מדעי הנתונים ──────────────────────────────────────────────
  'data-science': {
    label: 'מדעי הנתונים ובינה מלאכותית',
    courses: [
      'למידת מכונה', 'עיבוד שפה טבעית (NLP)', 'רשתות עצביות עמוקות', 'סטטיסטיקה חישובית',
      'ויזואליזציה של נתונים', 'Big Data ו-Spark', 'Computer Vision', 'אתיקה ב-AI',
    ],
    tasks: [
      { title: 'פרויקט: מודל Classification לזיהוי ספאם', daysOffset: 7, is_urgent: false },
      { title: 'תרגיל: ניתוח EDA ו-Feature Engineering ב-pandas', daysOffset: 4, is_urgent: false },
      { title: 'הגשה: מודל Regression לחיזוי מחירי דיור', daysOffset: 10, is_urgent: true },
      { title: 'בחינה: סטטיסטיקה חישובית ו-Bayesian Methods', daysOffset: 3, is_urgent: true },
      { title: 'פרויקט NLP: ניתוח סנטימנט לביקורות', daysOffset: 12, is_urgent: false },
      { title: 'תרגיל CNN: זיהוי תמונות ב-TensorFlow', daysOffset: 9, is_urgent: false },
      { title: 'ויזואליזציה: דשבורד אינטראקטיבי ב-Plotly', daysOffset: 5, is_urgent: false },
      { title: 'עבודה: אתיקה ב-AI — הטיות באלגוריתמים של קבלת החלטות', daysOffset: 14, is_urgent: false },
      { title: 'פרויקט Big Data: ניתוח לוגים ב-Apache Spark', daysOffset: 16, is_urgent: false },
      { title: 'תרגיל: Hyperparameter Tuning עם Grid Search', daysOffset: 6, is_urgent: false },
    ],
  },
};

/**
 * מחזיר רשימה אקראית של מטלות לפי תואר.
 * @param {string} degreeKey - מזהה התואר (למשל 'ba-mis')
 * @param {number} count - כמה מטלות להחזיר (ברירת מחדל: 5)
 * @returns {{ courseNames: string[], taskRows: object[] }}
 */
export function getMockSyncData(degreeKey, count = 5) {
  const degree = DEGREES[degreeKey] ?? DEGREES['ba-mis'];
  const today = new Date();

  // ערבוב רנדומלי של מטלות
  const shuffled = [...degree.tasks].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  const taskRows = selected.map((t) => {
    // הוספת וריאציה קטנה לתאריך (±2 ימים)
    const variance = Math.floor(Math.random() * 5) - 2;
    const finalOffset = Math.max(1, t.daysOffset + variance);
    return {
      title: t.title,
      due_date: new Date(today.getTime() + finalOffset * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      is_urgent: t.is_urgent,
      is_completed: false,
    };
  });

  return {
    courseNames: degree.courses,
    taskRows,
    degreeLabel: degree.label,
  };
}

/** רשימת תארים לתצוגה ב-dropdown */
export const DEGREE_OPTIONS = Object.entries(DEGREES).map(([value, { label }]) => ({
  value,
  label,
}));
