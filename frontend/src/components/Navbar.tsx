import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { LogOut, BookOpen } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-primary-600">Koyo</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-700">Hi, {user.name}</span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
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
        </div>
      </div>
    </nav>
  );
};
