"""Create a deterministic source ZIP from the public file allowlist."""

import argparse
from pathlib import Path
import sys
import zipfile

from check import check
from distribution import ROOT


def package(output, root=ROOT):
    root = Path(root).resolve()
    manifest, errors = check(root)
    if errors:
        raise ValueError("Package check failed: " + "; ".join(errors))
    output = Path(output).expanduser().absolute()
    if output.exists() or output.is_symlink():
        raise ValueError(f"Output already exists; nothing replaced: {output}")
    if output == root or output in root.parents:
        raise ValueError("Invalid output path")
    if root in output.parents and output.relative_to(root).parts[0] != "dist":
        raise ValueError("Inside this project, put generated packages in dist/")
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "x", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name in sorted(manifest["files"]):
            info = zipfile.ZipInfo("tact-taste/" + name, date_time=(2026, 10, 23, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(info, (root / name).read_bytes(), compresslevel=9)
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    try:
        output = package(args.output)
    except (OSError, ValueError) as exc:
        print(f"Packaging stopped: {exc}", file=sys.stderr)
        return 1
    print(f"Created {output}; local archive only, nothing published.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
