
import sys
import torch
from PIL import Image
from torchvision import transforms

from app.model import WasteClassifier, CLASS_NAMES


def main():
    if len(sys.argv) != 2:
        print("Usage: python -m app.test_preprocessing <image_path>")
        return

    image = Image.open(sys.argv[1]).convert("RGB")

    classifier = WasteClassifier()

    normalize = transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    )

    pipelines = {
        "A - Direct Resize": transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            normalize,
        ]),
        "B - Center Crop": transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            normalize,
        ]),
    }

    for name, transform in pipelines.items():
        tensor = transform(image).unsqueeze(0)

        with torch.inference_mode():
            logits = classifier.model(tensor)
            probabilities = torch.softmax(logits, dim=1)[0]

        results = sorted(
            zip(CLASS_NAMES, probabilities.tolist()),
            key=lambda x: x[1],
            reverse=True,
        )

        print(f"\n{name}")
        print("-" * 35)

        for category, probability in results:
            print(f"{category:12s}: {probability * 100:.2f}%")


if __name__ == "__main__":
    main()
