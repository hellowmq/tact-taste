"""Build the small Pages surface from an explicit set of project-owned files."""

import argparse
import html
from html.parser import HTMLParser
from pathlib import Path
import shutil
import sys
from urllib.parse import urlsplit, urlunsplit

from check import LocalResources, check
from distribution import ROOT

ASSETS = {
    "examples/styles.css": "assets/styles.css",
    "examples/gallery.css": "assets/gallery.css",
    "examples/gallery.js": "assets/gallery.js",
    "examples/text-geometry.js": "assets/text-geometry.js",
    "examples/particle-renderer.js": "assets/particle-renderer.js",
    "examples/showcase.js": "assets/showcase.js",
    "site/site.css": "assets/site.css",
    "site/site.js": "assets/site.js",
    "docs/media/cover.png": "assets/cover.png",
    "docs/media/showreel-poster.png": "assets/showreel-poster.png",
    "site/showreel.css": "assets/showreel.css",
    "site/showreel.js": "assets/showreel.js",
}
PANELS = {"light-studio": "specimen-light", "type-composer": "specimen-type", "paper-walk": "specimen-paper"}


class Specimens(HTMLParser):
    """Locate complete section slices without rebuilding the source markup."""

    def __init__(self, source):
        super().__init__()
        self.source = source
        self.lines = source.splitlines(keepends=True)
        self.fragments = {}
        self.current = None
        self.depth = 0
        self.start = 0
        self.feed(source)

    def position_offset(self):
        line, column = self.getpos()
        return sum(len(part) for part in self.lines[:line - 1]) + column

    def handle_starttag(self, tag, attrs):
        if tag != "section":
            return
        if self.current:
            self.depth += 1
        elif dict(attrs).get("id") in PANELS:
            self.current = dict(attrs)["id"]
            if self.current in self.fragments:
                raise ValueError("Duplicate specimen")
            self.depth = 1
            self.start = self.position_offset()

    def handle_endtag(self, tag):
        if tag != "section" or not self.current:
            return
        self.depth -= 1
        if self.depth == 0:
            self.fragments[self.current] = self.source[self.start:self.position_offset() + len("</section>")]
            self.current = None


def build(output, base_url="https://hellowmq.github.io/tact-taste/", root=ROOT):
    root = Path(root).resolve()
    output = Path(output).expanduser().absolute()
    if output.exists() or output.is_symlink():
        raise ValueError("Output exists; nothing replaced")
    resolved = output.resolve()
    if resolved == root or resolved in root.parents:
        raise ValueError("Output cannot replace source or an ancestor")
    if root in resolved.parents and resolved.relative_to(root).parts[0] != "dist":
        raise ValueError("Build inside dist/ or outside the source project")
    _, errors = check(root)
    if errors:
        raise ValueError("Source check failed: " + "; ".join(errors))
    parsed = urlsplit(base_url)
    if parsed.scheme not in ("http", "https") or not parsed.netloc or parsed.username or parsed.password or parsed.query or parsed.fragment:
        raise ValueError("Expected a public HTTP(S) base URL without credentials, query or fragment")
    canonical = urlunsplit(("https", parsed.netloc, parsed.path.rstrip("/") + "/", "", ""))
    specimens = Specimens((root / "examples/index.html").read_text()).fragments
    if set(specimens) != set(PANELS):
        raise ValueError("Missing complete UI specimen sections")
    panels = []
    for index, (name, tab) in enumerate(PANELS.items()):
        fragment = specimens[name]
        start = fragment.index(">")
        attrs = fragment[:start]
        # The presentation owns tab semantics; the specimen owns its controls.
        for heading in ("light-title", "type-title", "paper-title"):
            attrs = attrs.replace(f'aria-labelledby="{heading}"', f'aria-labelledby="{tab}"')
        attrs += ' role="tabpanel" tabindex="0"'
        if index:
            attrs += " hidden inert"
        panels.append(attrs + fragment[start:])
    template = (root / "site/index.html").read_text()
    if template.count("<!-- UI_SPECIMENS -->") != 1 or template.count("<!-- PAGE_METADATA -->") != 1:
        raise ValueError("Page template markers changed")
    meta = (f'<link rel="canonical" href="{html.escape(canonical, quote=True)}">\n'
            '<meta property="og:type" content="website">\n'
            '<meta property="og:title" content="Tact Taste — 有分寸，也有锋芒">\n'
            f'<meta property="og:url" content="{html.escape(canonical, quote=True)}">\n'
            f'<meta property="og:image" content="{html.escape(canonical + "assets/cover.png", quote=True)}">')
    page = template.replace("<!-- UI_SPECIMENS -->", "\n".join(panels)).replace("<!-- PAGE_METADATA -->", meta)
    for source, target in ASSETS.items():
        if source.startswith("examples/"):
            page = page.replace("../" + source, target)
        elif source.startswith("site/"):
            page = page.replace('"' + Path(source).name + '"', '"' + target + '"')
    resources = LocalResources()
    resources.feed(page)
    allowed = {"index.html", "showreel.html", *ASSETS.values()}
    for link in resources.links:
        parts = urlsplit(link)
        if not parts.scheme and not parts.netloc and parts.path and parts.path not in allowed:
            raise ValueError("Page links to a non-deployed local resource: " + link)
    output.mkdir(parents=True, exist_ok=False)
    (output / "index.html").write_text(page, encoding="utf-8")
    reel = (root / "site/showreel.html").read_text()
    reel_meta = (f'<link rel="canonical" href="{html.escape(canonical + "showreel.html", quote=True)}">\n'
                 '<meta property="og:type" content="website">\n'
                 '<meta property="og:title" content="Tact Taste — 32 秒 Showreel">\n'
                 f'<meta property="og:image" content="{html.escape(canonical + "assets/showreel-poster.png", quote=True)}">')
    reel = reel.replace("<!-- PAGE_METADATA -->", reel_meta)
    reel = reel.replace('"showreel.css"', '"assets/showreel.css"').replace('"showreel.js"', '"assets/showreel.js"')
    reel = reel.replace("../docs/media/showreel-poster.png", "assets/showreel-poster.png")
    (output / "showreel.html").write_text(reel, encoding="utf-8")
    for source, target in ASSETS.items():
        destination = output / target
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(root / source, destination)
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "dist/pages")
    parser.add_argument("--base-url", default="https://hellowmq.github.io/tact-taste/")
    args = parser.parse_args()
    try:
        output = build(args.output, args.base_url)
    except (ValueError, OSError) as error:
        print("Pages build stopped: " + str(error), file=sys.stderr)
        return 1
    print(f"Built {len(ASSETS) + 2} Pages files at {output}; no publication performed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
