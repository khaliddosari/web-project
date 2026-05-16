# Nusuk (نسق): AI Elective Recommender

## Overview
Nusuk is an intelligent academic web application designed for **Imam Mohammad Ibn Saud Islamic University (IMSIU)** students. It helps students make informed decisions about their elective courses by analyzing their completed coursework, grades, and academic profile using **Google Gemini AI**.

The system supports three majors: **Computer Science (CS)**, **Information Systems (IS)**, and **Information Technology (IT)**, with a full bilingual interface (Arabic / English).

## Project Goals
1. To provide IMSIU students with personalized, AI-driven academic guidance.
2. To reduce the confusion and manual effort involved in tracking course prerequisites.
3. To leverage artificial intelligence to match students with electives that suit their academic strength (GPA).

## Flow Chart
*(Insert your Flow Chart image here)*
![Nusuk Flow Chart](<img width="684" height="4188" alt="Nusuk_Flowchart" src="https://github.com/user-attachments/assets/ac106a33-865d-41d8-a48f-ead56652a878" />)

## Screenshots
*(Insert 2-3 screenshots of your application here)*
![Dashboard](
<img width="2527" height="1390" alt="image" src="https://github.com/user-attachments/assets/961ebac1-1852-4d34-a83a-ee3d28c951c5" />
<img width="2530" height="1393" alt="image" src="https://github.com/user-attachments/assets/66753989-af2b-4250-be7d-82b56f5de2d3" />
<img width="2557" height="1390" alt="image" src="https://github.com/user-attachments/assets/8872484c-c6fb-4c1d-b0e7-bc69a7462a7b" />
)
![AI Recommendations](
<img width="1262" height="695" alt="image" src="https://github.com/user-attachments/assets/5a1560ca-c178-4739-a79c-c4e745a26407" />
<img width="1265" height="697" alt="image" src="https://github.com/user-attachments/assets/a538a1c7-c414-434a-a937-c4009e36a2f8" />
)

## Key Features

### AI-Powered Recommendations
- Analyzes student's completed courses, grades, major, year, and GPA.
- Recommends the **next-step courses** (core + elective) based on prerequisite completion.
- Splits recommendations into **"Ready Now"** (all prerequisites met) and **"Future"** (prerequisites missing) categories.
- Uses the GPA to gauge academic level, so higher GPA students get harder elective suggestions.

### Full Curriculum Data
- Contains all core courses for CS, IS, and IT with accurate prerequisite chains.
- Includes **12 CS electives**, **5 IS electives**, and **4 IT electives** with full prerequisite mapping.
- Course dropdowns show **all courses for the student's major**, with real-time prerequisite validation: selecting a course without completing its prerequisites triggers a warning.

### Interactive Curriculum Map
- Visual roadmap of **all courses organized by level** (Level 1 to 8) with prerequisite tags.
- Dedicated **elective courses section** with distinct styling.
- **Clickable cards**: click any course to mark it as completed (green ✓). State is saved in `localStorage`.

### Full Bilingual Support (Arabic / English)
- Toggle between Arabic (RTL) and English (LTR) with a single click.
- All UI elements, course names, recommendation results, and history update **instantly** without page reload.
- Course codes translate dynamically (e.g., `عال1242` → `CS1242`).

### User Profile Management
- Register with username, email, password, major, year, and GPA.
- **Edit profile** anytime by clicking your avatar in the sidebar to change major, year, or GPA.
- Profile updates automatically re-populate the course list.

### Recommendation History
- All AI recommendations are saved to MongoDB and displayed in the **History** tab.
- History entries show the date, course names, match percentages, and AI reasoning.
- History dynamically switches language when toggling Arabic/English.

### Authentication
- Secure registration and login with bcrypt password hashing.
- Session-based authentication using `express-session` with MongoDB store.
- Protected API routes via `requireAuth` middleware.

## Technologies Used

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (custom design system), Vanilla JavaScript (ES6 Classes, `CustomEvent` architecture) |
| **Backend** | Node.js, Express.js, express-session, connect-mongo |
| **Database** | MongoDB  |
| **AI** | Google Gemini API (`gemini-flash-latest` model via `@google/generative-ai` SDK) |
| **Auth** | bcrypt (password hashing), express-session (session management) |

## Project Structure

