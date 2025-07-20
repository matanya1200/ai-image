import os
import time
from diffusers import StableDiffusionPipeline

# יצירת תיקיית static אם לא קיימת
if not os.path.exists("static"):
    os.makedirs("static")

# ---------------------------
# 🚀 טעינת המודל פעם אחת בלבד
# ---------------------------
print("Loading Stable Diffusion model...")
pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
pipe = pipe.to("cpu")
pipe.enable_attention_slicing()
print("Model loaded.")

# ---------------------------
# 🎨 פונקציית יצירת תמונה
# ---------------------------
def generate_image_from_text(prompt: str) -> str:
    image = pipe(prompt).images[0]
    timestamp = int(time.time())
    filename = f"image_{timestamp}.png"
    filepath = os.path.join("static", filename)
    image.save(filepath)
    return f"http://10.0.0.18:8000/static/{filename}"
