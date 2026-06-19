"""
tests/test_preprocessing.py
─────────────────────────────────────────────────────────────────────
Unit tests for utils/preprocessing.py.

Run with:
    pytest tests/ -v --tb=short
or with coverage:
    pytest tests/ --cov=utils --cov-report=term-missing
"""

import io
from pathlib import Path

import numpy as np
import pytest
import torch
from PIL import Image

# ── helpers ──────────────────────────────────────────────────────────────────

def _make_rgb_image(width: int = 64, height: int = 64) -> Image.Image:
    """Return a random RGB PIL image."""
    arr = np.random.randint(0, 256, (height, width, 3), dtype=np.uint8)
    return Image.fromarray(arr, mode="RGB")


def _image_to_bytes(img: Image.Image, fmt: str = "PNG") -> bytes:
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    return buf.getvalue()


# ── import under test ─────────────────────────────────────────────────────────

from utils.preprocessing import (
    DEFAULT_IMG_SIZE,
    IMAGENET_MEAN,
    IMAGENET_STD,
    denormalize,
    get_train_transform,
    get_val_transform,
    preprocess_image,
    validate_image_file,
)

# ─────────────────────────────────────────────────────────────────────────────
# get_val_transform
# ─────────────────────────────────────────────────────────────────────────────

class TestGetValTransform:
    def test_returns_compose(self):
        from torchvision.transforms import Compose
        tf = get_val_transform()
        assert isinstance(tf, Compose)

    def test_output_shape_default(self):
        tf = get_val_transform()
        img = _make_rgb_image(200, 150)
        tensor = tf(img)
        assert tensor.shape == (3, DEFAULT_IMG_SIZE, DEFAULT_IMG_SIZE)

    def test_output_shape_custom_size(self):
        size = 64
        tf = get_val_transform(img_size=size)
        img = _make_rgb_image(200, 200)
        tensor = tf(img)
        assert tensor.shape == (3, size, size)

    def test_output_dtype_is_float(self):
        tf = get_val_transform()
        tensor = tf(_make_rgb_image())
        assert tensor.dtype == torch.float32

    def test_deterministic(self):
        """Same image should produce identical tensors every call."""
        tf = get_val_transform()
        img = _make_rgb_image()
        t1 = tf(img)
        t2 = tf(img)
        assert torch.allclose(t1, t2)


# ─────────────────────────────────────────────────────────────────────────────
# get_train_transform
# ─────────────────────────────────────────────────────────────────────────────

class TestGetTrainTransform:
    def test_output_shape(self):
        tf = get_train_transform()
        img = _make_rgb_image(300, 300)
        tensor = tf(img)
        assert tensor.shape == (3, DEFAULT_IMG_SIZE, DEFAULT_IMG_SIZE)

    def test_output_is_float(self):
        tf = get_train_transform()
        tensor = tf(_make_rgb_image())
        assert tensor.dtype == torch.float32


# ─────────────────────────────────────────────────────────────────────────────
# preprocess_image
# ─────────────────────────────────────────────────────────────────────────────

class TestPreprocessImage:
    def test_accepts_pil_image(self):
        img = _make_rgb_image()
        tensor = preprocess_image(img)
        assert tensor.shape == (1, 3, DEFAULT_IMG_SIZE, DEFAULT_IMG_SIZE)

    def test_accepts_bytes(self):
        raw = _image_to_bytes(_make_rgb_image())
        tensor = preprocess_image(raw)
        assert tensor.shape == (1, 3, DEFAULT_IMG_SIZE, DEFAULT_IMG_SIZE)

    def test_accepts_path_string(self, tmp_path):
        img_path = tmp_path / "test.png"
        _make_rgb_image().save(str(img_path))
        tensor = preprocess_image(str(img_path))
        assert tensor.shape == (1, 3, DEFAULT_IMG_SIZE, DEFAULT_IMG_SIZE)

    def test_accepts_pathlib_path(self, tmp_path):
        img_path = tmp_path / "test.png"
        _make_rgb_image().save(img_path)
        tensor = preprocess_image(img_path)
        assert tensor.shape == (1, 3, DEFAULT_IMG_SIZE, DEFAULT_IMG_SIZE)

    def test_grayscale_converted_to_rgb(self):
        grey = Image.fromarray(np.random.randint(0, 256, (64, 64), dtype=np.uint8), mode="L")
        tensor = preprocess_image(grey)
        # Should still produce 3-channel tensor
        assert tensor.shape[1] == 3

    def test_rgba_converted_to_rgb(self):
        rgba = Image.fromarray(
            np.random.randint(0, 256, (64, 64, 4), dtype=np.uint8), mode="RGBA"
        )
        tensor = preprocess_image(rgba)
        assert tensor.shape[1] == 3

    def test_custom_transform_respected(self):
        from torchvision import transforms
        custom_size = 32
        tf = transforms.Compose([
            transforms.Resize((custom_size, custom_size)),
            transforms.ToTensor(),
        ])
        tensor = preprocess_image(_make_rgb_image(), transform=tf)
        assert tensor.shape == (1, 3, custom_size, custom_size)

    def test_unsupported_type_raises_type_error(self):
        with pytest.raises(TypeError, match="Unsupported image type"):
            preprocess_image(12345)  # type: ignore[arg-type]

    def test_output_is_4d_tensor(self):
        tensor = preprocess_image(_make_rgb_image())
        assert tensor.dim() == 4

    def test_batch_dim_is_one(self):
        tensor = preprocess_image(_make_rgb_image())
        assert tensor.shape[0] == 1


# ─────────────────────────────────────────────────────────────────────────────
# denormalize
# ─────────────────────────────────────────────────────────────────────────────

class TestDenormalize:
    def _normalised_tensor(self, h: int = 32, w: int = 32) -> torch.Tensor:
        tf = get_val_transform(img_size=max(h, w))
        return tf(_make_rgb_image(w, h))

    def test_output_is_uint8_ndarray(self):
        t = self._normalised_tensor()
        arr = denormalize(t)
        assert isinstance(arr, np.ndarray)
        assert arr.dtype == np.uint8

    def test_output_shape_hwc(self):
        size = 32
        tf = get_val_transform(img_size=size)
        t = tf(_make_rgb_image(size, size))
        arr = denormalize(t)
        assert arr.shape == (size, size, 3)

    def test_values_in_range(self):
        t = self._normalised_tensor()
        arr = denormalize(t)
        assert arr.min() >= 0
        assert arr.max() <= 255

    def test_accepts_4d_tensor(self):
        t = self._normalised_tensor().unsqueeze(0)  # (1,3,H,W)
        arr = denormalize(t)
        assert arr.ndim == 3


# ─────────────────────────────────────────────────────────────────────────────
# validate_image_file
# ─────────────────────────────────────────────────────────────────────────────

class TestValidateImageFile:
    @pytest.mark.parametrize("ext", [".png", ".jpg", ".jpeg", ".bmp", ".tiff"])
    def test_valid_extensions(self, ext):
        assert validate_image_file(f"sample_image{ext}") is True

    @pytest.mark.parametrize("ext", [".PNG", ".JPG", ".JPEG", ".BMP", ".TIFF"])
    def test_valid_extensions_uppercase(self, ext):
        assert validate_image_file(f"sample_image{ext}") is True

    @pytest.mark.parametrize("bad", [".txt", ".pdf", ".csv", ".py", ".exe", ".npy"])
    def test_invalid_extensions(self, bad):
        assert validate_image_file(f"not_an_image{bad}") is False

    def test_accepts_pathlib_path(self):
        assert validate_image_file(Path("tissue_slide.png")) is True
