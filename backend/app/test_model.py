
import torch
import torch.nn as nn
from torchvision import models
from huggingface_hub import hf_hub_download

print("Loading EcoVision AI model...")

model = models.resnet18(weights=None)

model.fc = nn.Sequential(
    nn.Linear(model.fc.in_features, 64),
    nn.ReLU(),
    nn.Dropout(p=0.5),
    nn.Linear(64, 6),
)

checkpoint_path = hf_hub_download(
    repo_id="tonghahaha/trashnet-resnet18",
    filename="best_resnet18_trashnet.pth",
)

state_dict = torch.load(
    checkpoint_path,
    map_location="cpu",
    weights_only=True,
)

model.load_state_dict(state_dict)
model.eval()

print("SUCCESS! TrashNet ResNet18 loaded.")
print("Supported classes:")
print("cardboard, glass, metal, paper, plastic, trash")

# Test model output dimensions with a dummy image
with torch.inference_mode():
    dummy_image = torch.randn(1, 3, 224, 224)
    output = model(dummy_image)

print("Output shape:", output.shape)
print("ECOVISION AI MODEL READY!")
