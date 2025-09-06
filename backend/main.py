from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import shutil
import cv2
from pathlib import Path
from uuid import uuid4
from models.blip_clip import generate_caption, classify_image


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
async def read_root():
    return {"message": "SnapMind backend is live!"}

@app.post("/upload/")
async def upload_image(
    image: UploadFile = File(...), 
    category: str = Form(...)
):
    ext = Path(image.filename).suffix
    safe_filename = f"{uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, safe_filename)

    # Save original
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # OpenCV grayscale
    img = cv2.imread(filepath)
    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image file."})

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    processed_path = os.path.join(UPLOAD_DIR, f"processed_{safe_filename}")
    cv2.imwrite(processed_path)

    caption = generate_caption(filepath)
    predicted_category = classify_image(filepath)
    
    return JSONResponse({
    "message": "Image uploaded and processed successfully",
    "category": predicted_category,
    "caption": caption,
    "original_image": f"http://localhost:8000/uploads/{image.filename}",
    "processed_image": f"http://localhost:8000/uploads/processed_{image.filename}",
})


def main():
    print("Starting SnapMind backend...")
    uvicorn.run(app, host="127.0.0.1", port=8000)

if __name__ == "__main__":
    main()
