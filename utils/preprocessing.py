"""
utils/preprocessing.py
─────────────────────────────────────────────────────────────────────
Reusable image-preprocessing utilities for the CancerAI-NAS pipeline.

These helpers centralise the transform logic that was previously
duplicated between `new_train_nas.py` and `backend/app.py`, making
it trivial to keep training and inference preprocessing in sync.

Usage
-----
    from utils.preprocessing import get_train_transform, get_val_transform, preprocess_image

    train_tf = get_train_transform(img_size=128)
    val_tf   = get_val_transform(img_size=128)
    tensor   = preprocess_image(pil_image, transform=val_tf)
"""

from __future__ import annotations

import io
from pathlib import Path
from typing import Optional, Tuple, Union

import numpy as np
import torch
from PIL import Image
from torchvision import transforms

# ── ImageNet mean/std used during training ───────────────────────────────────
IMAGENET_MEAN: Tuple[float, float, float] = (0.485, 0.456, 0.406)
IMAGENET_STD: Tuple[float, float, float]  = (0.229, 0.224, 0.225)

# Default image size used by the NAS-trained model
DEFAULT_IMG_SIZE: int = 128


def get_train_transform(img_size: int = DEFAULT_IMG_SIZE) -> transforms.Compose:
    """Return the augmented transform pipeline used during model training.

    Parameters
    ----------
    img_size:
        Target spatial size (height == width) in pixels.

    Returns
    -------
    torchvision.transforms.Compose
    """
    return transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.RandomRotation(20),
        transforms.RandomHorizontalFlip(),
        transforms.RandomResizedCrop(img_size, scale=(0.8, 1.0)),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


def get_val_transform(img_size: int = DEFAULT_IMG_SIZE) -> transforms.Compose:
    """Return the deterministic transform pipeline used during validation / inference.

    Parameters
    ----------
    img_size:
        Target spatial size (height == width) in pixels.

    Returns
    -------
    torchvision.transforms.Compose
    """
    return transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


def preprocess_image(
    image: Union[Image.Image, bytes, str, Path],
    transform: Optional[transforms.Compose] = None,
    img_size: int = DEFAULT_IMG_SIZE,
) -> torch.Tensor:
    """Load and preprocess a single image into a model-ready tensor.

    Parameters
    ----------
    image:
        Accepts a PIL ``Image``, raw image bytes, a file path string, or
        a :class:`pathlib.Path` object.
    transform:
        Optional custom transform.  Defaults to :func:`get_val_transform`.
    img_size:
        Used only when ``transform`` is ``None``.

    Returns
    -------
    torch.Tensor
        Shape ``(1, 3, img_size, img_size)`` — ready to pass to the model.
    """
    if transform is None:
        transform = get_val_transform(img_size)

    # ── Normalise input type to PIL.Image ────────────────────────────────────
    if isinstance(image, (str, Path)):
        pil_img = Image.open(image).convert("RGB")
    elif isinstance(image, bytes):
        pil_img = Image.open(io.BytesIO(image)).convert("RGB")
    elif isinstance(image, Image.Image):
        pil_img = image.convert("RGB")
    else:
        raise TypeError(
            f"Unsupported image type: {type(image).__name__}. "
            "Expected PIL.Image, bytes, str, or pathlib.Path."
        )

    return transform(pil_img).unsqueeze(0)  # (1, C, H, W)


def denormalize(
    tensor: torch.Tensor,
    mean: Tuple[float, float, float] = IMAGENET_MEAN,
    std: Tuple[float, float, float] = IMAGENET_STD,
) -> np.ndarray:
    """Reverse ImageNet normalisation and return a uint8 NumPy array.

    Useful for visualising tensors alongside Grad-CAM heatmaps.

    Parameters
    ----------
    tensor:
        Shape ``(3, H, W)`` or ``(1, 3, H, W)``.

    Returns
    -------
    numpy.ndarray
        Shape ``(H, W, 3)``, dtype ``uint8``, values in ``[0, 255]``.
    """
    if tensor.dim() == 4:
        tensor = tensor.squeeze(0)

    mean_t = torch.tensor(mean).view(3, 1, 1)
    std_t  = torch.tensor(std).view(3, 1, 1)

    img = tensor.detach().cpu() * std_t + mean_t
    img = img.clamp(0, 1)
    return (img.permute(1, 2, 0).numpy() * 255).astype(np.uint8)


def validate_image_file(filepath: Union[str, Path]) -> bool:
    """Return ``True`` if *filepath* points to a supported histopathology image.

    Supported extensions: ``.png``, ``.jpg``, ``.jpeg``, ``.bmp``, ``.tiff``.

    Parameters
    ----------
    filepath:
        Path to the candidate image file.
    """
    allowed = {".png", ".jpg", ".jpeg", ".bmp", ".tiff"}
    return Path(filepath).suffix.lower() in allowed
