# How to Convert Dallas College Resources & PDFs into Markdown
**Project:** Dallas College PTK x AI Club Honors in Action (HIA)  
**Audience:** Phi Theta Kappa (PTK) team members, student researchers, and AI Club developers  

---

## 1. Why Do We Convert Files to Markdown?

Our website features an AI chatbot that helps non-traditional students, working parents, ESL learners, and refugees navigate Dallas College. 

To give accurate, grounded answers, the AI needs to read Dallas College resource pages and PDF brochures in **clean Markdown format (`.md`)**. 

Markdown strips away web design clutter (like menus, footers, search buttons, and logos) and leaves only the verified, high-quality information:
- Requirements and step-by-step instructions
- Contact names, phone numbers, and emails
- Operating hours and campus room numbers
- Deadlines and links to official forms

---

## 2. How to Convert Resources

You can convert any Dallas College webpage URL or PDF document using the conversion script in `apps/data/ptk_data/pipeline/convert_to_markdown.py`.

### Method 1: Interactive Prompt (No CLI arguments needed)
1. Open your terminal or Command Prompt in the repository root.
2. Run:
   ```cmd
   python apps/data/ptk_data/pipeline/convert_to_markdown.py
   ```
3. When prompted:
   `Enter PDF file path or Dallas College web URL:`
   Paste your link or PDF file path and press **Enter**.
4. **Done!** The cleaned `.md` file is automatically placed inside `Resources/PageMarkdowns/`.

---

### Method 2: Direct Command Line (Fastest)
From the project root directory, run:
```cmd
python apps/data/ptk_data/pipeline/convert_to_markdown.py "https://www.dallascollege.edu/services/tutoring/"
```
Or for a local PDF:
```cmd
python apps/data/ptk_data/pipeline/convert_to_markdown.py "C:\path\to\my-flyer.pdf"
```
Or for an entire folder of PDFs:
```cmd
python apps/data/ptk_data/pipeline/convert_to_markdown.py "C:\path\to\pdf_folder"
```

---

## 3. Where Do the Converted Files Go?

All converted markdown documents are automatically saved into:
📁 **`Resources/PageMarkdowns/`**

Each file automatically receives standardized **metadata headers** (YAML frontmatter) at the very top:
```yaml
---
title: "DART Student GoPass"
category: transportation
language: en
mock: false
source: "https://www.dallascollege.edu/resources/dart-gopass/"
ingested_date: "2026-11-09"
---
```
This metadata tells our AI chatbot the topic category, the official source URL to cite in student responses, and ensures all data is marked as official verified content (`mock: false`).

---

## 4. How Does the Tool Work Under the Hood?

Even though we are not using a heavyweight web-scraping framework, here is how the lightweight script processes information:

### A. How Webpages Are "Scraped" and Cleaned
1. **Fetching:** The script makes a standard secure web request (`requests.get`) to download the webpage HTML.
2. **Decluttering:** It uses `BeautifulSoup` to scan the page and remove non-content elements:
   - Navigation bars, menus, and breadcrumb links
   - Site headers and footers
   - Search boxes, cookie banners, and social share buttons
3. **Markdown Conversion:** The remaining main article text is passed through `markdownify`, which transforms HTML headings (`<h1>`, `<h2>`), bullet points, and tables into clean Markdown text.
4. **PDF Discovery:** The script scans the page for any linked PDF documents (such as printable guides or forms) and flags them so they can be reviewed and converted as well.

### B. How PDFs Are Read and Converted
PDFs are not plain text files; they are graphic layout instructions designed for printers and screens. Converting them accurately without scrambling tables or columns requires layout intelligence:
1. **Layout & Text Extraction (`pymupdf4llm`):**
   - The script opens the PDF and inspects the visual positioning of text blocks, font sizes, and bounding boxes.
   - It distinguishes between major titles, section headers, bullet lists, and paragraphs based on visual hierarchy.
2. **Table Reconstruction:**
   - Instead of jumbling table cells into a paragraph of random numbers, the tool recognizes table borders and columns, translating them into standard Markdown tables:
     ```markdown
     | Location | Service | Hours |
     | --- | --- | --- |
     | North Campus | Free Pantry | Mon–Thu 9 a.m.–4 p.m. |
     ```
3. **Safety & Policy Guardrails:**
   - In accordance with project guidelines, the tool tags each document with its proper topic category and verifies that no sensitive personal data collection requests (such as immigration status) are stored in the knowledge base.

