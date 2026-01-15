# Koyo E-Learning Platform - Backend

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Apollo Server (GraphQL)
- JWT Authentication
- Cloudinary (File Uploads)
- Socket.io (Real-time features)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file based on `.env.sample`:

```bash
cp .env.sample .env
```

Fill in your credentials.

### 3. Run Development Server

```bash
npm run dev
```

Server will run on `http://localhost:4000`
GraphQL Playground: `http://localhost:4000/graphql`

## API Features

### Authentication

- Register (Student/Instructor)
- Login
- JWT-based authentication

### Courses (Instructor)

- Create, Update, Delete courses
- Upload thumbnails

### Lessons (Instructor)

- Create, Update, Delete lessons
- Upload videos
- Order management

### Enrollments (Student)

- Enroll in courses
- Track progress
- Mark lessons complete

### Reviews (Student)

- Add, Update, Delete reviews
- Rate courses (1-5 stars)

### Analytics (Instructor)

- Total students, revenue, courses
- Monthly enrollment trends
- Top courses by enrollment
- Average ratings

### File Uploads

- Image upload (Cloudinary)
- Video upload (Cloudinary)

### Real-time (Socket.io)

- Active lesson viewers
- Progress tracking

## GraphQL Queries & Mutations

See GraphQL Playground for full schema documentation.

## Project Structure

```
backend/
├── src/
│   ├── config/         # DB, Cloudinary, Socket configs
│   ├── models/         # Mongoose models
│   ├── graphql/        # TypeDefs & Resolvers
│   ├── middlewares/    # Auth & Error handling
│   ├── utils/          # Helper functions
│   └── types/          # TypeScript interfaces
├── server.ts           # Entry point
├── package.json
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
