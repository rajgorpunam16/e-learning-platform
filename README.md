🎓 E-Learning Platform

A full-stack e-learning platform built with React.js, Node.js, Express.js, and MongoDB. The platform allows users to browse courses, explore chapters, purchase courses, and manage their learning, while administrators can manage users, courses, categories, authors, and chapters.

🌐 Live Demo

https://e-learning-platform-1-gck5.onrender.com/

✨ Features
👤 User Features
User registration and login
Browse available courses
Search and filter courses
View course details
Explore course chapters
Purchase courses
Access purchased learning content
User profile management

👨‍💼 Admin Features
Admin authentication
Dashboard
User management
Course management
Category management
Author management
Chapter management
Course content management

🔐 Security
Environment-based configuration
Protected API routes
Role-based access control
Secure database connection
CORS configuration

🛠️ Tech Stack

Frontend
React.js
JavaScript
HTML5
CSS3
Bootstrap

Backend
Node.js
Express.js
REST API

Database
MongoDB
Mongoose

Deployment
Frontend: Render
Backend: Render
Database: MongoDB Atlas

📂 Project Structure
e-learning-platform/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── assets/
│   ├── App.js
│   └── index.js
│
├── .gitignore
├── package.json
└── README.md

🚀 Getting Started
1. Clone the repository
git clone https://github.com/rajgorpunam16/e-learning-platform.git
cd e-learning-platform
2. Install frontend dependencies
npm install
3. Install backend dependencies
cd backend
npm install
4. Configure environment variables
Create:
backend/.env

Example:
PORT=5000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key

Do not commit .env files to GitHub.

5. Start the backend
cd backend
npm start
6. Start the frontend

Open another terminal:

npm start

The application will be available at:

http://localhost:3000
🔌 API

Example endpoints:

GET    /api/courses
GET    /api/courses/:id

POST   /api/users/register
POST   /api/users/login

GET    /api/categories
GET    /api/authors

GET    /api/chapters

Admin endpoints are protected using authentication and authorization.

🗄️ Database

The application uses MongoDB to store:

Users
Courses
Authors
Categories
Chapters
Books/content

MongoDB Atlas can be used for cloud deployment.

🚀 Deployment

The project can be deployed using:

React frontend → Render
Node.js/Express backend → Render
MongoDB → MongoDB Atlas

Environment variables must be configured separately on the deployment platform.

🔮 Future Enhancements
Online payment integration
Course progress tracking
Video-based learning
Course ratings and reviews
Certificates
Wishlist
Notifications
Advanced admin analytics
Instructor dashboard
Course completion tracking

👩‍💻 Author

Punam Rajgor

GitHub: https://github.com/rajgorpunam16

📄 License

This project is created for educational and portfolio purposes.
