from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# ייבוא הרוטרים מהתיקייה controllers
from controllers.auth import router as auth_router
from controllers.users import router as users_router
from controllers.images import router as images_router
from controllers.commits import router as commits_router
from controllers.albums import router as albums_router
from controllers.cloudinary import router as cloudinary_router

# ייבוא של הפונקציה בדיקת תגובות
from utils.background_commits_jobs import schedule_tasks

# ייבוא של משימות רקע
from utils.background_block_jobs import schedule_unblock_task

# ייבוא של משימות רקע
from utils.background_users_jobs import logout_inactive_users

app = FastAPI(title="AI Image Generator API")

# 🎯 מפעיל את המשימה עם עליית השרת
@app.on_event("startup")
def on_startup():
    print("Starting background tasks...")
    # הפעלת משימות רקע
    print("Logout users...")
    logout_inactive_users()
    print("chacking responses...")
    schedule_tasks()
    print("Scheduling unblock task...")
    schedule_unblock_task()

# הגדרות CORS לפיתוח (אפשר לשנות לכתובות ספציפיות בפרודקשן)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # כל האתרים מורשים לגשת (אפשר לצמצם)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# הגדרת תיקיית static לתמונות שנוצרו
app.mount("/static", StaticFiles(directory="static"), name="static")

# רישום הרוטרים
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(images_router)
app.include_router(commits_router)
app.include_router(albums_router)
app.include_router(cloudinary_router)


# נקודת כניסה פשוטה לבדיקה
@app.get("/")
def root():
    return {"message": "AI Image Generator API is running"}
