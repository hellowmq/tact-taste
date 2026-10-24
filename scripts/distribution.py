"""Shared, explicit file boundary for local installation and distribution."""

import json
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]


def load_manifest(root=ROOT):
    root = Path(root).resolve()
    manifest = json.loads((root / "distribution.json").read_text(encoding="utf-8"))
    if manifest.get("name") != "tact-taste":
        raise ValueError("Unexpected distribution name")
    for key in ("files", "skill_files"):
        entries = manifest.get(key)
        if not isinstance(entries, list) or not entries or len(set(entries)) != len(entries):
            raise ValueError(f"Invalid or duplicate {key}")
        for item in entries:
            if not isinstance(item, str):
                raise ValueError("Manifest paths must be strings")
            path = PurePosixPath(item)
            if path.is_absolute() or ".." in path.parts or "\\" in item or str(path) != item:
                raise ValueError(f"Unsafe manifest path: {item}")
            target = root / item
            if any((root.joinpath(*path.parts[:i])).is_symlink() for i in range(1, len(path.parts) + 1)):
                raise ValueError(f"Symlinks are not distributable: {item}")
            if not target.is_file() or root not in target.resolve().parents:
                raise ValueError(f"Missing or escaping file: {item}")
    if not set(manifest["skill_files"]).issubset(manifest["files"]):
        raise ValueError("Installed files must be part of the public distribution")
    return manifest
