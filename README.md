# **Koyo - E-Learning Platform**

<div align="center">

**A modern, full-stack e-learning platform built with GraphQL, TypeScript, and React**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## **📖 About**

Koyo is a comprehensive e-learning platform that enables instructors to create and manage courses while providing students with an engaging learning experience. Built with modern web technologies, it features real-time progress tracking, course reviews, analytics dashboards, and seamless media uploads.

---

## **✨ Features**

### **For Students**

- 🔐 Secure authentication (JWT)
- 📚 Browse and search courses
- 🎓 Enroll in courses
- 📹 Watch video lessons
- 📊 Track learning progress
- ⭐ Rate and review courses
- 💳 View enrollment history

### **For Instructors**

- 👨‍🏫 Create and manage courses
- 📝 Add lessons with video content
- 📈 View detailed analytics dashboard
  - Total students and revenue
  - Monthly enrollment trends
  - Top-performing courses
  - Average ratings
- 📤 Upload course thumbnails and videos
- 💬 View student reviews

### **Platform Features**

- 🎨 Modern, responsive UI with TailwindCSS
- 🌐 GraphQL API
- ☁️ Cloud-based media storage (Cloudinary)
- 🔄 Real-time lesson viewer tracking (Socket.io)
- 📱 Mobile-friendly design
- 🔍 Advanced search and filtering
- 🎯 Role-based access control

---

## **🎥 Demo**

**Live Demo:** Coming Soon

**Local Testing:**

```bash
Backend: http://localhost:4000/graphql
Frontend: http://localhost:5173
```

**Test Credentials:**

Instructor Account:

```
Email: jane@example.com
Password: password123
```

Student Account:

```
Email: john@example.com
Password: password123
```

---

## **🛠️ Tech Stack**

### **Frontend**

- **React 18** - UI library
- **TypeScript** - Type safety
- **Apollo Client** - GraphQL client
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Zustand** - State management
- **Recharts** - Data visualization

### **Backend**

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Apollo Server** - GraphQL server
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time features
- **Cloudinary** - Media storage

---

## **📋 Prerequisites**

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Cloudinary Account** (for media uploads)

---

## **🚀 Installation**

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/koyo.git
cd koyo
```

### **2. Backend Setup**

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/koyo

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:4000`

### **3. Frontend Setup**

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:4000/graphql
VITE_SOCKET_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## **📚 Usage**

### **For Instructors:**

1. **Register** as an instructor
2. **Create a course** with details and thumbnail
3. **Add lessons** with video content
4. **View analytics** on your dashboard
5. **Manage reviews** from students

### **For Students:**

1. **Register** as a student
2. **Browse courses** and view details
3. **Enroll** in courses
4. **Watch lessons** and track progress
5. **Leave reviews** after completing courses

---

## **📡 API Documentation**

### **GraphQL Playground**

Access the GraphQL Playground at: `http://localhost:4000/graphql`

### **Sample Queries**

```graphql
# Get all courses
query {
  getCourses {
    id
    title
    description
    price
    averageRating
    totalStudents
    instructor {
      name
    }
  }
}

# Get course details with lessons
query {
  getCourse(id: "COURSE_ID") {
    id
    title
    description
    lessons {
      id
      title
      videoURL
      duration
      order
    }
    reviews {
      id
      rating
      comment
      student {
        name
      }
    }
  }
}

# Get instructor analytics
query {
  getInstructorAnalytics {
    totalStudents
    totalRevenue
    totalCourses
    averageRating
    monthlyEnrollments {
      month
      count
    }
    topCourses {
      course {
        title
      }
      enrollmentCount
      revenue
    }
  }
}
```

### **Sample Mutations**

```graphql
# Register user
mutation {
  register(
    input: {
      name: "John Doe"
      email: "john@example.com"
      password: "password123"
      role: STUDENT
    }
  ) {
    token
    user {
      id
      name
      email
      role
    }
  }
}

# Login
mutation {
  login(input: { email: "john@example.com", password: "password123" }) {
    token
    user {
      id
      name
      role
    }
  }
}

# Create course (Instructor only)
mutation {
  createCourse(
    input: {
      title: "Complete TypeScript Course"
      description: "Learn TypeScript from scratch to advanced"
      category: "Programming"
      price: 49.99
      level: BEGINNER
      thumbnail: "https://your-cloudinary-url.com/image.jpg"
    }
  ) {
    id
    title
    instructor {
      name
    }
  }
}

# Enroll in course (Student only)
mutation {
  enrollCourse(courseId: "COURSE_ID") {
    id
    enrolledAt
    progress
    course {
      title
    }
  }
}

# Add review (Student only, must be enrolled)
mutation {
  addReview(
    input: {
      courseId: "COURSE_ID"
      rating: 5
      comment: "Excellent course! Very well explained."
    }
  ) {
    id
    rating
    comment
    createdAt
  }
}

# Upload image
mutation {
  uploadImage(
    file: "data:image/jpeg;base64,YOUR_BASE64_STRING"
    folder: "thumbnails"
  ) {
    url
    publicId
    format
  }
}
```

