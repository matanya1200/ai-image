def load_toxic_words(filepath="data/toxic_words.txt") -> set:
    try:
        with open(filepath, encoding="utf-8") as f:
            return set(line.strip().lower() for line in f if line.strip())
    except FileNotFoundError:
        print("⚠️ קובץ מילים פוגעניות לא נמצא")
        return set()

TOXIC_WORDS = load_toxic_words()