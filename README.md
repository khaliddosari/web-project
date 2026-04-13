# Nusuk (نسق) — AI Elective Recommender

> Personalized elective course recommendations powered by GPT.

---

## Overview

**Nusuk** analyzes a student's past course grades and academic profile, then uses the OpenAI API to recommend the 5 most suitable elective courses from a fixed list of 16 options. Students can either enter grades manually or upload a PDF/CSV transcript.

---

## Architecture

```
Browser → Node/Express → MongoDB (auth/sessions)
              ↓
         OpenAI API (GPT-4o-mini)
```

---

## Project Structure

```
nusuk/
├── client/
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── api.js
│       ├── auth.js
│       ├── recommend.js
│       └── app.js
└── server/
    ├── index.js
    ├── .env
    ├── package.json
    ├── config/
    │   └── electives.js      ← 16 elective definitions
    ├── middleware/auth.js
    ├── models/User.js
    └── routes/
        ├── auth.js
        └── recommend.js      ← OpenAI integration + multer upload
```

---

## Setup

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment

Edit `server/.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/nusuk
SESSION_SECRET=your_secret_here
OPENAI_API_KEY=sk-your-key-here
```

### 3. Run

```bash
npm run dev
# Open http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/recommend/electives` | Yes | List of 16 electives |
| POST | `/api/recommend/manual` | Yes | Recommend from manual grades |
| POST | `/api/recommend/upload` | Yes | Recommend from transcript file |

---

## How It Works

1. Student logs in and enters past grades (or uploads a PDF/CSV transcript)
2. Node server packages the grades + student profile (major, year, GPA)
3. A structured prompt is sent to `gpt-4o-mini` with the 16 electives list
4. GPT returns a JSON array of 5 recommendations, each with a match % and explanation
5. Frontend renders cards with animated match rings

---

## The 16 Electives (Placeholder)

CS: Cloud Computing, Cybersecurity, Mobile Dev, Computer Vision, NLP, Blockchain, Game Dev, Compiler Design

IS: Business Intelligence, ERP, IT Governance, E-Commerce

MATH: Numerical Methods, Probability & Statistics, Graph Theory, Cryptography & Number Theory

> Replace these in `server/config/electives.js` with actual IMSIU electives.

---

## Team Members

| # | Name | Role |
|---|------|------|
| 1 | Member 1 | Frontend & UI (`client/`) |
| 2 | Member 2 | Node Backend & Auth (`server/routes/auth.js`, models) |
| 3 | Member 3 | OpenAI Integration (`server/routes/recommend.js`, `config/electives.js`) |
