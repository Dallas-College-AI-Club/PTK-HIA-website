# Project Meeting Summary
**Date:** November 17, 2026  
**Source:** Project meeting-20261117_212425UTC-Meeting Recording.mp4

---

# Overview

The meeting focused on progress for the PTK/Dallas College chatbot project, backend development, AI model selection, issue assignments, project timeline updates, and preparation for the final demonstration event.

---

# Project Updates

## Multilingual Embeddings

Neftali reported that the team decided not to use the previous embedding model because it was optimized primarily for English. Instead, the project will use a multilingual embedding model that supports over 100 languages.

### Benefits
- Improved multilingual support
- Better retrieval quality for non-English content
- Consistency across backend and frontend systems

---

# Backend Progress

## Data Pipeline

Current backend work includes:

- Adding vector embeddings to JSON data
- Preparing data ingestion scripts
- Building knowledge-search functionality
- Integrating embeddings into the chatbot workflow

## Database & Issues

The backend team is working on:

- Issue #16
- Issue #32
- Backend folder setup
- API endpoint development

---

# Chatbot Development

## AI SDK Integration

Planned architecture:

- Tool-calling support through the Vercel AI SDK
- Search knowledge tool integration
- Development testing environment
- Production chatbot page
- Routing through route.ts
- Tool validation using Zod schemas

---

# Frontend Development

## Chat UI

The team discussed:

- Building the customer-facing chatbot interface
- Using ShadCN components
- Separating production and testing environments
- Supporting AI tool tracing during development

Related Issues:
- Issue #52: Client-facing chatbot page
- Issue #38: Development/testing environment

---

# Timeline and Demo Updates

## Final Event

Romulo Rodrigo shared updated scheduling information:

- Final presentation expected on December 4
- Tentative time: 6:00 PM–8:00 PM
- Project deadline may move to December 2 or December 3
- Confirmation expected shortly

---

# Branding Discussion

The team discussed project branding, logo ideas, and PTK social media resources.

---

# Development Workflow Decisions

- Centralized tool routing through route.ts
- Zod validation schemas
- AI-determined tool selection based on context
- Modular tool architecture

---

# Data Processing Decisions

Preferred workflow:

1. Extract content into JSON
2. Generate embeddings separately
3. Keep processing stages modular

---

# Action Items

- Complete multilingual embedding implementation
- Add embeddings to JSON dataset
- Continue Issues #16 and #32
- Build chatbot client page
- Build development test environment
- Finalize search knowledge tool integration
- Upload project data and create PRs
- Confirm presentation schedule

---

# Key Takeaways

1. Multilingual embeddings were selected.
2. Backend efforts focus on search and retrieval.
3. Frontend efforts focus on chatbot implementation.
4. Final presentation is tentatively scheduled for December 4.
5. Additional time may be available due to the adjusted deadline.
6. The platform architecture will use Vercel AI SDK, tool calling, and structured validation.
