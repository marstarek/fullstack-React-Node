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

