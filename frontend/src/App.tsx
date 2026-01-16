import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { client } from "./graphql/client";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import { ApolloProvider } from "@apollo/client/react";

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
