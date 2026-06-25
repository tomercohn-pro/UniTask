# UniTask — ניהול מטלות חכם לסטודנטים

[![Live Demo](https://img.shields.io/badge/Live%20Demo-unitask--delta.vercel.app-4F46E5?style=for-the-badge&logo=vercel)](https://unitask-delta.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-tomercohn--pro%2FUniTask-181717?style=for-the-badge&logo=github)](https://github.com/tomercohn-pro/UniTask)

---

## 🔗 קישורים

| | קישור |
|---|---|
| 🌐 אפליקציה חיה | [unitask-delta.vercel.app](https://unitask-delta.vercel.app) |
| 💻 קוד מקור | [github.com/tomercohn-pro/UniTask](https://github.com/tomercohn-pro/UniTask) |
| 🗄️ בסיס נתונים | Supabase (PostgreSQL) |

---

## 📋 על הפרויקט

UniTask היא אפליקציית ניהול מטלות לסטודנטים, עם סנכרון מדומה ל-Moodle, סורק מסמכים חכם, וממשק RTL עברי מלא.

### תכונות עיקריות

- **דשבורד מטלות** — הוספה, עריכה, מחיקה ושחזור מטלות
- **סנכרון Moodle** — שאיבת מטלות אוטומטית לפי התואר שהגדרת
- **סורק AI** — העלאת קובץ PDF/Word לזיהוי מטלות ותאריכים אוטומטי
- **ניהול קורסים** — סילבוס וניהול קורסים
- **כניסה עם Google** — אימות מאובטח דרך Supabase Auth
- **עיצוב רספונסיבי** — Sidebar בדסקטופ, Bottom Nav במובייל
- **מצב כהה** — תמיכה מלאה ב-Dark Mode

---

## 🛠️ טכנולוגיות

| טכנולוגיה | שימוש |
|---|---|
| React 19 + Vite | Frontend |
| React Router v7 | ניתוב |
| Supabase | Auth + PostgreSQL + RLS |
| Lucide React | אייקונים |
| Vercel | Hosting |

---

## 🚀 התקנה והרצה מקומית

```bash
# שכפול הפרויקט
git clone https://github.com/tomercohn-pro/UniTask.git
cd UniTask

# התקנת dependencies
npm install

# הגדרת משתני סביבה
cp .env.example .env
# ערוך את .env עם פרטי Supabase שלך

# הרצה מקומית
npm run dev
```

### משתני סביבה נדרשים (`.env`)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📁 מבנה הפרויקט

```
src/
├── components/
│   ├── Sidebar.jsx        # ניווט דסקטופ
│   └── BottomNav.jsx      # ניווט מובייל
├── pages/
│   ├── DashboardPage.jsx  # דשבורד מטלות
│   ├── CoursesPage.jsx    # ניהול קורסים
│   ├── ScannerPage.jsx    # סורק AI
│   ├── SettingsPage.jsx   # הגדרות
│   ├── OnboardingPage.jsx # הגדרת פרופיל
│   └── LoginPage.jsx      # כניסה
├── data/
│   └── mockDegreeData.js  # נתוני תארים ומטלות
├── styles/
│   └── globals.css        # Design tokens + Layout
└── supabaseClient.js      # חיבור Supabase
```

---

## 👤 מפתח

**Tomer Cohen** — [tomercohn-pro](https://github.com/tomercohn-pro)
