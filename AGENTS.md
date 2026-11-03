<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# AGENTS.md — Dallas College PTK x AI Club HIA Project

> **Repository:** [Dallas-College-AI-Club/PTK-HIA-website](https://github.com/Dallas-College-AI-Club/PTK-HIA-website)  
> **Initiative:** Phi Theta Kappa (PTK) Honors in Action (HIA) Resource Hub & Student Connection Portal  
> **Partners:** Dallas College AI Club & Phi Theta Kappa  

---

## 1. Project Overview & Mission

This project is a high-accessibility web platform built in collaboration between the **Dallas College AI Club** and **Phi Theta Kappa (PTK)** for the Honors in Action (HIA) initiative. 

The application serves non-traditional students, working parents, ESL learners, and refugee students across Dallas College campuses by:
1. Providing an intuitive, multilingual resource directory and AI-guided knowledge base (RAG).
2. Offering a **"Get Connected"** triage flow that links students directly with appropriate Dallas College success coaches, counseling, childcare, transit, and academic resources.

---

## 2. Tech Stack

| Component | Technology | Description / Role |
| :--- | :--- | :--- |
| **Framework** | **Next.js** (App Router, TypeScript) | Modern React framework for SSR, static generation, API routes, and fast rendering. |
| **AI / RAG** | **OpenRouter** | Gateway for LLM inference (e.g., multilingual querying, RAG synthesis over campus guides). |
| **Database** | **Neon** (Serverless PostgreSQL) | Relational storage for student inquiries ("Get Connected" form), directory data, and audit logs. |
| **Hosting & CI/CD** | **Vercel** | Automated preview environments, production deployment, and serverless edge functions. |
| **Styling** | **Tailwind CSS / Clean CSS** | Lightweight, high-contrast, accessible UI adhering to Dallas College blue/yellow branding. |


## 4. Agile Operating System for AI Agents

> [!IMPORTANT]
> **RULE FOR AGENTS: DO NOT WORK ON OPEN-ENDED, AMBIGUOUS PROMPTS.**  
> AI agents interacting with this repository MUST operate under standard Agile practices. All work must be scoped to specific **User Stories / GitHub Issues** with verifiable Acceptance Criteria.

### Why Agile for Agents?
* Eliminates scope creep and hallucinated features.
* Guarantees testable, incrementally reviewable pull requests.
* Preserves clear boundaries between frontend, RAG, and database logic across the team.

### Sprint Cadence
* **Duration:** 3 one-week sprints total.
* **Leadership:** Rotating Scrum Master every week (Week 1, Week 2, Week 3).
* **Task Management:** Every development task must have a corresponding **GitHub Issue**.
* **Documentation Rule:** All technical decisions and setup steps must be documented in **plain English** so non-developer team members (e.g., PTK partners) can follow.

---

## 5. Standard Agile Story Template for Agents

When breaking down features or asking an agent to implement work, format requirements using this structure:

```markdown
### [Sprint X][Domain: Frontend|Backend|DB|RAG] <Short Descriptive Title>

**GitHub Issue:** #<Issue_Number>  

#### 1. User Story
As a [user/student/stakeholder persona],  
I want [clear, specific capability],  
So that [valuable outcome or benefit].

#### 2. Acceptance Criteria (AC)
- [ ] AC 1: Specific observable behavior.
- [ ] AC 2: Form validation / error handling rules.
- [ ] AC 3: Mobile responsiveness and accessibility checks.
- [ ] AC 4: Test case or validation requirement.

#### 3. Technical Implementation Details
- **Target Files / Directories:** `src/app/...`, `src/lib/...`, `src/components/...`
- **Database / Schema Changes:** Neon tables, migrations, or DDL impact.
- **API / AI Touchpoints:** Endpoints or OpenRouter prompt contracts.
- **Dependencies:** Any third-party libraries needed.

#### 4. Definition of Done (DoD)
- [ ] Code compiles cleanly with no linter/type errors.
- [ ] Code follows Dallas College design constraints (colors, accessibility).
- [ ] Plain-language update added to project documentation / release notes.
- [ ] Pull request linked to GitHub Issue with brief before/after verification.
```

---

## 6. MVP Scope & Feature Breakdown

### Feature A: Multilingual Campus Resource Navigator (RAG)
* **Goal:** Allow students to query campus resources in their native language and receive grounded answers from verified PTK documents.
* **Core Resource Topics:**
  1. **Night ESL schedules:** Class locations, registration timelines, entry requirements.
  2. **Tuition:** Payment plans, tuition deadlines, FAFSA/TASFA assistance.
  3. **Childcare program:** Campus childcare centers, childcare subsidies/assistance.
  4. **Free student transit pass:** DART GoPass setup, eligibility requirements.
  5. **Refugee scholarships and aid:** Emergency grants, specialized community aid.
  6. **Counseling services:** Mental health appointments, crisis support, academic counseling.
* **Target Languages:**
  * English (Default UI)
  * Spanish (*validated by Alex*)
  * Arabic
  * Burmese
  * Swahili
* **Ingestion Schedule:** PTK supplies verified data by ~Nov 6. Backend team builds base app shell and mock schemas in parallel.

### Feature B: "Get Connected" Student Triage Form
* **Goal:** Simple form to capture student needs and route them to designated success coaches (e.g., graduating seniors, parents needing counseling, mothers needing childcare).
* **Fields:**
  * Full Name
  * Student ID / Email / Phone
  * Preferred Language (English, Spanish, Arabic, Burmese, Swahili)
  * Student Category / Situation (e.g., Graduating Senior, Parent, Refugee, ESL Learner)
  * Primary Need (Childcare, Transit, Counseling, Tuition, Advising)
  * Notes / Additional Context
* **Backend:** Persisted to Neon PostgreSQL. Input validation and user-friendly success confirmation.

### Feature C: Accessible Design System
* **Aesthetics:** Simple, uncluttered, solid colors, legible high-contrast typography (system fonts or standard sans-serif).
* **Color Palette:** Dallas College Blue and Gold/Yellow accents.
* **Footer Requirement:**
  * Text: *"Powered by PTK and AI Club at Dallas College"*
  * Link: Dallas College PTK Instagram profile.
* **Internationalization (i18n):** English interface for MVP, but primary navigation buttons, search prompts, and form placeholders should support localization tags.

---

## 7. AI Agent Work Breakdown Instructions

When prompting an AI agent to break down or tackle work from this file, use the following prompts:

### Recipe 1: "Break an Epic into Sprint Stories"
> *"Act as the Scrum Master for the PTK-HIA-website project. Read `AGENTS.md`. Take Feature [A/B/C] and break it into granular, sprint-ready User Stories formatted according to Section 5. Ensure each story is scoped to under 2 days of work and can be converted into a GitHub Issue."*

### Recipe 2: "Execute an Issue/Story"
> *"Act as a Full-Stack Engineer on the Dallas College AI Club team. Implement GitHub Issue #[X]: [Story Title] as specified in `AGENTS.md`. Strictly adhere to the tech stack (Next.js, Neon, OpenRouter) and confirm all Acceptance Criteria are met before finishing."*

### Recipe 3: "Plain Language Documentation"
> *"Act as the Technical Writer (Thanh's role). Review the changes made in Story #[X] and provide a plain-English summary of what was built, how PTK members can test it, and any questions needing clarification from Counseling or ESL."*

---

## 8. Development Etiquette & Branching
1. **Branch Naming:** `feat/issue-<number>-<short-description>`, `fix/issue-<number>-<description>`
2. **Commit Messages:** Follow conventional commits: `feat(rag): add openrouter fallback handler (#12)`
3. **No Secret Commits:** OpenRouter keys and Neon connection strings must live exclusively in `.env.local` / Vercel Environment Variables. Never commit `.env` files.
