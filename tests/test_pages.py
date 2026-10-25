"""The hosted surface must stay scoped, portable, and non-overwriting."""

import sys
import tempfile
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from build_pages import ASSETS, build
from distribution import ROOT


class PagesTests(unittest.TestCase):
    def test_scoped_build_keeps_shared_bytes_and_project_relative_urls(self):
        output = Path(tempfile.mkdtemp(prefix="tact-taste-pages-test-")) / "tact-taste"
        build(output, "http://tech.wenmq.cn/tact-taste")
        self.assertEqual({p.relative_to(output).as_posix() for p in output.rglob("*") if p.is_file()}, {"index.html", *ASSETS.values()})
        for source, target in ASSETS.items():
            self.assertEqual((ROOT / source).read_bytes(), (output / target).read_bytes())
        page = (output / "index.html").read_text()
        self.assertNotIn("<!-- UI_SPECIMENS -->", page)
        self.assertNotIn("../examples/", page)
        self.assertIn('href="https://tech.wenmq.cn/tact-taste/"', page)
        self.assertEqual(page.count('role="tabpanel"'), 5)
        self.assertEqual(page.count(" hidden inert"), 2)
        with self.assertRaises(ValueError):
            build(output)

    def test_source_and_invalid_urls_are_rejected_before_output_is_created(self):
        with self.assertRaises(ValueError):
            build(ROOT / "site")
        output = Path(tempfile.mkdtemp(prefix="tact-taste-pages-url-")) / "site"
        for url in ["relative", "https://user:secret@example.com/", "https://example.com/?token=x"]:
            with self.assertRaises(ValueError):
                build(output, url)
        self.assertFalse(output.exists())


if __name__ == "__main__":
    unittest.main()
