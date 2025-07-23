from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# ייבוא הרוטרים מהתיקייה controllers
from controllers.auth import router as auth_router
from controllers.users import router as users_router
from controllers.images import router as images_router
from controllers.commits import router as commits_router
from controllers.albums import router as albums_router

# ייבוא של משימות רקע
from utils.ackground_jobs import schedule_unblock_task

app = FastAPI(title="AI Image Generator API")

# 🎯 מפעיל את המשימה עם עליית השרת
@app.on_event("startup")
def on_startup():
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


# נקודת כניסה פשוטה לבדיקה
@app.get("/")
def root():
    return {"message": "AI Image Generator API is running"}
