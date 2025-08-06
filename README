# 📷 AI-IMAGE – Image Sharing Platform with AI Support

A system built with a **FastAPI server**, a **React + Vite web app**, and a **mobile app using Expo/React Native**.

---

## 📚 Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Installation & Running](#installation--running)
- [Main Directories](#main-directories)
- [Architecture Overview](#architecture-overview)
- [AI Models](#ai-models)
- [Specification Document](#specification-document)

---

## ℹ️ About the Project

**AI-IMAGE** is an innovative image-sharing platform enhanced with AI capabilities for content creation and moderation.  
It allows users to upload, share, rate, and comment on images, supported by AI tools such as:

- Text-to-image generation
- Toxic comment filtering
- Chat interaction with AI

Accessible via a modern web app and an intuitive mobile app.

---

## 🚀 Key Features

- **User Management**: Sign up, login, profile, and role-based permissions (user/admin).
- **Image Sharing**: Upload, share, and create images using AI.
- **Galleries and Albums**: Both public and private.
- **Comments and Ratings**: With edit and delete options.
- **Notification System**.
- **AI Support**:
  - Image generation (Stable Diffusion)
  - Toxic comment filtering (BERT)
  - Custom AI chat interaction
- **Security**: JWT authentication, encrypted passwords, Cloudinary protection.
- **Background Tasks**: Auto-monitoring for blocked users and toxic comments.

---

## 🛠️ Installation & Running

### ⚙️ Prerequisites

- Python 3.9+
- Node.js + npm
- Git

---

### 🔌 Server Installation (FastAPI)

```bash
git clone [your-repo-link]
cd AI-IMAGE
python -m venv venv
.\venv\Scripts\activate  # For Windows
cd server
pip install -r requirements.txt

Create a .env file in the server/ directory with your config (DB, Cloudinary, JWT, etc.)

Run the server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The server will be available at: http://10.0.0.18:8000 (local dev).


🌐 Web App (React + Vite)
```bash
cd net-app
npm install
npm run dev
```

Web app will be available at: http://localhost:5173/ (or a different port).

📱 Mobile App (Expo)
```bash
cd MobileApp
npm install
npx expo start
```

This will open the Expo Dev Tools with a QR code for your phone.

---

## 🗂️ Main Directories

| Folder              | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `server/`           | FastAPI server – includes API, business logic, and AI models |
| `net-app/`          | Web app (React + Vite) with full API support                 |
| `MobileApp/`        | Mobile app (Expo + React Native)                             |
| `create-tables.sql` | SQL script to create database tables                         |

---

## 🧱 Architecture Overview

🔗 Integration
Each component (server, web, mobile) runs independently and communicates via RESTful APIs.

💾 Database
Seven main tables:

Users: roles, encrypted passwords, status.

Images: URL, status (public/blocked).

Comments: includes ratings.

Albums: public/private.

Notifications

Cloudinary: encrypted API keys.

AI History

🖥️ Server – FastAPI
User authentication: register, login, logout

Image/comment/album management

Automatic toxic comment blocking

Cloudinary integration

Interaction with AI models

💻 / 📱 Web & Mobile Apps
Public pages: home, search, public gallery

Private pages: profile, gallery, albums, AI history

Admin panel: user/block management

Navigation: based on user roles

---

## 🤖 AI Models

🎨 Image Generation (Stable Diffusion)
Model: StableDiffusionPipeline

Input: Text prompt → Image

Steps:

Text encoding (semantic understanding)

Latent diffusion (image generation)

VAE decoding (RGB rendering)

Output: High-quality images matching the input description.

🚫 Toxic Comment Filtering (Toxic-BERT)
Model: unitary/toxic-bert

Input: Text → { label: "TOXIC", score: 0.98 }

Processing:

Text cleaning

Tokenization

Embedding

BERT analysis

Final classification (TOXIC / NON_TOXIC)

---

## 📄 Specification Document

For more details about the data model, API endpoints, and navigation structure, see:

📎 אפליקציה לשיתוף תמונות.docx

---