# PTK Project Meeting Notes - November 3, 2026

**Purpose:** Project kickoff, team organization, development workflow, and planning for the PTK AI Chatbot project.

## Executive Summary
The team aligned on project management practices, GitHub workflows, Scrum methodology, team responsibilities, AI-assisted development guidelines, and the initial strategy for collecting and preparing data for an AI-powered chatbot. The chatbot will help users access Dallas College and community support resources, with a strong focus on accessibility, mobile usability, and multilingual support.

---

## Project Overview

### Objective
Develop an AI-powered chatbot that can provide users access to resources such as:
- Dallas College services
- Counseling resources
- ESL programs
- Refugee support services
- Community resources
- Student services and programs

### Key Success Factors
- Easy-to-use interface
- Accurate information retrieval
- Mobile-friendly design
- Multilingual support
- Reliable and maintainable codebase
- Effective collaboration among team members

---

## Development Methodology

### Agile / Scrum Framework
The team agreed to use Agile Scrum practices throughout the project.

### Workflow Structure
`User Story` $\rightarrow$ `Epic (Major Feature)` $\rightarrow$ `Tasks` $\rightarrow$ `GitHub Issues` $\rightarrow$ `Pull Requests` $\rightarrow$ `Review & Merge`

### Sprint Plan
- Three total sprints available
- Frequent reviews and testing
- Continuous iteration and feedback
- Early delivery of working prototypes

---

## GitHub Workflow

### Team Collaboration Process
1. **Step 1: Create an Issue**  
   Issues represent tasks or problems to solve. Examples:
   - Create frontend page
   - Build database schema
   - Collect resource URLs
   - Generate markdown content
2. **Step 2: Assign Ownership**  
   Team members assign themselves to an issue before beginning work.
3. **Step 3: Create a Branch**  
   All work should be completed in separate branches.
4. **Step 4: Submit Pull Request**  
   Developers submit Pull Requests (PRs) describing what changed, why it changed, and which issue it resolves.
5. **Step 5: Peer Review**  
   Another team member reviews the code before merging.
6. **Step 6: Merge and Close**  
   Once approved, merge PR, close issue, and mark task complete.

---

## AI Development Standards

### Shared `agents.md`
The team will maintain a common `agents.md` file to ensure all AI assistants behave consistently.

**Purpose:**
- Shared development rules
- Consistent code generation
- Reduced merge conflicts
- Shared project context
- Improved collaboration

**Proposed Guideline:**
- Modify only required files
- Preserve project structure
- Follow existing coding conventions
- Avoid unnecessary refactoring
- Keep changes focused on assigned tasks

---

## Team Structure

### Front-End Team
- **Lead:** Lastor Bautista, Neftali
- **Responsibilities:** Landing page, user interface, mobile experience, navigation, accessibility, visual design.

### Back-End Team
- **Lead:** Alexander (mentioned during meeting)
- **Responsibilities:** Database architecture, AI integration, APIs, data models, knowledge retrieval systems.

### Data Collection Team
- **Responsibilities:** Collect resources, gather URLs and PDFs, convert information into AI-friendly formats, maintain knowledge base.

---

## Technical Stack

### Front End
- Next.js
- React
- TypeScript

### Back End
- PostgreSQL database
- AI model integration
- Retrieval/knowledge-base architecture

### Supporting Tools
- GitHub, GitHub Issues, GitHub Pull Requests
- Google Drive, Google Sheets
- AI-assisted development tools

---

## Data Strategy

### Immediate Goal
Build an initial knowledge base for chatbot testing.

### Sources
- Official Dallas College webpages
- Counseling resources
- Community support organizations
- Refugee support services
- ESL resources

### Data Collection Process
1. **Phase 1:** Identify relevant webpages.
2. **Phase 2:** Store URLs in Google Sheets.
3. **Phase 3:** Extract content.
4. **Phase 4:** Convert content into Markdown.
5. **Phase 5:** Load into chatbot knowledge base.

### Content Format Decision
The team agreed to prioritize **Markdown** ($\checkmark$) instead of **PDFs** ($\boldsymbol{\times}$) because:
- Smaller size
- Easier parsing
- Better AI processing
- Faster retrieval

---

## Information Provided During Meeting

### Resource Collection
Morales Mendoza, Romulo Rodrigo reported receiving materials from the Dallas College Counseling Department.

**Deliverables:**
- PDF documents
- Resource links
- Community information
- Counseling resources

*Action:* Create shared Google Drive and upload all materials.

### Language Support Request
Additional languages requested:
- Dari
- Pashto

The team agreed to evaluate adding support for these languages in future releases.

---

## UI / UX Decisions

### Mobile-First Design
The team expects most users to access the chatbot from phones.
- **Design priorities:** Large buttons, high visibility, simple navigation, few clicks to complete tasks.

### Homepage Design
- **Decision:** Users should not immediately enter the chatbot.
- **Recommended flow:** `Landing Page` $\rightarrow$ `Service Overview` $\rightarrow$ `Clickable Visual Options` $\rightarrow$ `Chatbot`

### Visual Navigation
Use visual icons instead of text-heavy navigation:
- 💬 Chat Assistance
- 💰 Financial Support
- 🎓 Education Services
- 🏠 Community Resources

The goal is to reduce language barriers and improve accessibility.

### Accessibility Guidelines
- Culturally neutral icons
- Avoid country-specific symbols
- Avoid politically sensitive colors
- Minimize reliance on English text
- Support multilingual users whenever possible

---

## Risks Identified

1. **Data Quality Risk:** Finding relevant data, cleaning the data, organizing the data, maintaining consistency.
2. **AI Reliability Risk:** Fully autonomous development agents should not be trusted; human review is required; AI-generated code must be validated before merging.
3. **Chatbot Safety Concerns:** The chatbot should avoid giving medical advice, providing unverified information, making recommendations without evidence, or misrepresenting counseling or healthcare services.

---

## Action Items

| Owner | Task |
| :--- | :--- |
| Lastor Bautista, Neftali | Create issues, manage workflow, maintain `agents.md` |
| Morales Mendoza, Romulo Rodrigo | Upload PDFs and URLs to Google Drive |
| Front-End Team | Build mobile-first layout and landing page |
| Back-End Team | Define schemas and knowledge-base architecture |
| Data Team | Find Dallas College resources and convert to markdown |
| All Members | Clone repository, choose issues, begin assigned work |

---

## Next Steps

### Week 1
- Setup repository
- Create issues
- Organize Google Drive
- Gather URLs and documents

### Week 2
- Build initial frontend
- Create mock data
- Develop database structure

### Week 3
- Integrate chatbot
- Load real data
- Begin testing

### Final Phase
- User testing
- Bug fixes
- PTK review
- Deployment preparation

---

## Meeting Outcome
The team successfully established a project workflow, assigned initial responsibilities, selected core technologies, documented a data collection strategy, and aligned on an accessibility-focused vision for the PTK AI chatbot. The next priority is collecting and organizing Dallas College resource data so development can proceed in parallel across front-end, back-end, and data teams.