# 🔐 Around the U.S. - Authentication System

![Auth Flow Demo](./images/auth-demo.gif)

Authentication system implementation for the "Around the U.S." React project featuring JWT-based registration and login flows.

## 📌 Project Overview

This project implements secure user authentication in the React frontend of "Around the U.S." including:

- User registration and login flows
- Protected routes
- JWT token management
- Integration with TripleTen's authentication API

## 🛠 Technical Implementation

### 🔗 API Endpoints
**Base URL:** `https://se-register-api.en.tripleten-services.com/v1`

| Endpoint       | Method | Description                  |
|----------------|--------|------------------------------|
| `/signup`      | POST   | User registration            |
| `/signin`      | POST   | User login                   |
| `/users/me`    | GET    | Validate token/get user info |



## 🔑 Key Features

### 1. Authentication Flows
**Registration:**

// auth.js
export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(checkResponse);
};

Login:


// auth.js
export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(checkResponse);
};

2. Protected Routes
jsx

// ProtectedRoute.jsx
export default function ProtectedRoute({ element, loggedIn }) {
  return loggedIn ? element : <Navigate to="/signin" replace />;
}

3. Token Management

    JWT storage in localStorage

    Automatic token validation on app load

    Protected API calls with Authorization header

🚀 Getting Started

    Clone the repository:

bash

git clone https://github.com/yourusername/web_project_around_auth.git

    Install dependencies:

npm install

    Start development server:

npm start

📝 API Documentation
Registration Request
json

{
  "password": "securepassword123",
  "email": "user@example.com"
}

Successful Response
json

{
  "data": {
    "email": "user@example.com",
    "_id": "5f5204c577488bcaa8b7bdf2"
  }
}

Error Codes
Code	Description
400	Invalid field format
401	Invalid credentials
500	Server error
🛡 Security Implementation

    Token validation on each protected route access

    Secure token storage in browser

    Protected API endpoints with JWT

    Form validation on client side

📱 Responsive Design

    Mobile-first approach

    Adaptive layouts for all screen sizes

    Accessible form components

🎯 Learning Outcomes

    Implemented secure authentication flows

    Mastered JWT token management

    Developed protected routes system

    Integrated with external auth API

    Enhanced security awareness

Developed as part of TripleTen's Web Development program
