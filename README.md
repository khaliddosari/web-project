# Nusuk (نسق) — AI Elective Recommender

## Overview
Nusuk is an intelligent academic web application designed for **Imam Mohammad Ibn Saud Islamic University (IMSIU)** students. It helps students make informed decisions about their elective courses by analyzing their completed coursework, grades, and academic profile using **Google Gemini AI**.

The system supports three majors: **Computer Science (CS)**, **Information Systems (IS)**, and **Information Technology (IT)**, with a full bilingual interface (Arabic / English).

## Key Features

### 🤖 AI-Powered Recommendations
- Analyzes student's completed courses, grades, major, year, and GPA.
- Recommends the **next-step courses** (core + elective) based on prerequisite completion.
- Splits recommendations into **"Ready Now"** (all prerequisites met) and **"Future"** (prerequisites missing) categories.
- Uses the GPA to gauge academic level — higher GPA students get harder elective suggestions.

### 📚 Full Curriculum Data
- Contains all core courses for CS, IS, and IT with accurate prerequisite chains.
- Includes **12 CS electives**, **5 IS electives**, and **4 IT electives** with full prerequisite mapping.
- Course dropdowns show **all courses for the student's major**, with real-time prerequisite validation — selecting a course without completing its prerequisites triggers a warning.

### 🗺️ Interactive Curriculum Map
- Visual roadmap of **all courses organized by level** (Level 1–8) with prerequisite tags.
- Dedicated **elective courses section** with distinct styling.
- **Clickable cards**: click any course to mark it as completed (green ✓). State is saved in `localStorage`.

### 🌐 Full Bilingual Support (Arabic / English)
- Toggle between Arabic (RTL) and English (LTR) with a single click.
- All UI elements, course names, recommendation results, and history update **instantly** without page reload.
- Course codes translate dynamically (e.g., `عال1242` → `CS1242`).

### 👤 User Profile Management
- Register with username, email, password, major, year, and GPA.
- **Edit profile** anytime by clicking your avatar in the sidebar — change major, year, or GPA.
- Profile updates automatically re-populate the course list.

### 📜 Recommendation History
- All AI recommendations are saved to MongoDB and displayed in the **History** tab.
- History entries show the date, course names, match percentages, and AI reasoning.
- History dynamically switches language when toggling Arabic/English.

### 🔒 Authentication
- Secure registration and login with bcrypt password hashing.
- Session-based authentication using `express-session` with MongoDB store.
- Protected API routes via `requireAuth` middleware.

## Technologies Used

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (custom design system), Vanilla JavaScript (ES6 Classes, ES Modules, `CustomEvent` architecture) |
| **Backend** | Node.js, Express.js, express-session, connect-mongo |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI** | Google Gemini API (`gemini-flash-latest` model via `@google/generative-ai` SDK) |
| **Auth** | bcrypt (password hashing), express-session (session management) |

## Project Structure

```
CS1445-Project/
├── README.md
├── client/
│   ├── index.html              # Main SPA with auth, recommend, history, curriculum pages
│   ├── css/
│   │   └── style.css           # Complete design system (dark theme, glassmorphism, animations)
│   └── js/
│       ├── app.js              # Main App class — routing, language, history, curriculum map, profile modal
│       ├── api.js              # ApiService class — HTTP request wrapper (GET, POST, PUT)
│       ├── auth.js             # Auth class — login, register, session management
│       ├── recommend.js        # Recommend class — grade inputs, prereq validation, AI results rendering
│       └── coursesData.js      # IMSIU curriculum data (all courses, levels, prereqs for CS/IS/IT)
└── server/
    ├── index.js                # Express server entry point (static files, session, routes)
    ├── package.json            # Dependencies
    ├── .env                    # Environment variables (PORT, MONGO_URI, SESSION_SECRET, GEMINI_API_KEY)
    ├── config/
    │   └── electives.js        # Elective courses catalog with prereqs (CS: 12, IS: 5, IT: 4)
    ├── middleware/
    │   └── auth.js             # requireAuth session middleware
    ├── models/
    │   └── User.js             # Mongoose User schema (username, email, password, major, year, gpa, history)
    └── routes/
        ├── auth.js             # POST /register, /login, /logout | GET /me | PUT /profile
        └── recommend.js        # POST /manual | GET /electives, /history
```

## Setup Instructions

### 1. Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local instance or MongoDB Atlas cloud)
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### 2. Installation
```bash
git clone <repository-url>
cd CS1445-Project/server
npm install
```

### 3. Environment Variables
Create a `.env` file inside the `server/` directory:

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
SESSION_SECRET=your_random_secret_string
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the Application
```bash
cd server
node index.js
```
Open your browser at **http://localhost:3000**.

## API Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Create a new account |
| `POST` | `/api/auth/login` | No | Log in |
| `POST` | `/api/auth/logout` | Yes | Log out |
| `GET` | `/api/auth/me` | Yes | Get current user profile |
| `PUT` | `/api/auth/profile` | Yes | Update major, year, or GPA |
| `GET` | `/api/recommend/electives` | Yes | Get all elective courses |
| `GET` | `/api/recommend/history` | Yes | Get recommendation history |
| `POST` | `/api/recommend/manual` | Yes | Submit grades and get AI recommendations |

## How the AI Recommendation Works

1. Student submits their completed courses with grades.
2. The server computes three categories:
   - **Next Core Courses**: courses whose prerequisites are ALL completed and haven't been taken yet.
   - **Ready Electives**: elective courses whose prerequisites are ALL completed.
   - **Future Electives**: elective courses with missing prerequisites (lists which ones are missing).
3. All three lists are sent to **Google Gemini AI** with a detailed prompt.
4. The AI returns 5 recommendations prioritizing **Ready** courses first, with match percentages and bilingual explanations.
5. Results are saved to the user's history in MongoDB.

## Grading System
- Uses **5.0 GPA scale** (IMSIU standard).
- Grade options: `A+`, `A`, `B+`, `B`, `C+`, `C`, `D+`, `D`, `F` (no minus grades).

## Team Members

| Name | Role | Responsibilities |
| :--- | :--- | :--- |
| Member 1 | Frontend Developer | UI Design, HTML/CSS, Vanilla JS ES6 Classes & Event Modules |
| Member 2 | Backend Developer | Node.js/Express Server, MongoDB Models, Authentication |
| Member 3 | API Integrator | Google Gemini API integration, Recommendation Prompt Engineering |

## Future Work
- Integration with the university's official student portal for direct transcript imports.
- Expansion of the elective catalog to support more majors and colleges.
- Advanced predictive analytics for career path matching.
- Mobile-responsive PWA version for on-the-go access.

## Resources
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [MongoDB Mongoose Documentation](https://mongoosejs.com/)
- [Express.js Guide](https://expressjs.com/)
