"""Check package boundaries and portable links; no network or host installation."""

import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

from distribution import ROOT, load_manifest


class LocalResources(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ("href", "src") and value:
                self.links.append(value)


def check(root=ROOT):
    root = Path(root).resolve()
    manifest = load_manifest(root)
    allowed = set(manifest["files"])
    errors = []
    ignored_parts = {".git", "__pycache__", "dist", "artifacts", ".venv", "node_modules"}
    for path in root.rglob("*"):
        relative = path.relative_to(root)
        if any(part in ignored_parts for part in relative.parts) or path.name == ".DS_Store":
            continue
        if path.is_symlink() or (path.is_file() and relative.as_posix() not in allowed):
            errors.append(f"Unlisted file or symlink: {relative}")
    skill = (root / "SKILL.md").read_text(encoding="utf-8")
    if not skill.startswith("---\nname: tact-taste\n") or "\ndescription: " not in skill:
        errors.append("Invalid skill identity/frontmatter")
    if "\nlicense: MIT\n" not in skill:
        errors.append("Skill license missing")
    source_data = json.loads((root / "docs/sources.json").read_text(encoding="utf-8"))
    if source_data.get("third_party_code_bundled") is not False or source_data.get("third_party_assets_bundled") is not False:
        errors.append("Distribution boundary requires a fresh review")
    references = source_data.get("public_references", [])
    if len(references) != 4:
        errors.append("Expected four audited public references")
    for record in references:
        if not re.fullmatch(r"[0-9a-f]{40}", record.get("commit", "")) or record.get("redistributed") is not False:
            errors.append(f"Invalid source evidence: {record.get('id')}")
    excluded_hashes = {record["sha256"] for record in source_data["excluded_originals"]}
    private_prefixes = ("/" + "Users/", "/" + "home/", "/var/" + "folders/", "file" + "://")
    for name in manifest["files"]:
        path = root / name
        data = path.read_bytes()
        if hashlib.sha256(data).hexdigest() in excluded_hashes:
            errors.append(f"Excluded original was included: {name}")
        text = data.decode("utf-8")
        if any(prefix in text for prefix in private_prefixes):
            errors.append(f"Private/absolute machine path in {name}")
        if any(line.rstrip() != line for line in text.splitlines()):
            errors.append(f"Trailing whitespace in {name}")
        links = []
        if path.suffix == ".md":
            if sum(line.startswith("```") for line in text.splitlines()) % 2:
                errors.append(f"Unclosed code fence: {name}")
            links = re.findall(r"!?\[[^\]]*\]\(([^)]+)\)", text)
        elif path.suffix == ".html":
            parser = LocalResources()
            parser.feed(text)
            links = parser.links
        for link in links:
            parsed = urlsplit(link.strip("<>"))
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            target = (path.parent / unquote(parsed.path)).resolve()
            if root not in target.parents or not target.is_file():
                errors.append(f"Broken/escaping local link in {name}: {link}")
                continue
            relative = target.relative_to(root).as_posix()
            if relative not in allowed:
                errors.append(f"Link to non-distributed file in {name}: {link}")
            if name in manifest["skill_files"] and relative not in manifest["skill_files"]:
                errors.append(f"Installed skill depends on an omitted file: {name} -> {link}")
        if name.startswith("examples/") and path.suffix in (".html", ".css", ".js"):
            if re.search(r"https?://|@import|\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon", text):
                errors.append(f"External resource/network API in offline example: {name}")
    return manifest, errors


def main():
    try:
        manifest, errors = check()
    except (OSError, ValueError, KeyError) as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1
    if errors:
        print("\n".join(f"FAIL: {error}" for error in errors), file=sys.stderr)
        return 1
    print(f"PASS: {len(manifest['files'])} public files; {len(manifest['skill_files'])} self-contained skill files; links and provenance boundaries checked.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
