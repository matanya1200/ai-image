from Crypto.Cipher import AES
from base64 import b64encode, b64decode
import os
from dotenv import load_dotenv

load_dotenv()

# המפתח מהסביבה
KEY = os.getenv("ENCRYPTION_KEY").encode()  # חייב להיות בדיוק 32 בתים

# ריפוד טקסט כדי שיתאים ל-AES
def pad(s):
    pad_len = 16 - len(s.encode()) % 16
    return s + chr(pad_len) * pad_len

def unpad(s):
    return s[:-ord(s[-1])]

def encrypt(plaintext: str) -> str:
    iv = os.urandom(16)
    cipher = AES.new(KEY, AES.MODE_CBC, iv)
    encrypted = cipher.encrypt(pad(plaintext).encode())
    return b64encode(iv + encrypted).decode()

def decrypt(ciphertext: str) -> str:
    raw = b64decode(ciphertext)
    iv = raw[:16]
    encrypted = raw[16:]
    cipher = AES.new(KEY, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(encrypted).decode())
