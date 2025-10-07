import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check login status when component mounts or storage changes
  useEffect(() => {
    const studentToken = localStorage.getItem("studentToken");
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");

    setIsStudentLoggedIn(!!studentToken);
    setIsAdminLoggedIn(!!adminLoggedIn);
  }, []);

  // Logout Handler
  const handleLogout = () => {
    if (isStudentLoggedIn) {
      localStorage.removeItem("studentToken");
      localStorage.removeItem("studentInfo");
      setIsStudentLoggedIn(false);
      alert("Student logged out successfully!");
    } else if (isAdminLoggedIn) {
      localStorage.removeItem("adminLoggedIn");
      setIsAdminLoggedIn(false);
      alert("Admin logged out successfully!");
    }
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          📚 Library Portal
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/borrowed" className="nav-link">
              Borrowed Books
            </Link>
          </li>

          {/* 👇 Dynamic Login / Dashboard Links */}
          {!isStudentLoggedIn && !isAdminLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/student/login" className="nav-link">
                  🎓 Student Login
                </Link>
              </li>
            </>
          ) : isStudentLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/student/dashboard" className="nav-link">
                  📘 Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link btn-logout" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link">
                  🛠️ Admin Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link btn-logout" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
