# <img src="https://github.com/user-attachments/assets/4c16fc8f-0af9-4a9f-ab75-8932e1954a03" width="40" vertical-align="middle"> Nusuk (نسق): AI Elective Recommender

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

**Nusuk (نسق)** is an intelligent academic web application designed for **Imam Mohammad Ibn Saud Islamic University (IMSIU)** students. It helps students make informed decisions about their elective courses by analyzing their completed coursework, grades, and academic profile using **Google Gemini AI**.

---

## 📖 Overview
The system supports three majors: **Computer Science (CS)**, **Information Systems (IS)**, and **Information Technology (IT)**, with a full bilingual interface (Arabic / English). It simplifies the academic journey by providing data-driven course recommendations tailored to each student's progress.

## 🎯 Project Goals
- **Personalized Guidance**: Provide AI-driven academic advice based on individual performance.
- **Efficiency**: Reduce manual effort in tracking complex prerequisite chains.
- **Accuracy**: Leverage AI to match students with electives that suit their academic strengths (GPA).

---

## 🗺️ Flow Chart
The following diagram illustrates the application's logic and data flow:

<p align="center">
  <img src="https://github.com/user-attachments/assets/4c16fc8f-0af9-4a9f-ab75-8932e1954a03" alt="Nusuk Flow Chart" width="600" />
</p>

---

## 📸 Screenshots
### Dashboard & UI
<p align="center">
  <img width="800" alt="Dashboard 1" src="https://github.com/user-attachments/assets/961ebac1-1852-4d34-a83a-ee3d28c951c5" />
  <img width="800" alt="Dashboard 2" src="https://github.com/user-attachments/assets/66753989-af2b-4250-be7d-82b56f5de2d3" />
  <img width="800" alt="Dashboard 3" src="https://github.com/user-attachments/assets/8872484c-c6fb-4c1d-b0e7-bc69a7462a7b" />
</p>

### AI Recommendations
<p align="center">
  <img width="400" alt="AI Rec 1" src="https://github.com/user-attachments/assets/5a1560ca-c178-4739-a79c-c4e745a26407" />
  <img width="400" alt="AI Rec 2" src="https://github.com/user-attachments/assets/a538a1c7-c414-434a-a937-c4009e36a2f8" />
</p>

---

## ✨ Key Features

### 🤖 AI-Powered Recommendations
- Analyzes completed courses, grades, major, year, and GPA.
- Categorizes courses into **"Ready Now"** (met prerequisites) and **"Future"** (pending prerequisites).
- Intelligent difficulty matching based on student's GPA.

### 📚 Full Curriculum Data
- Supports **CS, IS, and IT** majors with accurate prerequisite mapping.
- Includes **12 CS**, **5 IS**, and **4 IT** electives.
- Real-time prerequisite validation in the user interface.

### 🗺️ Interactive Curriculum Map
- Visual roadmap organized by levels (1-8).
- Mark courses as completed directly on the map.
- Distinctive styling for core vs elective courses.

### 🌍 Full Bilingual Support
- Instant toggle between **Arabic (RTL)** and **English (LTR)**.
- Full translation of UI, course codes, and AI reasoning.

---

## 🛠️ Technologies Used

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Custom Design System), Vanilla JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **AI Engine** | Google Gemini API (`gemini-flash-latest`) |
| **Auth** | bcrypt, express-session |

---

## 📂 Project Structure
```bash
nusuk/
├── client/              # Frontend files (HTML, CSS, JS)
│   ├── js/              # Modular JS classes (App, Api, Auth, Recommend)
│   └── css/             # Glassmorphism & Responsive design
└── server/              # Backend files (Node.js/Express)
    ├── models/          # Mongoose schemas
    ├── routes/          # API endpoints
    └── config/          # Electives and curriculum data
```

---

## 🚀 Setup Instructions

### 1. Prerequisites
- **Node.js** v18+
- **MongoDB** (Local or Atlas)
- **Google Gemini API Key**

### 2. Installation
```bash
git clone <repository-url>
cd web-project/server
npm install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
PORT=3000
MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_secret_key
GEMINI_API_KEY=your_api_key
```

### 4. Running the App
```bash
npm run dev
```
Visit `http://localhost:3000`

---

## 👥 Team Members

| Name | Role | Responsibilities |
| :--- | :--- | :--- |
| **Khaled Al-Dosari** | Frontend Developer | UI/UX, Design System, Vanilla JS Architecture |
| **Mishari Al-Muhanna** | Backend Developer | Server Logic, MongoDB Models, Authentication |
| **Marwan Abdullah Ali** | API Integrator | Gemini AI Integration, Prompt Engineering |

---

## 🔮 Future Work
- [ ] Integration with official university student portals.
- [ ] Expansion to support more majors and colleges.
- [ ] Advanced career path matching using predictive analytics.
- [ ] Mobile-responsive PWA version.

---

## 🔗 Resources
- [Google AI Studio](https://aistudio.google.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Express.js Guide](https://expressjs.com/)
- [IMSIU Curriculum Portal](https://imamu.edu.sa)

---

<p align="center">Made with ❤️ for IMSIU Students</p>
