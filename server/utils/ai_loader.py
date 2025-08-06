import yaml
import os

def load_yaml_knowledge(role: str) -> str:
    filepath = os.path.join("data", "ai_knowledge.yaml")
    with open(filepath, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    # בסיס: תוכן לפי תפקיד
    result = []

    # לכל תפקיד יש section משלו
    if role == "admin":
        # יורש גם מ-user וגם מ-admin
        user_data = data.get("user", {})
        admin_data = data.get("admin", {})
        result.append("🔹 הנחיות למשתמש רגיל:\n" + user_data.get("knowledge", ""))
        result.append(tips_to_text(user_data.get("tips", [])))
        result.append("\n\n🔸 הנחיות למנהל:\n" + admin_data.get("knowledge", ""))
        result.append(tips_to_text(admin_data.get("tips", [])))

    elif role == "user":
        user_data = data.get("user", {})
        result.append("🔹 הנחיות למשתמש:\n" + user_data.get("knowledge", ""))
        result.append(tips_to_text(user_data.get("tips", [])))

    else:
        return "תפקיד לא מזוהה עבור AI."

    return "\n\n".join(result)


def tips_to_text(tips_data: list) -> str:
    """
    ממיר את חלק ה־tips (שהוא מבנה של רשימות) לטקסט מסודר.
    """
    if not tips_data:
        return ""

    lines = []
    for section in tips_data:
        for topic, bullets in section.items():
            lines.append(f"\n🔸 {topic}")
            for item in bullets:
                lines.append(f"  - {item}")
    return "\n".join(lines)
