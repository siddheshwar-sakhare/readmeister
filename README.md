📘 ReadMeister

ReadMeister is a smart web application that helps developers generate, edit, preview, and manage GitHub README files with ease.
It integrates GitHub OAuth, real-time Markdown preview, and AI-powered README generation, allowing users to push updates directly to GitHub or download README files locally.

🚀 Features

🔐 GitHub Authentication (OAuth)

📂 Fetch & list user GitHub repositories

✍️ Edit README using Markdown

👀 Live Markdown preview

🤖 AI-generated README content

⬆️ Push README directly to GitHub

⬇️ Download README.md locally

🕒 Recently opened repositories tracking

🎨 Clean, responsive UI

🛠️ Tech Stack
Frontend

React.js

React Router

Tailwind CSS

React Markdown

Backend
Spring Boot
GitHub REST API
GitHub OAuth
Other
LocalStorage (recent repositories)
REST APIs

📸 Screenshots

![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)

📂 Project Structure

readmeister/
├── frontend/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── DashboardContent.jsx
│   ├── pages/
│   │   ├── HomeWithReadme.jsx
│   │   └── SignIn.jsx
│   └── App.jsx
│
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── config/
│   └── ReadmeisterApplication.java
│
└── README.md

⚙️ Setup & Installation

1️⃣ Clone the repository
git clone https://github.com/your-username/readmeister.git
cd readmeister

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Runs on:
👉 http://localhost:5137

3️⃣ Backend Setup (Spring Boot)

Configure GitHub OAuth credentials

Update application.properties

github.client.id=YOUR_CLIENT_ID
github.client.secret=YOUR_CLIENT_SECRET
server.port=1001


Run backend:

./mvnw spring-boot:run


Backend runs on:
👉 http://localhost:1001

🔑 GitHub OAuth Flow

User logs in with GitHub

Backend receives access token

Token is used to:

Fetch repositories

Read README files

Push updates to GitHub

🧠 AI README Generation

Uses backend AI integration to auto-generate README content

Can regenerate anytime

Editable before pushing to GitHub

📌 Usage

Login using GitHub

Select a repository

Edit or generate README

Preview changes live

Push to GitHub or download README.md