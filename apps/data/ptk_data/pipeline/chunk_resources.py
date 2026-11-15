#!/usr/bin/env python3
"""
Dallas College PTK HIA - Markdown Chunking & JSON Extraction Pipeline

Reads converted Dallas College Markdown files, parses frontmatter metadata,
splits the document body into 1,000–1,500 character chunks with ~150-character
overlap on paragraph/header boundaries, computes a SHA-256 change hash, and
exports clean JSON records ready for database import.

Usage:
    uv run python -m ptk_data.pipeline.chunk_resources -i <input_dir> -o <output_file>
"""

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

PIPELINE_VERSION = "1.0.0"


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """
    Extracts YAML frontmatter and returns (metadata_dict, body_text).
    Uses regex delimiter matching to handle CRLF, trailing spaces, and avoid
    splitting on '---' inside frontmatter values.
    """
    frontmatter = {}
    body = content

    # Match YAML frontmatter between opening and closing --- lines
    fm_match = re.match(r"^---\s*\r?\n(.*?)\r?\n---\s*(?:\r?\n|$)(.*)$", content, re.DOTALL)
    if fm_match:
        raw_yaml = fm_match.group(1)
        body = fm_match.group(2)

        for line in raw_yaml.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if ":" in line:
                key, val = line.split(":", 1)
                key = key.strip()
                val = val.strip().strip('"').strip("'")
                frontmatter[key] = val

    # Strip redundant H1 heading only if it matches the document title
    body = body.strip()
    lines = body.splitlines()
    if lines:
        first_line = lines[0].strip()
        if first_line.startswith("# "):
            h1_text = first_line[2:].strip().lower()
            fm_title = frontmatter.get("title", "").strip().lower()
            if fm_title and h1_text == fm_title:
                body = "\n".join(lines[1:]).strip()

    # Collapse excessive blank lines
    body = re.sub(r"\n{3,}", "\n\n", body).strip()

    return frontmatter, body


def get_overlap_prefix(text: str, overlap_len: int = 150, min_overlap: int = 40) -> str:
    """
    Extracts approximately `overlap_len` characters from the end of `text`,
    snapping to a natural sentence or line boundary while ensuring a useful
    minimum overlap length (at least `min_overlap` characters).
    """
    if overlap_len <= 0 or not text:
        return ""

    if len(text) <= overlap_len:
        return text

    # Inspect a window around overlap_len
    window_size = min(len(text), overlap_len + 80)
    sample = text[-window_size:]

    # Find boundaries (sentence ends or line breaks)
    boundaries = []
    for m in re.finditer(r"(\.\s+|\?\s+|\!\s+|\r?\n+)", sample):
        candidate = sample[m.end():].strip()
        if len(candidate) >= min_overlap:
            # Measure distance from ideal overlap_len
            distance = abs(len(candidate) - overlap_len)
            boundaries.append((distance, candidate))

    if boundaries:
        # Pick the boundary closest to overlap_len
        boundaries.sort(key=lambda x: x[0])
        return boundaries[0][1]

    # Fallback: look for space boundary in the snippet
    snippet = text[-overlap_len:]
    space_idx = snippet.find(" ")
    if space_idx != -1 and (len(snippet) - space_idx - 1) >= min_overlap:
        return snippet[space_idx + 1:].strip()

    return snippet.strip()


def strip_trailing_headings(text: str) -> tuple[str, list[str]]:
    """
    If text ends with one or more heading lines (e.g. '## Section Title'),
    strip them so they don't remain stranded without their section body.
    Returns (cleaned_text, list_of_stripped_headings).
    """
    lines = text.rstrip().splitlines()
    trailing_headings = []

    while lines and re.match(r"^#{1,6}\s+", lines[-1].strip()):
        trailing_headings.insert(0, lines.pop().strip())

    cleaned = "\n".join(lines).strip()
    return cleaned, trailing_headings


