
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.model import WasteClassifier
from app.recommendations import (
    get_recommendation,
    get_all_recommendations,
)


# Global AI classifier instance
classifier = None

# Maximum upload size: 10 MB
MAX_FILE_SIZE = 10 * 1024 * 1024

# Provisional confidence threshold
CONFIDENCE_THRESHOLD = 70.0


# Load the AI model when the server starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    global classifier

    classifier = WasteClassifier()
    print("EcoVision AI backend is ready!")

    yield

    classifier = None


# Initialize FastAPI
app = FastAPI(
    title="EcoVision AI API",
    description="AI-powered waste classification and recycling recommendation system",
    version="1.0.0",
    lifespan=lifespan,
)


# Enable communication with React frontend

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)



# Home endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to EcoVision AI!",
        "status": "running",
        "version": "1.0.0",
    }


# Health check endpoint
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": classifier is not None,
    }


@app.get("/recycling-guide")
def recycling_guide():
    return {
        "success": True,
        "categories": get_all_recommendations(),
    }



# AI waste classification endpoint
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Validate image format
    if file.content_type not in [
        "image/jpeg",
        "image/png",
        "image/webp",
    ]:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and WebP images are allowed",
        )

    # Read uploaded image
    image_bytes = await file.read(MAX_FILE_SIZE + 1)

    # Validate file size
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image must be smaller than 10 MB",
        )

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty",
        )

    # Check AI model availability
    if classifier is None:
        raise HTTPException(
            status_code=503,
            detail="AI model is not ready",
        )

    try:
        # Run ResNet18 image classification
        result = classifier.predict(image_bytes)

        confidence = result["confidence"]
        category = result["category"]

        # Flag uncertain predictions
        uncertain = confidence < CONFIDENCE_THRESHOLD

        # Generate disposal recommendations
        recommendation = (
            get_recommendation(category)
            if not uncertain
            else None
        )

        # Return prediction and recommendations
        return {
            "success": True,
            "result": {
                **result,
                "uncertain": uncertain,
                "recommendation": recommendation,
                "message": (
                    "Prediction is uncertain. "
                    "Please verify the material before disposal."
                    if uncertain
                    else "Waste classification completed successfully."
                ),
            },
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
