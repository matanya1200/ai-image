from transformers import pipeline

# טוען את המודל לזיהוי טוקסיות באנגלית
toxic_model = pipeline("text-classification", model="unitary/toxic-bert")

def is_toxic(text: str, threshold: float = 0.8) -> bool:
    results = toxic_model(text)
    for result in results:
        if result['label'] == 'TOXIC' and result['score'] > threshold:
            return True
    return False