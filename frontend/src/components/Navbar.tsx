import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import {
  LogOut,
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check if user is instructor (role comes as lowercase from backend)
  const isInstructor = user?.role?.toLowerCase() === "instructor";
  const isStudent = user?.role?.toLowerCase() === "student";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <BookOpen className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-primary-600">Koyo</span>
          </Link>

          {/* Navigation Links & User Menu */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                {/* Navigation based on role */}
                <div className="flex items-center gap-4">
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                  >
                    Courses
                  </Link>

                  {isInstructor ? (
                    <>
                      <Link
                        to="/instructor/dashboard"
                        className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                      </Link>
                      <Link
                        to="/instructor/analytics"
                        className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                      >
                        <TrendingUp className="w-5 h-5" />
                        Analytics
                      </Link>
                    </>
                  ) : isStudent ? (
                    <Link
                      to="/my-courses"
                      className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                    >
                      <GraduationCap className="w-5 h-5" />
                      My Courses
                    </Link>
                  ) : null}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium capitalize">
                      {user.role}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Courses
                </Link>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
