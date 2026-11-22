
import io

import torch
import torch.nn as nn
from PIL import Image, UnidentifiedImageError
from torchvision import models, transforms
from huggingface_hub import hf_hub_download


CLASS_NAMES = [
    "cardboard",
    "glass",
    "metal",
    "paper",
    "plastic",
    "trash",
]


class WasteClassifier:
    def __init__(self):
        self.device = torch.device("cpu")

        self.model = models.resnet18(weights=None)

        self.model.fc = nn.Sequential(
            nn.Linear(self.model.fc.in_features, 64),
            nn.ReLU(),
            nn.Dropout(p=0.5),
            nn.Linear(64, 6),
        )

        checkpoint = hf_hub_download(
            repo_id="tonghahaha/trashnet-resnet18",
            filename="best_resnet18_trashnet.pth",
        )

        state_dict = torch.load(
            checkpoint,
            map_location=self.device,
            weights_only=True,
        )

        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()


        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
        ])


        print("EcoVision AI model loaded successfully!")

    def predict(self, image_bytes: bytes):
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image = image.convert("RGB")
        except (UnidentifiedImageError, OSError) as exc:
            raise ValueError("Invalid image file") from exc

        input_tensor = (
            self.transform(image)
            .unsqueeze(0)
            .to(self.device)
        )

        with torch.inference_mode():
            logits = self.model(input_tensor)
            probabilities = torch.softmax(logits, dim=1)[0]

        predictions = [
            {
                "category": CLASS_NAMES[i],
                "confidence": round(
                    float(probabilities[i]) * 100, 2
                ),
            }
            for i in range(len(CLASS_NAMES))
        ]

        predictions.sort(
            key=lambda item: item["confidence"],
            reverse=True,
        )

        return {
            "category": predictions[0]["category"],
            "confidence": predictions[0]["confidence"],
            "predictions": predictions,
        }