def split_oversized_block(block: str, max_size: int) -> list[str]:
    """
    Splits a single block that exceeds max_size.
    Prefers line breaks, then sentence boundaries, with a hard word/slice fallback.
    """
    if len(block) <= max_size:
        return [block]

    # Try line-by-line first (tables, lists)
    lines = block.splitlines()
    if len(lines) > 1:
        sub_blocks = []
        buf = ""
        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue
            if not buf:
                buf = line_str
            elif len(buf) + len(line_str) + 1 <= max_size:
                buf += "\n" + line_str
            else:
                sub_blocks.append(buf)
                buf = line_str
        if buf:
            sub_blocks.append(buf)
        if all(len(sb) <= max_size for sb in sub_blocks):
            return sub_blocks

    # Try sentence splitting
    sentences = re.split(r"(?<=[.!?])\s+", block)
    if len(sentences) > 1:
        sub_blocks = []
        buf = ""
        for s in sentences:
            s_str = s.strip()
            if not s_str:
                continue
            if not buf:
                buf = s_str
            elif len(buf) + len(s_str) + 1 <= max_size:
                buf += " " + s_str
            else:
                sub_blocks.append(buf)
                buf = s_str
        if buf:
            sub_blocks.append(buf)
        if all(len(sb) <= max_size for sb in sub_blocks):
            return sub_blocks

    # Hard split fallback
    hard_chunks = []
    rem = block.strip()
    while len(rem) > max_size:
        split_at = rem.rfind(" ", 0, max_size)
        if split_at == -1 or split_at < max_size // 2:
            split_at = max_size
        hard_chunks.append(rem[:split_at].strip())
        rem = rem[split_at:].strip()
    if rem:
        hard_chunks.append(rem)

    return hard_chunks


def chunk_text(
    body: str,
    min_size: int = 1000,
    max_size: int = 1500,
    overlap_size: int = 150,
) -> list[str]:
    """
    Splits markdown body into sections within target [min_size, max_size] (best-effort),
    with ~overlap_size overlap, respecting paragraph and header boundaries.
    Guarantees no chunk exceeds max_size. Prevents orphan trailing headers and duplicates.
    """
    if not body or not body.strip():
        return []

    body = body.strip()

    # Small documents remain a single chunk
    if len(body) <= max_size:
        return [body]

    raw_paragraphs = [p.strip() for p in body.split("\n\n") if p.strip()]

    # Normalize: split any paragraph that is individually > max_size
    paragraphs = []
    for p in raw_paragraphs:
        if len(p) > max_size:
            paragraphs.extend(split_oversized_block(p, max_size))
        else:
            paragraphs.append(p)

    chunks = []
    current_chunk = ""
    carry_over_headings = []

    for para in paragraphs:
        if carry_over_headings:
            para = "\n\n".join(carry_over_headings) + "\n\n" + para
            carry_over_headings = []

        if not current_chunk:
            current_chunk = para
            continue

        candidate_len = len(current_chunk) + len(para) + 2

        if candidate_len <= max_size:
            current_chunk += "\n\n" + para
        else:
            # Check if current_chunk is below min_size and can absorb partial sentences from para
            para_to_carry = para
            if len(current_chunk) < min_size and re.search(r"[.!?]\s+", para):
                sentences = re.split(r"(?<=[.!?])\s+", para)
                absorbed = []
                remaining = []
                for s in sentences:
                    if not remaining and len(current_chunk) + len(s) + 1 <= max_size:
                        current_chunk += " " + s
                        absorbed.append(s)
                    else:
                        remaining.append(s)

                if absorbed:
                    if remaining:
                        para_to_carry = " ".join(remaining)
                    else:
                        # All sentences fit into current_chunk! No remaining text from this paragraph.
                        para_to_carry = ""

            if not para_to_carry:
                # The entire paragraph was absorbed into current_chunk without overflow.
                # Continue accumulating subsequent paragraphs or flush if full.
                if len(current_chunk) >= min_size:
                    cleaned_chunk, trailing = strip_trailing_headings(current_chunk)
                    if cleaned_chunk:
                        chunks.append(cleaned_chunk)
                        carry_over_headings.extend(trailing)
                    elif trailing:
                        carry_over_headings.extend(trailing)
                    current_chunk = ""
                continue

            # Prevent orphan trailing headings at chunk boundary
            cleaned_chunk, trailing = strip_trailing_headings(current_chunk)
            if cleaned_chunk:
                chunks.append(cleaned_chunk)
                carry_over_headings.extend(trailing)
            elif trailing:
                carry_over_headings.extend(trailing)

            # Calculate overlap from the end of the finalized chunk
            overlap = get_overlap_prefix(cleaned_chunk, overlap_size) if cleaned_chunk else ""

            # Preserve carried headings safely in active_headings
            active_headings = list(carry_over_headings)
            carry_over_headings = []

            # Try 1: active_headings + overlap + para_to_carry
            parts_with_overlap = []
            if active_headings:
                parts_with_overlap.append("\n\n".join(active_headings))
            if overlap:
                parts_with_overlap.append(overlap)
            parts_with_overlap.append(para_to_carry)

            candidate_with_overlap = "\n\n".join(parts_with_overlap).strip()

            if len(candidate_with_overlap) <= max_size:
                current_chunk = candidate_with_overlap
            else:
                # Try 2: Drop overlap, preserve active_headings + para_to_carry
                parts_without_overlap = []
                if active_headings:
                    parts_without_overlap.append("\n\n".join(active_headings))
                parts_without_overlap.append(para_to_carry)

                candidate_no_overlap = "\n\n".join(parts_without_overlap).strip()
                if len(candidate_no_overlap) <= max_size:
                    current_chunk = candidate_no_overlap
                else:
                    # Headings + paragraph still exceed max_size.
                    # Emit active_headings as their own chunk so they are NEVER lost!
                    if active_headings:
                        chunks.append("\n\n".join(active_headings))
                    current_chunk = para_to_carry

    if carry_over_headings:
        if current_chunk:
            current_chunk = "\n\n".join(carry_over_headings) + "\n\n" + current_chunk
        else:
            current_chunk = "\n\n".join(carry_over_headings)

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    # Final verification: guarantee no chunk exceeds max_size
    final_chunks = []
    for c in chunks:
        if len(c) > max_size:
            final_chunks.extend(split_oversized_block(c, max_size))
        elif c.strip():
            final_chunks.append(c.strip())

    return final_chunks


