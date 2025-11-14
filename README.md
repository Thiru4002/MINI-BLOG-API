# MINI-BLOG_API

A simple and clean REST API built with **Node.js**, **Express**, and **MongoDB**.  
This project includes authentication, role-based access, post management and comment handling — designed as a beginner-friendly backend suitable for learning and demonstrating skills to recruiters.

---

## 🚀 Features

### 📌 Authentication & Authorization
- User register & login  
- Secure password hashing using **bcrypt**  
- JWT-based authentication  
- Forgot password → reset password (secure token + expiry)  
- Role based access control (admin / user)

### 📝 Blog Features
- Create, read, update, delete posts (CRUD)  
- Comment system (add / list / delete)  
- Each user can manage their own posts; admin can manage everything  
- Pagination, filtering and sorting support

### 🔐 Security Enhancements
- **Helmet** — secure HTTP headers  
- **Rate Limiting** — request throttling  
- **CORS** — configure allowed origins  
- **XSS Clean** — sanitize input  
- Basic MongoDB injection protections

---

## 📂 Project Structure

mini-blog-api/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── middlewares/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── utils/
│ │ ├── app.js # express app, middleware & routes
│ │ └── server.js # starts the server (calls app.listen)
│ ├── package.json
│ └── .env (ignored)
├── .gitignore
└── README.md

## 🎯 Purpose of This Project

This backend was created as part of my learning journey in Node.js & Express.  
It demonstrates understanding of:

- REST API Architecture  
- Authentication & Security  
- Database Modeling  
- Middleware  
- Mongoose Queries  
- Clean Folder Structure  

Perfect for interview preparation and portfolio use.

---

## 📧 Contact

If you have suggestions or feedback, feel free to reach out through GitHub.