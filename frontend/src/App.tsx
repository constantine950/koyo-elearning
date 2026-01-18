import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./graphql/client";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import LessonPlayer from "./pages/LessonPlayer";
import InstructorDashboard from "./pages/InstructorDashboard";
import CreateCourse from "./pages/CreateCourse";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./styles/index.css";
import MyCourses from "./pages/MyCourses";
import EditCourse from "./pages/EditCourse";
import Analytics from "./pages/Analytics";
import { ToastContainer } from "./components/ToastContainer";

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute requiredRole="student">
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={<LessonPlayer />}
          />
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/create"
            element={
              <ProtectedRoute requiredRole="instructor">
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/:id/edit"
            element={
              <ProtectedRoute requiredRole="instructor">
                <EditCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/analytics"
            element={
              <ProtectedRoute requiredRole="instructor">
                <Analytics />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}
export default App;
