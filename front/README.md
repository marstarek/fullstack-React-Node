# 🔐 Fullstack Auth App

A modern fullstack authentication system with **React + Redux Toolkit** on the frontend and **Node.js + Express + MySQL** on the backend.  
Supports **JWT authentication (access & refresh tokens)**, secure API requests with Axios interceptors, and global toast notifications.

---

## 🚀 Features

### Backend

- ✅ User **Signup & Login** with hashed passwords (bcrypt).
- ✅ **Access & Refresh token** authentication.
- ✅ Refresh tokens stored in the database.
- ✅ Protected route: `/auth/authUserData` returns user info when authenticated.

### Frontend

- ⚛️ Built with **React + TypeScript + Vite**
- 🔄 **Redux Toolkit** for state management
- 🔑 Auto-attach token via **Axios interceptors**
- 🔒 Auto-logout on expired/invalid token
- 🍞 **Global toast notifications** with `react-hot-toast`
- 👤 Signup, Login, and Protected Profile page

---

## 🛠️ Tech Stack

**Frontend**

- React + TypeScript
- Redux Toolkit
- Axios
- React-Hot-Toast
- Tailwind CSS / custom styles

**Backend**

- Node.js + Express
- MySQL (with `mysql2`)
- JWT (jsonwebtoken)
- bcrypt

---

## ⚙️ Installation

### 1. Clone the repo

```bash
git clone https://github.com/your-username/fullstack-auth-app.git
cd fullstack-auth-app
2. Setup Backend
cd backend
npm install
Create a .env file in /backend:

PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=authdb
JWT_SECRET=supersecret
JWT_REFRESH_SECRET=superrefreshsecret


Run migrations (MySQL):

CREATE DATABASE authdb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


Start server:

npm run dev

3. Setup Frontend
cd frontend
npm install


Create .env in /frontend:

VITE_API_BASE_URL=http://localhost:4000


Run dev server:

npm run dev

🔑 API Endpoints
Auth Routes

POST /auth/signup → Register new user

POST /auth/login → Login (returns tokens)

POST /auth/refresh → Refresh access token

GET /auth/authUserData → Get current user (requires token)

📂 Project Structure
backend/
  controllers/
    authController.js
  routes/
    authRoutes.js
  middleware/
    authMiddleware.js
  server.js

frontend/
  src/
    api/axios.ts
    store/authSlice.ts
    pages/
      Login.tsx
      Signup.tsx
      Profile.tsx
    App.tsx
    main.tsx

🎯 Usage

Signup a new user

Login → token is stored in localStorage

Access protected profile page → token sent automatically

Expired/invalid tokens trigger auto logout with toast message
```
