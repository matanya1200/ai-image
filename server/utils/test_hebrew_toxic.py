from hebrew_toxic_words import TOXIC_WORDS
from toxicity_hebrew_filter import is_hebrew_toxic

def test_input_loop():
    print("🧪 מצב בדיקת מילים פוגעניות בעברית:")
    print("הקלד טקסט לבדיקה, או 'exit' ליציאה\n")

    while True:
        text = input("> טקסט לבדיקה: ").strip()
        if text.lower() == "exit":
            print("להתראות!")
            break

        if is_hebrew_toxic(text):
            print("⚠️ טקסט פוגעני מזוהה!\n")
        else:
            print("✅ טקסט תקין\n")

if __name__ == "__main__":
    test_input_loop()
