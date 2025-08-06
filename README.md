# 🤖 AI-IMAGE Platform
> **Intelligent Image Sharing Platform with AI-Powered Content Creation & Moderation**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://python.org/)

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [🤖 AI Components](#-ai-components)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [📚 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)

---

## 🎯 Overview

**AI-IMAGE** is a next-generation image sharing platform that seamlessly integrates artificial intelligence to enhance user experience through intelligent content creation and automated moderation. Built with modern technologies and scalable architecture, it provides both web and mobile access to a comprehensive image management ecosystem.

### 🎨 What Makes It Special

- **AI-Powered Image Generation** using Stable Diffusion
- **Intelligent Content Moderation** with BERT-based toxic comment detection
- **Cross-Platform Compatibility** (Web + Mobile)
- **Real-time Notifications** and interactive features
- **Enterprise-Grade Security** with JWT authentication

---

## ✨ Key Features

### 👥 User Management
- **Secure Authentication** - JWT-based registration and login
- **Role-Based Access Control** - User and Admin permissions
- **Profile Management** - Customizable user profiles

### 🖼️ Image Operations
- **Smart Upload** - Cloudinary integration with automatic optimization
- **AI Generation** - Text-to-image creation using Stable Diffusion
- **Gallery Management** - Public and private image collections
- **Album Organization** - Structured content organization

### 💬 Social Features
- **Interactive Comments** - With edit/delete capabilities
- **Rating System** - Community-driven content evaluation
- **Real-time Notifications** - Stay updated on platform activity

### 🤖 AI Integration
- **Content Generation** - Transform text prompts into stunning images
- **Toxic Comment Filtering** - Automatic moderation using BERT models
- **AI Chat Interface** - Interactive AI assistance

### 🔒 Security & Performance
- **End-to-End Encryption** - Secure data transmission
- **Background Task Processing** - Efficient resource management
- **Automated Monitoring** - Proactive content moderation

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web App<br/>React + Vite]
        B[Mobile App<br/>Expo + React Native]
    end
    
    subgraph "API Layer"
        C[FastAPI Server<br/>Python 3.9+]
    end
    
    subgraph "AI Layer"
        D[Stable Diffusion<br/>Image Generation]
        E[Toxic-BERT<br/>Content Moderation]
    end
    
    subgraph "Data Layer"
        F[PostgreSQL<br/>Database]
        G[Cloudinary<br/>Image Storage]
    end
    
    A --> C
    B --> C
    C --> D
    C --> E
    C --> F
    C --> G
```

### 🗄️ Database Schema

| Table | Purpose | Key Features |
|-------|---------|--------------|
| **Users** | User management | Roles, encrypted passwords, status tracking |
| **Images** | Image metadata | URLs, visibility settings, moderation status |
| **Comments** | User interactions | Ratings, moderation, edit history |
| **Albums** | Content organization | Public/private collections |
| **Notifications** | Real-time updates | User activity tracking |
| **Cloudinary** | Cloud configuration | Encrypted API keys |
| **AI History** | AI interactions | Generation history, usage analytics |

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Python 3.9+**
- **Node.js 16+** & npm
- **Git**
- **PostgreSQL** (or preferred database)
- **Cloudinary Account** (for image storage)

### 🔧 Installation

#### 1️⃣ Clone Repository
```bash
git clone <repository-url>
cd AI-IMAGE
```

#### 2️⃣ Backend Setup (FastAPI)
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate   # Windows

# Install dependencies
cd server
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your configurations

# Run server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**🌐 Server Available at:** `http://localhost:8000`

#### 3️⃣ Web App Setup (React + Vite)
```bash
cd net-app
npm install
npm run dev
```

**🌐 Web App Available at:** `http://localhost:5173`

#### 4️⃣ Mobile App Setup (Expo)
```bash
cd MobileApp
npm install
npx expo start
```

**📱 Scan QR code** with Expo Go app

---

## 🤖 AI Components

### 🎨 Image Generation Pipeline

**Model:** Stable Diffusion Pipeline
```
Text Prompt → Semantic Encoding → Latent Diffusion → VAE Decoding → Generated Image
```

**Features:**
- High-quality image synthesis
- Customizable generation parameters
- Batch processing capabilities
- Style transfer options

### 🛡️ Content Moderation System

**Model:** unitary/toxic-bert
```
User Comment → Text Preprocessing → Tokenization → BERT Analysis → Classification
```

**Output Example:**
```json
{
  "label": "TOXIC",
  "confidence": 0.98,
  "action": "block"
}
```

---

## 📁 Project Structure

```
AI-IMAGE/
├── 📁 server/                 # FastAPI Backend
│   ├── 📁 models/            # Database models
│   ├── 📁 routes/            # API endpoints
│   ├── 📁 services/          # Business logic
│   ├── 📁 ai/                # AI model integrations
│   └── 📄 main.py            # Application entry point
├── 📁 net-app/               # React Web Application
│   ├── 📁 src/
│   │   ├── 📁 components/    # Reusable components
│   │   ├── 📁 pages/         # Route components
│   │   └── 📁 services/      # API clients
│   └── 📄 package.json
├── 📁 MobileApp/             # React Native Mobile App
│   ├── 📁 src/
│   │   ├── 📁 screens/       # Mobile screens
│   │   ├── 📁 components/    # Mobile components
│   │   └── 📁 navigation/    # Navigation setup
│   └── 📄 package.json
├── 📄 create-tables.sql      # Database schema
└── 📄 README.md              # Project documentation
```

---

## 🔧 Configuration

### 🌍 Environment Variables

Create `.env` file in the `server/` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ai_image_db

# JWT Security
JWT_SECRET_KEY=your-super-secret-jwt-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI Model Configuration
HUGGING_FACE_TOKEN=your-hf-token
STABLE_DIFFUSION_MODEL=runwayml/stable-diffusion-v1-5

# Server Configuration
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

---

## 📚 API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### 🔑 Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/login` | User authentication |
| `GET` | `/images/` | List public images |
| `POST` | `/images/generate` | AI image generation |
| `POST` | `/comments/` | Add comment |
| `GET` | `/albums/{user_id}` | User albums |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📝 Code Style

- **Python:** Follow PEP 8 guidelines
- **JavaScript/TypeScript:** Use ESLint + Prettier
- **Commit Messages:** Use conventional commit format

---

## 📄 Documentation

For detailed specifications and technical documentation, refer to:
📎 **אפליקציה לשיתוף תמונות.docx**

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **📧 Email:** support@ai-image.com
- **🐛 Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **💬 Discussions:** [GitHub Discussions](https://github.com/your-repo/discussions)

---

<div align ="center">

**Made with ❤️ by the AI-IMAGE Team**

⭐ Star us on GitHub — it motivates us a lot!

</div>