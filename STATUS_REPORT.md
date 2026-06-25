# UniTask — דוח סטטוס דרישות

## ✅ מה עומד בדרישות

### מודול 6 — Frontend
- פרויקט React + Vite עובד עם ניווט בין דפים (react-router-dom)
- רכיבים: TaskCard, BottomNav, Header/Avatar, QuickActions (סנכרון Moodle), FilterTabs, TopNavigation, UploadDropzone, ProgressCard, PrimaryButton
- עמודים: Dashboard, Scanner, Courses/Syllabus, Settings, Login, Onboarding
- Design System מלא ב-DESIGN.md עם צבעים, טיפוגרפיה ורווחים
- מצב כהה (Dark Mode) פונקציונלי
- אנימציות ו-Responsive design

### מודול 7 — Data Design
- ישויות מיושמות: Task, Course, User (Auth)
- CRUD מלא למטלות: Create, Read, Update (כותרת/תאריך/דחיפות/הושלם), Delete
- קשרים: User → Tasks (One-to-Many), User → Courses (One-to-Many)

### Walkthrough — Authentication
- התחברות עם Google OAuth דרך Supabase ✅
- הגנה על דפים (redirect לדף Login אם אין session) ✅
- Logout פונקציונלי ✅
- `supabaseClient.js` משתמש במשתני סביבה (import.meta.env) ✅

### Walkthrough — Environment Variables
- קוד לא מכיל keys קשיחים ✅
- קובץ `.env.example` נוצר כהנחיה ✅
- `.env` נוסף ל-`.gitignore` ✅

---

## ⚠️ מה צריך הגדרה ב-Supabase (לא בקוד)

### 1. RLS — Row Level Security (חובה!)
הטבלאות `tasks` ו-`courses` חייבות להפעיל RLS. בלי זה, כל משתמש רואה את הנתונים של כולם.

**צעדים:**
1. Supabase Dashboard → Table Editor → לחץ על `tasks` → Enable RLS
2. חזור על אותו תהליך עבור `courses`
3. צור policies עם ה-SQL הבא:

```sql
-- Tasks: כל משתמש רואה/מנהל רק את שלו
CREATE POLICY "Users can manage their own tasks"
ON tasks FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Courses: כל משתמש רואה/מנהל רק את שלו
CREATE POLICY "Users can manage their own courses"
ON courses FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### 2. עמודת `user_id` בטבלאות
ודא שלטבלאות `tasks` ו-`courses` יש עמודה:
- `user_id` מסוג `uuid` עם Reference ל-`auth.users(id)`

### 3. מבנה טבלת `tasks` (לפי Module 7)
```
id          uuid (Primary Key, default: gen_random_uuid())
title       text (not null)
due_date    date (nullable)
is_urgent   boolean (default: false)
is_completed boolean (default: false)
user_id     uuid (FK → auth.users.id)
course_id   uuid (FK → courses.id, nullable)
created_at  timestamptz (default: now())
```

### 4. מבנה טבלת `courses`
```
id          uuid (Primary Key, default: gen_random_uuid())
name        text (not null)
user_id     uuid (FK → auth.users.id)
created_at  timestamptz (default: now())
```

---

## 📋 הסבר על בחירות עיצוביות

### AI בסורק — מדוע זה keyword matching ולא מודל אמיתי?
הסורק משתמש בזיהוי מילות מפתח (`מטלה`, `תרגיל`, `הגשה`) כי:
- קריאה לחבילת AI כמו OpenAI API דורשת API Key ותשלום
- הפרויקט הוגדר כ-Client-Side בלבד ללא backend server משלו
- מבחינת UX — הזרימה מלאה (upload → scan → save) עובדת

### סנכרון Moodle — מדוע זה סימולציה?
Moodle של הקריה האקדמית אונו לא חושפת API ציבורי. הסנכרון מדמה את החוויה ומכניס נתוני דמה ריאליסטיים. זו בחירה מודעת שמוצגת בצורה נאמנה (UX של progress + status messages).

---

## 🔧 תיקונים שבוצעו בסשן זה

1. **handleDeleteTask** — עכשיו מוסיף את המטלה ל-`deletedTasks` (לוח השחזור היה ריק תמיד)
2. **handleRestoreTask** — עכשיו async, מוסיף חזרה ל-Supabase ומקבל ID חדש
3. **CSS: `--text-h2`** — נוסף (20px) ל-globals.css (חסר גרם לכותרות h2 לקבל ברירת מחדל שגויה)
4. **CSS: `--color-text`** — נוסף (ל-light ו-dark mode) עבור inputs
5. **SyllabusPage: Date.now() כפול** — תוקן עם timestamp יחיד
6. **user_id בהוספת מטלות** — נוסף ל-handleAddTask, Moodle sync, ו-Scanner
7. **fetchTasks** — מסנן לפי user_id (שכבת הגנה נוספת)
8. **.gitignore** — נוסף `.env` ו-`.env.local`
9. **.env.example** — נוצר כהנחיה למשתמשים חדשים