def derive_doc_id(file_path: Path, input_dir: Path) -> str:
    """
    Derives a stable document ID from the file's normalized POSIX path
    relative to input_dir, without suffix.
    """
    rel = file_path.relative_to(input_dir)
    return rel.with_suffix("").as_posix()


def process_markdown_file(
    file_path: Path,
    input_dir: Path,
) -> tuple[dict, list[dict]]:
    """
    Reads a single markdown file, parses frontmatter, splits into chunks,
    and returns (doc_manifest_entry, list_of_chunk_records).
    """
    raw_bytes = file_path.read_bytes()
    source_hash = hashlib.sha256(raw_bytes).hexdigest()
    raw_text = raw_bytes.decode("utf-8", errors="replace")

    doc_id = derive_doc_id(file_path, input_dir)
    fm, body = parse_frontmatter(raw_text)

    title = fm.get("title", file_path.stem.replace("-", " ").title())
    category = fm.get("category", "general-resources")

    # Ensure source_url is always populated (KnowledgeEntry requires non-null source_url)
    raw_url = fm.get("source") or fm.get("reference_url") or ""
    source_url = raw_url if raw_url.strip() else f"doc:{doc_id}"

    language = fm.get("language", "en")
    ingested_date = fm.get("ingested_date", "")

    text_chunks = chunk_text(body)
    records = []

    for idx, chunk in enumerate(text_chunks):
        content_hash = hashlib.sha256(chunk.encode("utf-8")).hexdigest()
        records.append({
            "doc_id": doc_id,
            "title": title,
            "category": category,
            "source_url": source_url,
            "chunk_index": idx,
            "chunk_text": chunk,
            "content_hash": content_hash,
            "metadata": {
                "doc_id": doc_id,
                "doc_type": "resource",
                "language": language,
                "ingested_date": ingested_date,
                "file_name": file_path.name,
                "char_count": len(chunk),
            },
        })

    manifest_entry = {
        "doc_id": doc_id,
        "file_path": file_path.relative_to(input_dir).as_posix(),
        "source_url": source_url,
        "source_hash": source_hash,
        "chunk_count": len(records),
    }

    return manifest_entry, records