```
nusuk/
├── README.md
├── client/
│   ├── index.html              # Main SPA with auth, recommend, history, curriculum pages
│   ├── css/
│   │   └── style.css           # Complete design system (dark theme, glassmorphism, animations)
│   └── js/
│       ├── app.js              # Main App class: routing, language, history, curriculum map, profile modal
│       ├── api.js              # ApiService class: HTTP request wrapper (GET, POST, PUT)
│       ├── auth.js             # Auth class: login, register, session management
│       ├── recommend.js        # Recommend class: grade inputs, prereq validation, AI results rendering
│       └── coursesData.js      # IMSIU curriculum data (all courses, levels, prereqs for CS/IS/IT)
└── server/
    ├── index.js                # Express server entry point (static files, session, routes)
    ├── package.json            # Dependencies
    ├── .env                    # Local environment variables (gitignored, see .env.example)
    ├── .env.example            # Template for required environment variables
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
- **MongoDB Atlas** account (free M0 tier is sufficient) or a local MongoDB instance
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### 2. Installation
```bash
git clone <repository-url>
cd web-project/server
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` inside the `server/` directory and fill in the values:

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nusuk?retryWrites=true&w=majority
SESSION_SECRET=<a long random string, e.g. output of `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`>
GEMINI_API_KEY=<your gemini api key>
```

The `.env` file is gitignored. Never commit real credentials.

### 4. MongoDB Atlas Setup (recommended)
1. Create a free **M0 cluster** at [cloud.mongodb.com](https://cloud.mongodb.com). Pick a region that shows the **FREE** badge (e.g. AWS Frankfurt or N. Virginia).
2. Under **Database Access**, create a user with read/write privileges and copy the password.
3. Under **Network Access**, allow your IP, or `0.0.0.0/0` for development.
4. Click **Connect → Drivers** on the cluster and copy the connection string. Insert your password and database name (`nusuk`) into the URI.

### 5. Run the Application
```bash
cd server
npm run dev      # development with nodemon (auto-reload)
# or
npm start        # plain node
```
Open your browser at **http://localhost:3000**.

## Troubleshooting

### `querySrv ECONNREFUSED` when connecting to Atlas
Some ISPs and corporate networks block DNS SRV queries, which Atlas's `mongodb+srv://` URIs depend on. The server already works around this in [server/index.js](server/index.js) by pointing Node's DNS resolver at `8.8.8.8` and `1.1.1.1`. If you still see SRV errors, either:
- Change your network adapter's DNS to `8.8.8.8` / `1.1.1.1`, or
- Replace the SRV URI with the **Standard Connection String** from Atlas (`mongodb://` form that lists all shard hostnames explicitly).

### Atlas M0 cluster shows "paused"
M0 free clusters automatically pause after long periods of inactivity. Open the Atlas dashboard and click **Resume**. Your data is preserved.

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
   - **Next Core Courses**: courses whose prerequisites are ALL completed and that have not been taken yet.
   - **Ready Electives**: elective courses whose prerequisites are ALL completed.
   - **Future Electives**: elective courses with missing prerequisites (the response lists which ones are missing).
3. All three lists are sent to **Google Gemini AI** with a detailed prompt.
4. The AI returns 5 recommendations prioritizing **Ready** courses first, with match percentages and bilingual explanations.
5. Results are saved to the user's history in MongoDB.

## Grading System
- Uses **5.0 GPA scale** (IMSIU standard).
- Grade options: `A+`, `A`, `B+`, `B`, `C+`, `C`, `D+`, `D`, `F` (no minus grades).

## Team Members

| Name | Role | Responsibilities |
| :--- | :--- | :--- |
| Khaled Al-Dosari | Frontend Developer | UI Design, HTML/CSS, Vanilla JS ES6 Classes |
| Mishari Al-Muhanna | Backend Developer | Node.js/Express Server, MongoDB Models, Authentication |
| Marwan Abdullah Ali | API Integrator | Google Gemini API integration, Recommendation Prompt Engineering |

## Future Work
- Integration with the university's official student portal for direct transcript imports.
- Expansion of the elective catalog to support more majors and colleges.
- Advanced predictive analytics for career path matching.
- Mobile-responsive PWA version for on-the-go access.

## Resources
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [MongoDB Mongoose Documentation](https://mongoosejs.com/)
- [Express.js Guide](https://expressjs.com/)
