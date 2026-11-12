#!/usr/bin/env python3
"""
Dallas College PTK HIA - PDF and Webpage to Markdown Converter

Converts local PDF files or Dallas College web pages into clean, structured Markdown 
with standard YAML frontmatter for the chatbot knowledge base (PageMarkdowns).

Usage:
    python convert_to_markdown.py "path/to/document.pdf"
    python convert_to_markdown.py "https://www.dallascollege.edu/students/dreamers/"
    python convert_to_markdown.py "path/to/folder_with_pdfs"
"""

import sys
import os
import re
from pathlib import Path
from datetime import datetime
import requests
from bs4 import BeautifulSoup
import markdownify
import pymupdf4llm


def resolve_resources_dir():
    """Finds the Resources/PageMarkdowns directory across shortcuts and workspaces."""
    repo_root = Path(__file__).resolve().parents[4] if len(Path(__file__).resolve().parents) >= 5 else Path.cwd()
    candidates = [
        Path(r"G:\.shortcut-targets-by-id\1lLbHqcncL6a9hxh5k7f2kEIe_yRjmTHY\Resources\PageMarkdowns"),
        repo_root / "Resources" / "PageMarkdowns",
        Path("Resources/PageMarkdowns"),
        Path("PageMarkdowns"),
    ]
    for c in candidates:
        if c.parent.exists():
            c.mkdir(parents=True, exist_ok=True)
            return c
    # Fallback to local PageMarkdowns folder
    fallback = Path("PageMarkdowns")
    fallback.mkdir(parents=True, exist_ok=True)
    return fallback


def slugify(text: str) -> str:
    """Converts a title or filename into a clean kebab-case slug."""
    text = re.sub(r"[^\w\s-]", "", text).strip().lower()
    return re.sub(r"[-\s]+", "-", text)


def infer_category(title: str, content: str, source: str = "") -> str:
    """Infers the category tag based on keywords in title, content, and source URL."""
    text = (title + " " + source + " " + content[:1500]).lower()
    if any(k in text for k in ["esl", "esol", "english as a second language", "workreadyu"]):
        return "english-language-learning"
    if any(k in text for k in ["counseling", "mental health", "crisis", "psychological", "caps"]):
        return "counseling"
    if any(k in text for k in ["child care", "childcare", "daycare", "epic", "parent"]):
        return "childcare"
    if any(k in text for k in ["transit", "dart", "gopass", "bus", "train", "transportation"]):
        return "transportation"
    if any(k in text for k in ["dreamer", "daca", "refugee", "immigrant", "newcomer", "undocumented"]):
        return "refugee-and-newcomer-support"
    if any(k in text for k in ["tuition", "payment plan", "refund", "cost per credit"]):
        return "tuition"
    if any(k in text for k in ["fafsa", "tasfa", "financial aid", "grant", "work-study"]):
        return "financial-aid"
    if any(k in text for k in ["pantry", "food", "hunger", "groceries", "basic needs"]):
        return "basic-needs"
    if any(k in text for k in ["health center", "nurse", "clinic", "vaccine", "meningitis"]):
        return "health-services"
    if any(k in text for k in ["laptop", "hotspot", "technology lending", "calculator"]):
        return "technology-access"
    if any(k in text for k in ["tutor", "learning commons", "writing center", "math lab"]):
        return "academic-support"
    if any(k in text for k in ["accessibility", "disability", "accommodations", "dsso"]):
        return "accessibility-services"
    if any(k in text for k in ["career", "resume", "interview", "job", "employment"]):
        return "career-services"
    return "general-resources"


def convert_pdf_to_markdown(pdf_path: Path) -> tuple[str, str, str]:
    """
    Extracts structured Markdown from a PDF using pymupdf4llm.
    Returns: (title, content, category)
    """
    print(f"[*] Processing PDF: {pdf_path.name}")
    md_content = pymupdf4llm.to_markdown(str(pdf_path))

    # Infer title from PDF filename or first header
    title = pdf_path.stem.replace("-", " ").replace("_", " ").title()
    first_header = re.search(r"^#+\s+(.+)$", md_content, re.MULTILINE)
    if first_header:
        candidate_title = first_header.group(1).strip()
        if len(candidate_title) > 3 and len(candidate_title) < 80:
            title = candidate_title

    # Clean up redundant empty lines
    md_content = re.sub(r"\n{3,}", "\n\n", md_content)

    category = infer_category(title, md_content, pdf_path.name)
    return title, md_content, category


