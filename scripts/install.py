"""Copy a complete skill to a new destination without replacing existing work."""

import argparse
import os
from pathlib import Path
import shutil
import sys

from distribution import ROOT, load_manifest


def install(destination, root=ROOT):
    root = Path(root).resolve()
    manifest = load_manifest(root)
    destination = Path(destination).expanduser().absolute()
    if destination.name != manifest["name"]:
        raise ValueError("The final destination directory must be named tact-taste")
    if os.path.lexists(destination):
        raise ValueError(f"Destination already exists; nothing replaced: {destination}")
    if os.path.lexists(destination.parent / "interaction-master"):
        raise ValueError("Legacy interaction-master is present beside the destination; see docs/INSTALL.md")
    resolved = destination.resolve()
    if resolved == root or root in resolved.parents or resolved in root.parents:
        raise ValueError("Install outside the source project and its ancestors")
    # All inputs and refusal conditions are checked before creating a destination.
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.mkdir(exist_ok=False)
    for name in manifest["skill_files"]:
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(root / name, target)
    return destination


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--to", required=True, type=Path, help="New final skill directory, ending in tact-taste")
    args = parser.parse_args()
    try:
        destination = install(args.to)
    except (OSError, ValueError) as exc:
        print(f"Installation stopped: {exc}", file=sys.stderr)
        return 1
    print(f"Copied tact-taste to {destination}. Start a new host session to check discovery.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
