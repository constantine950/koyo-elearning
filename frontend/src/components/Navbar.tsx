import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import {
  LogOut,
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  // Check if user is instructor (role comes as lowercase from backend)
  const isInstructor = user?.role?.toLowerCase() === "instructor";
  const isStudent = user?.role?.toLowerCase() === "student";

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            onClick={closeMobileMenu}
          >
            <BookOpen className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-primary-600">Koyo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {/* Navigation based on role */}
                <div className="flex items-center gap-4">
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
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {user ? (
              <div className="flex flex-col space-y-2">
                {/* User Info Mobile */}
                <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium capitalize">
                    {user.role}
                  </span>
                </div>

                {/* Navigation Links Mobile */}
                {isInstructor ? (
                  <>
                    <Link
                      to="/instructor/dashboard"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <LayoutDashboard className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                      to="/instructor/analytics"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Analytics</span>
                    </Link>
                  </>
                ) : isStudent ? (
                  <Link
                    to="/my-courses"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <GraduationCap className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">My Courses</span>
                  </Link>
                ) : null}

                {/* Logout Mobile */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-colors text-red-600 w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="px-4 py-3 text-center bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-3 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