def convert_url_to_markdown(url: str) -> tuple[str, str, str]:
    """
    Fetches a web page and converts main article content to clean Markdown.
    Returns: (title, content, category)
    """
    print(f"[*] Fetching URL: {url}")
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }
    resp = requests.get(url, headers=headers, timeout=20)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    # Extract Page Title
    title = ""
    if soup.find("h1"):
        title = soup.find("h1").get_text(strip=True)
    elif soup.title:
        title = soup.title.get_text(strip=True)
    title = re.sub(r"\s*\|\s*Dallas College.*$", "", title, flags=re.IGNORECASE).strip()

    # If title is overly generic, augment with path context
    url_path = [p for p in url.strip("/").split("/") if p and not p.startswith("http")]
    if url_path and (not title or title.lower() in ["community resources", "resources", "home", "default"]):
        context_slug = url_path[-1].replace("-", " ").title()
        if context_slug.lower() not in title.lower():
            title = f"{context_slug} - {title}" if title else context_slug

    if not title:
        title = "Dallas College Resource"

    # Remove non-content elements
    for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "aside", "svg"]):
        tag.decompose()

    for selector in [
        ".breadcrumbs", ".breadcrumb", ".site-header", ".site-footer", 
        "#header", "#footer", ".alert-banner", ".search-form", ".navbar",
        ".skip-to-content", ".feedback-widget", "#navigation", ".sidebar"
    ]:
        for el in soup.select(selector):
            el.decompose()

    # Find main content container
    main_el = soup.find("main") or soup.find(id="main-content") or soup.find(class_="main-content") or soup.find("article") or soup.body

    # Convert HTML to clean Markdown
    md_content = markdownify.markdownify(
        str(main_el),
        heading_style="ATX",
        strip=["img"],
        bullets="-"
    )

    # Clean up excess whitespace
    md_content = re.sub(r"\n{3,}", "\n\n", md_content).strip()

    category = infer_category(title, md_content, url)
    return title, md_content, category


def save_markdown_document(title: str, body: str, category: str, source: str, output_dir: Path) -> Path:
    """Wraps the content in Dallas College YAML frontmatter and writes to file."""
    slug = slugify(title)
    if not slug:
        slug = f"resource-{datetime.now().strftime('%Y%m%d%H%M%S')}"

    dest_path = output_dir / f"{slug}.md"

    frontmatter = f"""---
title: "{title}"
category: {category}
language: en
mock: false
source: "{source}"
ingested_date: "{datetime.now().strftime('%Y-%m-%d')}"
---

# {title}

{body}
"""
    dest_path.write_text(frontmatter, encoding="utf-8")
    print(f"[✓] Saved Markdown to: {dest_path}")
    return dest_path


def process_input(target: str, output_dir: Path = None):
    """Processes a single PDF file, directory of PDFs, or URL."""
    if output_dir is None:
        output_dir = resolve_resources_dir()

    target = target.strip().strip('"').strip("'")

    if target.startswith("http://") or target.startswith("https://"):
        title, content, category = convert_url_to_markdown(target)
        save_markdown_document(title, content, category, target, output_dir)
    elif os.path.isdir(target):
        pdf_files = list(Path(target).glob("*.pdf"))
        if not pdf_files:
            print(f"[!] No PDF files found in directory: {target}")
            return
        print(f"[*] Found {len(pdf_files)} PDF(s) to convert...")
        for p in pdf_files:
            try:
                title, content, category = convert_pdf_to_markdown(p)
                save_markdown_document(title, content, category, p.name, output_dir)
            except Exception as e:
                print(f"[!] Error processing {p.name}: {e}")
    elif os.path.isfile(target):
        p = Path(target)
        if p.suffix.lower() == ".pdf":
            title, content, category = convert_pdf_to_markdown(p)
            save_markdown_document(title, content, category, p.name, output_dir)
        else:
            print(f"[!] Unsupported file type: {p.suffix}. Please provide a .pdf file or URL.")
    else:
        print(f"[!] Error: Target not found: {target}")


if __name__ == "__main__":
    out_dir = resolve_resources_dir()
    print(f"=== Dallas College PTK Markdown Ingestion Tool ===")
    print(f"Destination: {out_dir}\n")

    if len(sys.argv) > 1:
        for arg in sys.argv[1:]:
            process_input(arg, out_dir)
    else:
        user_input = input("Enter PDF file path or Dallas College web URL: ").strip()
        if user_input:
            process_input(user_input, out_dir)
        else:
            print("No input provided. Exiting.")
