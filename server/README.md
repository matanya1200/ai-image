# Server (FastAPI) – AI-IMAGE Backend

תיקיית ה-`server/` מכילה את קוד ה-backend של מערכת AI-IMAGE, המפותח באמצעות **FastAPI**. השרת אחראי על ניהול בסיס הנתונים, חשיפת ממשקי API עבור אפליקציות ה-web והמובייל, וביצוע לוגיקה עסקית מורכבת, כולל אינטגרציה עם מודלי בינה מלאכותית.

---

## 📚 תוכן העניינים

- [📁 מבנה תיקיות](#📁-מבנה-תיקיות)
- [🧰 טכנולוגיות](#🧰-טכנולוגיות)
- [⚙️ התקנה והרצה](#⚙️-התקנה-והרצה)
- [🌐 נקודות קצה (API)](#🌐-נקודות-קצה-api)
- [🧠 מודלי AI](#🧠-מודלי-ai)
- [🔄 משימות רקע ו-Utilities](#🔄-משימות-רקע-ו-utilities)
- [🔐 משתני סביבה](#🔐-משתני-סביבה)

---

## 📁 מבנה תיקיות

server/
├── ai/                      # מודלי AI ואינטגרציות (ollama, Gemini)
│   ├── init.py              # אתחול מנוע AI ברירת מחדל 
│   ├── ai_interface.py      # ממשק כללי למודלי AI 
│   ├── gemini_chat.py       # תקשורת עם מודל Gemini 
│   └── ollama_chat.py       # תקשורת עם מודל Ollama 
├── controllers/             # לוגיקה עסקית ונקודות קצה (API)
│   ├── ai.py
│   ├── albums.py
│   ├── auth.py
│   ├── commits.py
│   ├── cloudinary.py
│   ├── images.py
│   └── users.py
├── data/                    # קבצי נתונים (לדוגמה, רשימת מילים פוגעניות)
│   └── toxic_words.txt
├── static/                  # קבצים סטטיים (אם יש צורך)
├── utils/                   # קבצי עזר ופונקציות שירות
│   ├── auth_utils.py        # אימות סיסמאות (bcrypt) ו-JWT 
│   ├── background_jobs.py   # בדיקת חסימת משתמשים 
│   ├── background_commits_jobs.py # בדיקת ומחיקת תגובות פוגעניות 
│   ├── crypto_utils.py      # הצפנה ופענוח של Cloudinary API secret 
│   ├── generate-image.py    # יצירת תמונות מתיאור טקסטואלי (Stable Diffusion) 
│   ├── hebrew_toxic_words.py # רשימת מילים פוגעניות בעברית 
│   ├── toxicity_model.py    # בדיקת תגובות פוגעניות (מודל BERT) 
│   └── promissions.py       # בדיקת הרשאות גישה 
├── .env                     # קובץ משתני סביבה
├── database.py              # הגדרות חיבור לבסיס הנתונים
├── main.py                  # נקודת הכניסה של השרת (FastAPI app)
└── requirements.txt         # רשימת התלויות של הפרויקט

---

## 🧰 טכנולוגיות

* **FastAPI**: פריימוורק מהיר לבניית APIs ב-Python.
* **SQLAlchemy**: ORM (Object Relational Mapper) לניהול אינטראקציה עם בסיס הנתונים.
* **Bcrypt**: להצפנת סיסמאות משתמשים.
* **PyJWT**: לאימות וקידוד טוקני JWT.
* **Diffusers (StableDiffusionPipeline)**: ליצירת תמונות מתיאור טקסטואלי[cite: 45, 230].
* **Hugging Face Transformers (toxic-bert)**: לזיהוי טקסטים פוגעניים[cite: 244].
* **Ollama/Gemini**: למנועי AI נוספים בצאט[cite: 55, 57, 58].
* **Python-dotenv**: לניהול משתני סביבה.

---

## ⚙️ התקנה והרצה

כדי להפעיל את השרת, בצע את השלבים הבאים:

1.  **וודא שאתה נמצא בתיקיית `server/`:**
    ```bash
    cd server
    ```

2.  **הפעל את הסביבה הווירטואלית:**
    ```bash
    .\venv\Scripts\Activate  # ב-Windows
    # source venv/bin/activate  # ב-macOS/Linux
    ```

3.  **התקן את כל התלויות הנדרשות:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **צור קובץ `.env`** בתיקיית `server/` והגדר את משתני הסביבה הנדרשים (ראה סעיף [משתני סביבה](#משתני-סביבה)).

5.  **הפעל את השרת:**
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    השרת יפעל על `http://10.0.0.18:8000` באופן מקומי[cite: 39].

---

## 🌐 נקודות קצה (API)

השרת חושף מגוון רחב של נקודות קצה המספקות את הפונקציונליות המלאה של המערכת. נקודות הקצה מאורגנות לפי נושאים וכוללות הרשאות גישה מתאימות (אורח, משתמש, מנהל).

**Base URL**: `http://10.0.0.18:8000` [cite: 39]

מסלול	סוג בקשה	הרשאה	תיאור
			
Base URL/auth			
/register	POST	-	רישום למערכת
צרך להזין שם, אי-מייל וסיסמה
/login	POST	-	כניסה למערכת אם אין כבר משתמש מחובר צריך להזין אי-מייל וסיסמה
מוחזר טוקן, מזהה משתמש, תפקיד
/logout	POST	המשתמש	יציאה מהחשבון ושנוי is_logged_in = FALSE

			
Base URL/users			
/	GET	מנהל	קבלת כל המשתמשים במערכת
/me	GET	המשתמש עצמו	קבלת כל הפרטים על המשתמש
/me/name	PUT	המשתמש עצמו	עריכת השם משתמש
/block	PUT 	מנהל	חסימת/שיחרור משתמש והוספת הודעה
/me	DELETE	המשתמש עצמו	מחיקת המשתמש
/notifications/{user_id}/not_read	GET	-	קבלת כל ההודעת במערכת ששייכים למשתמש  שלא נקראו
/notifications/{user_id}	GET	-	קבלת כל ההודעת במערכת ששיכים למשתמש
/notifications/{notification_id}/read	PUT	-	סימון הודעה כנקראה
			
Base URL/images			
/addImage	POST	המשתמש	הוספת תמונה צריך להזין שם תמונה וכתובן  URL
/AIgenerate	POST	המשתמש	הוספת תמונה שנוצרת על ידי AI צריך להזין שם תמונה ותיאור של התמונה(הAI בונה את התמונה בהתאם לתיאור)
/upload_image_file	POST	המשתמש	הוספת תמונה כקובץ
צריך להזין שם מתמונה ואת הקובץ
/me	GET	המשתמש	קבלת שם וurl על כל התמונות של המשתמש
/public	GET	-	קבלת שם, url ,תאריך עדכון ושם יוצר התמונה על התמונות שהם פומביות ולא חסומות
/{image_id}	GET	המשתמש	קבלת כל הפרטים על תמונה מסוימת לפי id אם התמונה שלך
/images/search	GET	-	קבלת תמונות לפי חיפוש
/{image_id}/rating	GET	-	קבלת ממוצע תגובות של תמונה
/{image_id}/rename	PUT	המשתמש	ערכית שם התמונה
/{image_id}/block	PUT	מנהל	חסימת תמונה
/{image_id}/public	PUT	המשתמש	שינוי סטטוס האם פומבי
/{image_id}/assign	PUT	המשתמש	הכנסת תמונה לאלבום
/{image_id}	DELETE	המשתמש	מחיקת תמונה
/images/blocked	GET	מנהל	מקבל את התמונות הפומביות החסומות
			
			
			
Base URL/commits			
/	GET	מנהל	קבלת כל התגובות על כל התמונות
/{image_id}	GET	-	קבלת כל התגובות על תמונה מסוימת
/{commit_id}	GET	המשתמש	קבלת פרטי תגובה
/{image_id}	POST	המשתמש	הוספת תגובה ודירוג על תמונה מסוימת
/{commit_id}	PUT	המשתמש	ערכית תגובה או דירוג של המשתמש עצמו
/{commit_id}	DELETE	המשתמש או מנהל	מחיקת תגובה ודירוג של המשתמש
			
Base URL/albums			
/	POST	המשתמש	יצירת אלבום
/public	GET	-	קבלת האלבומים הפומביים
/search	GET	-	קבלת אלבומים לפי חיפוש
/me	GRT	המשתמש	קבלת כל האלבומים של המשתמש
/{album_id}/images/public	GET	-	קבלת כל התמונות הפומביות של האלבום
/{album_id}/images	GET	המשתמש	קבלת כל התמונות באלבום של המשתמש
/{album_id}	PUT	המשתמש	עדכון שם אלבום או האם פומבי
/{album_id}/block	PUT	מנהל	חסימת אלבום
/{album_id}	DELETE	המשתמש	מחיקת אלבום
			
Base URL/ cloudinary			
settings/		POST	המשתמש	הוספת פרטי cloudinary
settings/	GET	המשתמש	קבלת פרטי cloudinary
settings/	DELETE	המשתמש	מחיקת פרטי cloudinary
/upload	POST	המשתמש	העלאת תמונה לאתר cloudinary
			
Base URL/ai			
/ask	POST	המשתמש	לשאול שאלה את הAI
/history	GET	המשתמש	קבלת היסטרית שיחה עם AI
/clearHistory	DELETE	המשתמש	מחיקת היסטורית שיחה

השרת תומך ב-**pagination** עבור קבלת רשימות (ברירת מחדל עמוד 1, מקסימום 25 פריטים לעמוד) ובפונקציית **חיפוש** המחזירה רק פריטים פומביים[cite: 40].

---

## 🧠 מודלי AI

השרת משלב מודלי AI מתקדמים לשיפור חווית המשתמש:

* **יצירת תמונות**: באמצעות `StableDiffusionPipeline`[cite: 45, 230], השרת יכול ליצור תמונות על בסיס תיאור טקסטואלי המסופק על ידי המשתמש.
* **זיהוי תגובות פוגעניות**: מודל `toxic-bert` [cite: 244] משמש לסינון ומחיקה אוטומטית של תגובות המכילות תוכן פוגעני, בשילוב עם רשימת מילים פוגעניות בעברית.
* **צאט עם AI**: המערכת מאפשרת למשתמשים לשוחח עם מודלי AI (כגון Ollama או Gemini)  לקבלת עזרה בניסוח תיאורי תמונות, סריקת DB ועוד[cite: 8]. המידע ל-AI מגיע מקובץ CSV המגדיר את התנהגותו ומבסיס הנתונים[cite: 9].

---

## 🔄 משימות רקע ו-Utilities

תיקיית `utils/` מכילה סקריפטים ופונקציות עזר חיוניות:

* `auth_utils.py`: טיפול באימות משתמשים באמצעות `bcrypt` עבור סיסמאות ו-JWT עבור טוקנים.
* `generate-image.py`: לוגיקת יצירת התמונות על ידי AI.
* `permissions.py`: מערכת הרשאות הבודקת את גישת המשתמשים לפונקציות שונות בשרת.
* `background_jobs.py` / `background_commits_jobs.py`: משימות רקע המבוצעות באופן תקופתי (לדוגמה, שחרור משתמשים חסומים לאחר 7 ימים , מחיקת תגובות פוגעניות ) או בעת עליית השרת[cite: 51].
* `toxicity_model.py`: המודל והלוגיקה לבדיקת פוגענות בתגובות.
* `crypto_utils.py`: הצפנה ופענוח של מפתחות API רגישים, כמו אלו של Cloudinary.
* `ai_loader.py`: טעינת מידע עבור מודל ה-AI בהתאם לתפקיד המשתמש[cite: 52].
* `db_queries.py`: פונקציות לשליפת מידע מה-DB על משתמשים[cite: 53].

---

## 🔐 משתני סביבה

השרת דורש קביעת משתני סביבה בקובץ `.env` שבתיקיית `server/` לצורך תצורה נכונה. דוגמאות למשתנים:

```dotenv
DATABASE_URL="sqlite:///./sql_app.db" # או חיבור ל-PostgreSQL/MySQL
SECRET_KEY="your_jwt_secret_key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Cloudinary credentials (אופציונלי, אם משתמשים ב-Cloudinary)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# AI Model settings (אופציונלי, אם משתמשים במודלי AI מקומיים)
OLLAMA_BASE_URL="http://localhost:11434"