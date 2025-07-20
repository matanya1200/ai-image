import mysql.connector
from dotenv import load_dotenv
import os

# טוען את משתני הסביבה מקובץ .env
load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "ai_app"),
    )
