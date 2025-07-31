from utils.hebrew_toxic_words import TOXIC_WORDS
import re

def is_hebrew_toxic(text: str) -> bool:
    lowered = text.lower()
    for word in TOXIC_WORDS:
        # נבדוק אם המילה קיימת בעצמה או עם תוספות פשוטות כמו "ה", "של"
        pattern = rf'(?:^|[\s"\'״׳])(?:ה|של|ל)?{re.escape(word)}(?:ים|ות|ו|ה|ן)?(?:$|[\s"\'״׳.,!?])'
        if re.search(pattern, lowered):
            return True
    return False