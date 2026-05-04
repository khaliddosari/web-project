# Nusuk (نسق) — AI Elective Recommender

## Overview
Nusuk is an academic web application designed to help university students intelligently choose their elective courses. By taking a student's manually entered academic history (past courses and grades) along with their profile (Major, Year, GPA), the application uses the powerful Google Gemini AI to analyze their performance and recommend the top 5 most suitable electives from a predefined university catalog.

## Flow Chart
[Insert Flow Chart Link Here]

## Goals of the Project
- **Personalized Recommendations:** Provide accurate and personalized elective suggestions based on academic strengths.
- **Academic Architecture:** Strictly adhere to academic web development constraints (Vanilla JS, ES6 Classes, Node/Express, MongoDB).
- **Secure Integration:** Protect user data through authentication and utilize modern AI APIs safely.

## Technologies Used
- **Frontend (UI & Architecture):** Semantic HTML5, CSS3, Vanilla JavaScript (Strict ES6 Classes, ES Modules, `CustomEvent` architecture).
- **Backend (Server & Auth):** Node.js, Express.js, express-session.
- **Database:** MongoDB (Mongoose ODMs).
- **AI Integration:** Google Gemini API (`@google/generative-ai`).

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Cloud/Atlas)
- A Google Gemini API Key

### 2. Installation
Clone the repository and install the backend dependencies:
```bash
cd server
npm install
```

### 3. Environment Variables
Create a `.env` file inside the `server/` directory and configure it. Replace the dummy keys with your actual keys:

```env
PORT=3000
MONGO_URI=your_dummy_mongo_uri
SESSION_SECRET=your_dummy_session_secret
GEMINI_API_KEY=your_dummy_gemini_key_here
```

### 4. Running the Application
Start the server:
```bash
node index.js
```
Then open your browser and navigate to `http://localhost:3000`.

## Screenshots
[Insert Screenshot Here]

## Team Members

| Name | Role | Responsibilities |
| :--- | :--- | :--- |
| Member 1 | Frontend Developer | UI Design, HTML/CSS, Vanilla JS ES6 Classes & Event Modules |
| Member 2 | Backend Developer | Node.js/Express Server setup, MongoDB Models, Authentication |
| Member 3 | API Integrator | Google Gemini API integration, Recommendation Prompt Engineering |

## Future Work
- Integration with the university's official student portal for direct transcript imports.
- Expansion of the elective catalog to support more majors.
- Advanced predictive analytics for career path matching.

## Resources
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [MongoDB Mongoose Documentation](https://mongoosejs.com/)
- [Express.js Guide](https://expressjs.com/)