def process_directory(
    input_dir: Path,
    output_file: Path,
    output_format: str = "envelope",
    allow_empty: bool = False,
) -> dict | list:
    """
    Recursively scans markdown files in input_dir and exports structured
    manifest and chunk records to output_file.
    """
    if not input_dir.exists() or not input_dir.is_dir():
        print(f"[!] Error: Input directory does not exist: {input_dir}")
        sys.exit(1)

    # Recursive discovery (rglob)
    md_files = sorted(
        [p for p in input_dir.rglob("*.md") if not p.name.startswith(".")],
        key=lambda p: p.as_posix(),
    )

    if not md_files:
        if not allow_empty:
            print(
                f"[!] Error: No .md files found in {input_dir}. "
                "Refusing to write empty manifest without --allow-empty to prevent accidental deletion."
            )
            sys.exit(1)

        print(f"[!] Warning: No .md files found in {input_dir} (--allow-empty was specified)")
        payload = {
            "pipeline_version": PIPELINE_VERSION,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "is_complete_run": False,
            "allow_prune": False,
            "total_documents": 0,
            "total_chunks": 0,
            "manifest": [],
            "chunks": [],
        }
        output_file.parent.mkdir(parents=True, exist_ok=True)
        content_to_write = payload if output_format == "envelope" else []
        output_file.write_text(json.dumps(content_to_write, indent=2, ensure_ascii=False), encoding="utf-8")
        return content_to_write

    all_manifest = []
    all_chunks = []
    print(f"[*] Processing {len(md_files)} Markdown files recursively from: {input_dir}")

    for md_file in md_files:
        manifest_entry, chunks = process_markdown_file(md_file, input_dir)
        all_manifest.append(manifest_entry)
        all_chunks.extend(chunks)

    payload = {
        "pipeline_version": PIPELINE_VERSION,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "is_complete_run": True,
        "allow_prune": (output_format == "envelope"),
        "total_documents": len(all_manifest),
        "total_chunks": len(all_chunks),
        "manifest": all_manifest,
        "chunks": all_chunks,
    }

    content_to_write = payload if output_format == "envelope" else all_chunks
    output_file.parent.mkdir(parents=True, exist_ok=True)
    output_file.write_text(
        json.dumps(content_to_write, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print(f"[✓] Extraction complete!")
    print(f"    - Files processed: {len(md_files)}")
    print(f"    - Total chunks created: {len(all_chunks)}")
    if all_chunks:
        avg_len = sum(len(c["chunk_text"]) for c in all_chunks) // len(all_chunks)
        max_c = max(len(c["chunk_text"]) for c in all_chunks)
        min_c = min(len(c["chunk_text"]) for c in all_chunks)
        print(f"    - Chunk lengths: min={min_c}, avg={avg_len}, max={max_c} chars")
    print(f"    - Format: {output_format}")
    print(f"    - Output saved to: {output_file}")

    return content_to_write


def main():
    parser = argparse.ArgumentParser(
        description="Chunk Dallas College Markdown files into structured JSON for KnowledgeBase import."
    )
    parser.add_argument(
        "-i", "--input-dir",
        type=Path,
        default=Path("./markdowns"),
        help="Path to folder containing Markdown (.md) files (default: ./markdowns)",
    )
    parser.add_argument(
        "-o", "--output",
        type=Path,
        default=Path("./extracted_chunks.json"),
        help="Path for output JSON file (default: ./extracted_chunks.json)",
    )
    parser.add_argument(
        "--format",
        choices=["envelope", "list"],
        default="envelope",
        help="Output format: 'envelope' with manifest & chunks (default) or 'list' for flat array",
    )
    parser.add_argument(
        "--allow-empty",
        action="store_true",
        help="Explicitly permit empty scan when 0 markdown files are found",
    )

    args = parser.parse_args()
    process_directory(
        args.input_dir,
        args.output,
        output_format=args.format,
        allow_empty=args.allow_empty,
    )


if __name__ == "__main__":
    main()