For complete API documentation, visit the GraphQL Playground.

---

## **📁 Project Structure**

```
koyo/
├── backend/
│   ├── src/
│   │   ├── config/           # Database, Cloudinary, Socket.io configs
│   │   ├── models/           # Mongoose models (User, Course, Lesson, etc.)
│   │   ├── graphql/          # GraphQL schema & resolvers
│   │   │   ├── typeDefs.ts
│   │   │   ├── schema.ts
│   │   │   └── resolvers/
│   │   │       ├── userResolver.ts
│   │   │       ├── courseResolver.ts
│   │   │       ├── lessonResolver.ts
│   │   │       ├── enrollmentResolver.ts
│   │   │       ├── reviewResolver.ts
│   │   │       ├── analyticsResolver.ts
│   │   │       └── uploadResolver.ts
│   │   ├── middlewares/      # Auth & error handling
│   │   ├── utils/            # Helper functions (token, validation, etc.)
│   │   └── types/            # TypeScript interfaces
│   ├── server.ts             # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── graphql/          # GraphQL queries & mutations
│   │   ├── store/            # State management (Zustand)
│   │   ├── styles/           # Global styles
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## **🔑 Key Features Breakdown**

### **Authentication & Authorization**

- JWT-based authentication
- Role-based access control (Student/Instructor)
- Protected routes and mutations
- Secure password hashing with bcrypt

### **Course Management**

- CRUD operations for courses and lessons
- Course categorization and filtering
- Thumbnail and video uploads via Cloudinary
- Lesson ordering and duration tracking

### **Student Features**

- Course enrollment system
- Progress tracking per course
- Mark lessons as complete
- Personal course dashboard

### **Reviews & Ratings**

- 5-star rating system
- Written reviews with validation
- Average rating calculation
- Top-rated courses query

### **Analytics Dashboard**

- Total students and revenue metrics
- Monthly enrollment trends
- Top 5 performing courses
- Average ratings across all courses
- Revenue per course calculation

### **Real-time Features**

- Live viewer count per lesson
- Progress updates via Socket.io
- Real-time notifications

---

## **🚢 Deployment**

### **Backend Deployment**

**Render / Railway / Heroku:**

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables from `.env`
4. Deploy

**Environment Variables Required:**

```
PORT
MONGO_URI
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NODE_ENV=production
```

### **Frontend Deployment**

**Vercel / Netlify:**

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables
5. Deploy

**Environment Variables Required:**

```
VITE_API_URL=https://your-backend-url.com/graphql
VITE_SOCKET_URL=https://your-backend-url.com
```

---

## **🧪 API Testing**

### **Using GraphQL Playground**

1. Start the backend server
2. Open `http://localhost:4000/graphql`
3. Use the provided sample queries and mutations

### **Authentication Flow**

```graphql
# 1. Register as instructor
mutation {
  register(input: {
    name: "Jane Instructor"
    email: "jane@example.com"
    password: "password123"
    role: INSTRUCTOR
  }) {
    token
    user { id name role }
  }
}

# 2. Copy the token and add to HTTP Headers
{
  "authorization": "Bearer YOUR_TOKEN_HERE"
}

# 3. Create a course
mutation {
  createCourse(input: {
    title: "My First Course"
    description: "Course description"
    category: "Technology"
    price: 29.99
    level: BEGINNER
  }) {
    id
    title
  }
}
```

---

## **🤝 Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## **📝 License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## **👨‍💻 Author**

**Constantine**

- GitHub: [@Constantine](https://github.com/Constantine)
- LinkedIn: [Constantine](https://linkedin.com/in/constantine)
- Email: constantine@koyo.com

---

## **🙏 Acknowledgments**

- [Apollo GraphQL](https://www.apollographql.com/) - For excellent GraphQL tools
- [Cloudinary](https://cloudinary.com/) - For media management
- [MongoDB](https://www.mongodb.com/) - For the database
- [TailwindCSS](https://tailwindcss.com/) - For styling utilities
- [Socket.io](https://socket.io/) - For real-time features

---

## **📞 Support**

For support, email constantine@koyo.com or open an issue in this repository.

---

## **⭐ Show Your Support**

Give a ⭐️ if this project helped you!

---

## **🗺️ Roadmap**

- [ ] Payment integration (Stripe/PayPal)
- [ ] Certificate generation upon course completion
- [ ] Live classes with video conferencing
- [ ] Discussion forums for each course
- [ ] Mobile app (React Native)
- [ ] AI-powered course recommendations
- [ ] Quizzes and assignments
- [ ] Offline mode for downloaded content
- [ ] Multi-language support
- [ ] Dark mode toggle

---

<div align="center">

**Built with ❤️ by Constantine**

Made with [Node.js](https://nodejs.org/) • [React](https://reactjs.org/) • [GraphQL](https://graphql.org/) • [MongoDB](https://www.mongodb.com/)

</div>
