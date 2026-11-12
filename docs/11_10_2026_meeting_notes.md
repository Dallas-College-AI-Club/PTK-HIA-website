# Meeting Notes: 11/10/2026

## Summary
The team met to discuss progress on the Dallas College/PTK chatbot project, review pull requests (PRs), coordinate frontend, backend, and data tasks, and plan next steps toward the MVP.

## Key Updates

### Potential Deadline Extension
Morales Mendoza, Romulo Rodrigo reported that the project deadline may be extended by one additional week, though it is not yet confirmed. The extension depends on scheduling an in-person event with project partners.

### Data Collection and Scraping
- Data collection is still in progress.
- Additional Dallas College student health and wellbeing resources were added to the scraping sources.
- **Lastor Bautista, Neftali:**
  - Created mock data.
  - Scraped Dallas College pages and converted content to Markdown.
  - Added a PDF-to-Markdown conversion script and documentation to the pipeline.

### Frontend Status

#### UI and Pages
- Final design has been selected and approved pending review.
- Main site includes:
  - Learn ESL
  - Pay for College
  - Get Connected
  - Ask Questions / Chatbot
- The "Start College" button currently lacks a destination page.
- *Suggested solution:* Link directly to the Dallas College application page.

#### Translation Support
- Team plans to use `next-intl` for multilingual support.
- Language switching will likely be URL-based.
- Translation selector is under development.

#### Chatbot Page
- Chatbot UI page exists with placeholder content.
- Integration with backend remains incomplete.

### Backend Discussion

#### AI and Retrieval Architecture
- Team plans to reuse parts of the previous RAG (Retrieval-Augmented Generation) implementation.
- Existing search tools and vector search approach will be adapted to the new project.
- The same LLM model used previously is expected to support multiple languages.

#### Database Schema
Discussion focused on simplifying the schema compared to the previous project.

**Proposed RAG table fields:**
- Primary Key
- Source URL
- Content Chunk
- Vector Embedding
- Content Hash (deduplication)

*Additional suggestion:* Separate table containing full page content for display/reference purposes.

#### Structured Data
Spreadsheet-type data should likely:
- Be stored in regular SQL tables.
- Use keyword search instead of vector search/RAG.

### Development Process

#### Pull Requests and Reviews
- Several PRs are awaiting merge and review.
- A bug was identified in a batch file due to a hardcoded Python path and needs fixing.
- Team emphasized:
  - Using PR reviews.
  - Avoiding direct merges to main.
  - Assigning ownership of issues to avoid duplicate work.

#### GitHub Workflow
- Repository settings now require at least one approval before merging.

## Team Assignments

### Data Team
- Continue scraping Dallas College resources.
- Convert documents and webpages into Markdown.
- Convert processed data into JSON matching backend schema.

### Backend Team
- Finalize database schema.
- Build data ingestion pipeline.
- Create vector-search infrastructure.
- Reuse Drizzle ORM components from the previous project where possible.

### Frontend Team
- Complete remaining content pages.
- Finish translation implementation.
- Integrate chatbot interface with backend services.
- Build a `/dev/test` route for chatbot testing.

## Action Items

| Action | Owner |
| :--- | :--- |
| Confirm deadline extension | Morales Mendoza, Romulo Rodrigo |
| Review and merge pending PRs | Team |
| Create issue for chatbot backend integration | Lastor Bautista, Neftali |
| Define database schema | Backend Team |
| Convert scraped markdown to JSON | Data Team |
| Set up dev/testing chatbot route | Frontend & Backend Teams |
| Implement chatbot page integration | Frontend Team |
| Continue multilingual support implementation | Frontend Team |
| Fix hardcoded Python path issue | Lastor Bautista, Neftali |
| Review PR from Phan, Thanh | Lastor Bautista, Neftali |

## Main Takeaway
The project is progressing, but the team is still finalizing the data schema and backend architecture. The immediate focus is to complete schema design, finish data preparation, integrate the chatbot, merge pending PRs, and deliver a working multilingual MVP. A possible one-week deadline extension could provide additional development time.