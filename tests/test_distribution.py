"""Behavior checks for non-overwriting installation and the public file boundary."""

import hashlib
import json
from pathlib import Path
import shutil
import sys
import tempfile
import unittest
import zipfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from check import check
from distribution import ROOT, load_manifest
from install import install
from package import package


class DistributionTests(unittest.TestCase):
    def setUp(self):
        # Keep the test directory for inspection; this suite performs no deletion.
        self.scratch = Path(tempfile.mkdtemp(prefix="tact-taste-test-"))

    def staged_source(self):
        stage = self.scratch / "source"
        for name in load_manifest()["files"]:
            target = stage / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / name, target)
        return stage

    def test_install_is_complete_and_refuses_overwrite(self):
        dest = self.scratch / "skills" / "tact-taste"
        install(dest)
        expected = load_manifest()["skill_files"]
        self.assertEqual(sorted(expected), sorted(p.relative_to(dest).as_posix() for p in dest.rglob("*") if p.is_file()))
        for name in expected:
            self.assertEqual((ROOT / name).read_bytes(), (dest / name).read_bytes())
        (dest / "SKILL.md").write_text("user customization", encoding="utf-8")
        with self.assertRaises(ValueError):
            install(dest)
        self.assertEqual((dest / "SKILL.md").read_text(), "user customization")

    def test_old_skill_is_preserved_and_blocks_duplicate_install(self):
        parent = self.scratch / "skills"
        old = parent / "interaction-master"
        old.mkdir(parents=True)
        (old / "SKILL.md").write_text("old custom rules", encoding="utf-8")
        with self.assertRaises(ValueError):
            install(parent / "tact-taste")
        self.assertFalse((parent / "tact-taste").exists())
        self.assertEqual((old / "SKILL.md").read_text(), "old custom rules")

    def test_missing_input_does_not_create_destination(self):
        stage = self.staged_source()
        manifest = json.loads((stage / "distribution.json").read_text())
        manifest["files"].append("missing.txt")
        (stage / "distribution.json").write_text(json.dumps(manifest))
        dest = self.scratch / "skills" / "tact-taste"
        with self.assertRaises(ValueError):
            install(dest, stage)
        self.assertFalse(dest.exists())

    def test_traversal_and_symlink_are_rejected(self):
        stage = self.staged_source()
        manifest = json.loads((stage / "distribution.json").read_text())
        manifest["files"].append("../private.txt")
        (stage / "distribution.json").write_text(json.dumps(manifest))
        with self.assertRaises(ValueError):
            load_manifest(stage)
        manifest["files"][-1] = "linked.txt"
        (stage / "distribution.json").write_text(json.dumps(manifest))
        (stage / "linked.txt").symlink_to(ROOT / "LICENSE")
        with self.assertRaises(ValueError):
            load_manifest(stage)

    def test_unlisted_private_material_prevents_packaging(self):
        stage = self.staged_source()
        (stage / "private-notes.txt").write_text("not for distribution", encoding="utf-8")
        out = self.scratch / "public.zip"
        with self.assertRaises(ValueError):
            package(out, stage)
        self.assertFalse(out.exists())

    def test_package_has_exact_allowlist_and_is_reproducible(self):
        one = package(self.scratch / "one.zip")
        two = package(self.scratch / "two.zip")
        self.assertEqual(hashlib.sha256(one.read_bytes()).digest(), hashlib.sha256(two.read_bytes()).digest())
        with zipfile.ZipFile(one) as archive:
            self.assertEqual(sorted(archive.namelist()), sorted("tact-taste/" + name for name in load_manifest()["files"]))
            for name in load_manifest()["files"]:
                self.assertEqual(archive.read("tact-taste/" + name), (ROOT / name).read_bytes())
        with self.assertRaises(ValueError):
            package(one)

    def test_destination_name_and_source_recursion_are_rejected(self):
        with self.assertRaises(ValueError):
            install(self.scratch / "wrong-name")
        with self.assertRaises(ValueError):
            install(ROOT / "inside" / "tact-taste")
        self.assertFalse((ROOT / "inside").exists())

    def test_portable_copy_passes_checks(self):
        manifest, errors = check(self.staged_source())
        self.assertEqual(errors, [])
        self.assertTrue(set(manifest["skill_files"]).issubset(manifest["files"]))


if __name__ == "__main__":
    unittest.main()
