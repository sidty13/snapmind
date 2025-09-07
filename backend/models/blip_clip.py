# models/blip_clip.py

from transformers import BlipProcessor, BlipForConditionalGeneration, CLIPProcessor, CLIPModel
from PIL import Image
import torch

# Define categories
CATEGORIES = ["food", "pet", "nature", "art", "fashion"]

# Load models once
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")

def generate_caption(image_path: str) -> str:
    image = Image.open(image_path).convert("RGB")
    inputs = blip_processor(image, return_tensors="pt")
    out = blip_model.generate(**inputs)
    return blip_processor.decode(out[0], skip_special_tokens=True)

def classify_image(image_path: str, threshold: float = 0.35) -> str:
    """
    Classify an image into one of the predefined categories.
    If the best confidence is below the threshold, return "other".
    """
    image = Image.open(image_path).convert("RGB")
    inputs = clip_processor(text=CATEGORIES, images=image, return_tensors="pt", padding=True)
    outputs = clip_model(**inputs)
    probs = outputs.logits_per_image.softmax(dim=1).cpu().detach().numpy()[0]

    best_idx = probs.argmax()
    best_prob = probs[best_idx]

    if best_prob < threshold:
        return "other"
    return CATEGORIES[best_idx]
