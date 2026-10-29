# PTK HIA

**Honors in Action**

A multilingual, mobile-first website that helps refugees, immigrants, and people whose first language isn't English find ESL classes, start college, pay for college, and connect with a real person at Dallas College.

**MVP target:** November 18, 2026. For timeline, decisions, and background, see [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md).

## Contents

1. [About](#about)
2. [Who It's For](#who-its-for)
3. [MVP Features](#mvp-features)
4. [Site Pages](#site-pages)
5. [Design Principles](#design-principles)
6. [Privacy](#privacy)
7. [Success Metrics](#success-metrics)
8. [Future Phases](#future-phases)
9. [Tech Stack](#tech-stack)
10. [Getting Started](#getting-started)
11. [Team](#team)

---

## About

**The problem:** Information about ESL, admissions, and financial aid is mostly in English, which makes it confusing, intimidating, or overwhelming for people whose first language isn't English.

**The solution:** A website with an AI chatbot that answers questions in the user's chosen language, using only documents provided by the PTK research team. When it can't answer, it offers a "Talk to a person / Send email" option. Users can also request contact with a counselor, admissions officer, or peer mentor.

---

## Who It's For

### Refugees and Immigrants

| Persona | Background | Need | Full Description |
|---|---|---|---|
| **John** | From Burma; working; stopped ESL classes | Find and register for night ESL classes; get connected to a counselor/admissions officer | He has come from Burma with his wife and three children. He's got a job and is doing well but has stopped taking English classes. He would like to know how to take English as a Second Language (ESL) classes but doesn't know where to start, how to register, and just having every resource in English is overwhelming and demotivating for him. It would help John to find the website and ask the chatbot about the current ESL night programs at DC as well as getting connected to a counselor/admissions officer. |
| **Amina** | From Syria; former pharmacist; mother of two | Learn how prior education is evaluated; find evening and childcare options; get connected to an advisor (in Arabic) | She is a mother of two from Syria who arrived two years ago. She was a pharmacist back home, but her degree isn't recognized in the U.S., and she works part-time while her kids are in school. She wants to go back to school but doesn't know whether her previous education counts for anything, and childcare is her biggest barrier. It would help Amina to ask the chatbot, in Arabic, how previous education is evaluated, what childcare or evening options exist, and to be connected to an advisor. |
| **Dawit** | From Eritrea; 19; first in family to attend college | Understand financial aid, scholarships, and the free student pass in plain language; get a peer mentor with a similar background | He is 19 and came from Eritrea three years ago with his family. He recently finished high school and assumes college is too expensive since no one in his family has gone. Information about financial aid is confusing and only in English. It would help Dawit to learn about aid, scholarships, and the free student pass in plain language and to be matched with a peer mentor who has a similar background. |
| **Maria** | From Mexico; 34; works full-time days and cleans offices at night | Find weekend certificate programs and how to register (in Spanish) | She is a 34-year-old from Mexico who works full-time during the day and cleans offices at night. She speaks some English, but formal documents and websites feel intimidating. She wants to earn a certificate to get a better job, but only weekends work for her schedule. It would help Maria to ask the chatbot, in Spanish, which programs have weekend classes and how to register. |
| **Hoa** | From Vietnam; 52; relies on her children to translate | Explore English classes privately before contacting anyone | She is a 52-year-old from Vietnam and has lived in Dallas for 10 years. She has always relied on her children to translate. She wants to take English classes for herself so she can gain independence, but is embarrassed to ask in person. A private, judgment-free chatbot lets her explore her options at her own pace and in her own language before deciding to contact someone. |

### Support-Side

| Persona | Role | Need | Full Description |
|---|---|---|---|
| **Sara** | Community caseworker | One shareable link that works in many languages | Works with newly arrived families and needs one link she can share that works in many languages, so she doesn't have to explain college steps individually. |
| **Chris** | PTK/AI club admin | Keep schedules and deadlines accurate without writing code | Uploads updated ESL schedules and scholarship deadlines and needs an easy way to keep the database accurate. |

---

## MVP Features

### For Users

- **Multilingual AI chatbot**
  - Answers only from the knowledge base
  - Responds in the user's chosen language
  - Uses natural translation, not word-for-word
  - Links each answer to its source document
  - Offers "Talk to a person / Send email" when it can't answer
  - Uses an informative tone and encourages users to email in their first language
- **Language selection**
  - Asked when the user opens the site
  - Always visible in the top bar so it can be changed anytime
- **Get Connected**
  - Request contact with a counselor, admissions officer, or peer mentor

### Knowledge Base

- Built from documents provided by the PTK research team: ESL program details, admissions steps, financial aid and scholarship info, and counseling contacts
- For the MVP, the AI club team loads these documents manually

---

## Site Pages

| Page | Contents |
|---|---|
| **Home** | Language selector, short welcome, chatbot box ("Ask a question in your language"), 4 large buttons: Learn English (ESL), Start College, Pay for College, Talk to Someone |
| **Chatbot** | Large chat window, suggested starter questions (e.g., "How do I sign up for night ESL classes?"), "Was this helpful?" button, "Connect me with a person" button |
| **ESL & Classes** | Night and weekend programs, registration steps, locations |
| **Financial Aid & Scholarships** | Plain-language aid explanation, free student pass, scholarship links |
| **Get Connected** | Counselor/admissions request form, peer mentor info, PTK representative contact |

---

## Design Principles

- Few words per screen
- Icons next to text
- Mobile-first (many users will be on phones)
- High contrast
- Navy and gold chapter branding

---

## Privacy

The site does **not** collect immigration status or other sensitive information.

---

## Success Metrics

For the MVP, success is measured mainly by how PTK members experience the site at the refugee center demos. Usage metrics are unprioritized for now; see [Future Phases](#future-phases).

---

## Future Phases

### Cut from the MVP

Planned in the original MVP but moved out to meet the Nov 18 deadline. See the decision log in [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md).

- **Login/sign-up:** email or phone sign-up, guest access, language prompt at every login
- **Admin dashboard:** upload or update documents without code, review content, view usage stats
- **Usage metrics:**
  - Number of users and languages used
  - Chatbot questions answered from the database vs. escalated to a human
  - Number of counselor connection requests
  - "Was this helpful?" feedback

### Later Phases

Out of scope from the start:

- Credential-evaluation guidance
- Childcare resource maps
- Text/WhatsApp access
- Funding plan for 3-year website maintenance

---

## Tech Stack

_TBD_

---

## Getting Started

_TBD_

---

## Team

_TBD_
