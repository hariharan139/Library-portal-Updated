// ============================================
// StudentDashboard.jsx - Fixed and Updated
// frontend/src/pages/StudentDashboard.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const [refreshing, setRefreshing] = useState(false);
  const [returningBookId, setReturningBookId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAuthAndFetchData();
  }, [navigate]);

  const checkAuthAndFetchData = async () => {
    const token = localStorage.getItem("studentToken");
    const studentInfo = localStorage.getItem("studentInfo");

    if (!token || !studentInfo) {
      navigate("/student/login");
      return;
    }

    try {
      const student = JSON.parse(studentInfo);
      setStudent(student);
      await fetchData();
    } catch (error) {
      console.error("Error parsing student info:", error);
      handleLogout();
    }
  };

  const fetchData = async () => {
    try {
      await Promise.all([fetchBorrowedBooks(), fetchBorrowHistory()]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      const response = await axiosInstance.get("/my-borrowed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBorrowedBooks(response.data);
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    }
  };

  const fetchBorrowHistory = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      const response = await axiosInstance.get("/my-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBorrowHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleReturnBook = async (borrowId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to return "${bookTitle}"?`))
      return;

    setReturningBookId(borrowId);
    setMessage("");

    try {
      const token = localStorage.getItem("studentToken");
      const response = await axiosInstance.put(
        `/return/${borrowId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const msg = response.data.returnedOnTime
        ? "✅ Book returned successfully on time! 🎉"
        : "⚠️ Book returned successfully (but it was overdue).";

      setMessage(msg);
      await fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error returning book");
    } finally {
      setReturningBookId(null);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentInfo");
    navigate("/student/login");
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getDaysRemaining = (returnDate) => {
    const today = new Date();
    const returnDay = new Date(returnDate);
    const diffTime = returnDay - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (days) => {
    if (days < 0) return "overdue";
    if (days <= 2) return "urgent";
    if (days <= 5) return "warning";
    return "normal";
  };

  const stats = {
    currentlyBorrowed: borrowedBooks.length,
    totalReturned: borrowHistory.filter((b) => b.status === "returned").length,
    totalBorrowed: borrowHistory.length,
    overdueBooks: borrowedBooks.filter(
      (b) => getDaysRemaining(b.returnDate) < 0
    ).length,
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="dashboard-header-student">
        <div className="header-left">
          <h1>Welcome back, {student?.name}! 👋</h1>
          <p className="student-info">
            Roll: {student?.studentId} | Dept: {student?.dept} | Email:{" "}
            {student?.email}
          </p>
        </div>
        <div className="header-actions">
          <button
            onClick={handleRefresh}
            className="btn-secondary"
            disabled={refreshing}
          >
            {refreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
          </button>
          <Link to="/" className="btn-secondary">
            📚 Browse Books
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="student-stats-grid">
        <div className="student-stat-card blue">
          <div className="stat-icon">📖</div>
          <div className="stat-details">
            <h3>{stats.currentlyBorrowed}</h3>
            <p>Currently Borrowed</p>
          </div>
        </div>
        <div className="student-stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-details">
            <h3>{stats.totalReturned}</h3>
            <p>Books Returned</p>
          </div>
        </div>
        <div className="student-stat-card orange">
          <div className="stat-icon">📚</div>
          <div className="stat-details">
            <h3>{stats.totalBorrowed}</h3>
            <p>Total Borrowed</p>
          </div>
        </div>
        <div className="student-stat-card red">
          <div className="stat-icon">⚠️</div>
          <div className="stat-details">
            <h3>{stats.overdueBooks}</h3>
            <p>Overdue Books</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "current" ? "active" : ""}`}
          onClick={() => setActiveTab("current")}
        >
          📖 Currently Borrowed ({stats.currentlyBorrowed})
        </button>
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          📜 Borrow History ({stats.totalBorrowed})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "current" ? (
        <div className="tab-content">
          {borrowedBooks.length === 0 ? (
            <div className="no-books-message">
              <div className="empty-icon">📭</div>
              <h3>No books borrowed currently</h3>
              <p>Browse our collection and borrow your favorite books!</p>
              <Link to="/" className="btn-primary">
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="borrowed-books-grid">
              {borrowedBooks.map((borrow) => {
                const daysRemaining = getDaysRemaining(borrow.returnDate);
                const statusColor = getStatusColor(daysRemaining);

                return (
                  <div
                    key={borrow._id}
                    className={`borrowed-book-card ${
                      returningBookId === borrow._id ? "fading-out" : ""
                    }`}
                  >
                    <div className="book-card-header">
                      <span
                        className={`status-indicator ${statusColor}`}
                      ></span>
                      <span className="token-badge">#{borrow.token}</span>
                    </div>

                    <h3 className="book-title">
                      {borrow.bookId?.title || "Unknown Book"}
                    </h3>
                    <p className="book-author">
                      by {borrow.bookId?.author || "Unknown Author"}
                    </p>
                    <p className="book-category">
                      📂 {borrow.bookId?.category || "Uncategorized"}
                    </p>

                    <div className="borrow-dates">
                      <div className="date-item">
                        <span className="date-label">Issued:</span>
                        <span className="date-value">
                          {formatDate(borrow.issueDate)}
                        </span>
                      </div>
                      <div className="date-item">
                        <span className="date-label">Due:</span>
                        <span className="date-value">
                          {formatDate(borrow.returnDate)}
                        </span>
                      </div>
                    </div>

                    <div className={`days-remaining ${statusColor}`}>
                      {daysRemaining < 0 ? (
                        <>⚠️ Overdue by {Math.abs(daysRemaining)} day(s)</>
                      ) : daysRemaining === 0 ? (
                        <>⏰ Due Today!</>
                      ) : (
                        <>{daysRemaining} day(s) remaining</>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        handleReturnBook(borrow._id, borrow.bookId?.title)
                      }
                      className="btn-return"
                      disabled={returningBookId === borrow._id}
                    >
                      {returningBookId === borrow._id
                        ? "Returning..."
                        : "✓ Return Book"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Message */}
          {message && <div className="return-message">{message}</div>}
        </div>
      ) : (
        <div className="tab-content">
          {borrowHistory.length === 0 ? (
            <div className="no-books-message">
              <>
                <div className="empty-icon">📋</div>
                <h3>No borrow history yet</h3>
                <p>Your borrowing history will appear here</p>
              </>
            </div>
          ) : (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Issued</th>
                    <th>Due Date</th>
                    <th>Returned</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowHistory.map((borrow) => {
                    const isReturned = borrow.status === "returned";
                    const returnedOnTime =
                      isReturned &&
                      new Date(borrow.actualReturnDate) <=
                        new Date(borrow.returnDate);

                    return (
                      <tr key={borrow._id}>
                        <td className="token-cell">#{borrow.token}</td>
                        <td>
                          <strong>{borrow.bookId?.title || "Unknown"}</strong>
                        </td>
                        <td>{borrow.bookId?.author || "Unknown"}</td>
                        <td>{formatDate(borrow.issueDate)}</td>
                        <td>{formatDate(borrow.returnDate)}</td>
                        <td>
                          {borrow.actualReturnDate ? (
                            formatDate(borrow.actualReturnDate)
                          ) : (
                            <span className="pending-return">Not returned</span>
                          )}
                        </td>
                        <td>
                          {isReturned ? (
                            <span
                              className={`history-status ${
                                returnedOnTime ? "on-time" : "late"
                              }`}
                            >
                              {returnedOnTime ? "✓ On Time" : "⚠️ Late"}
                            </span>
                          ) : (
                            <span className="history-status active">
                              📖 Active
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
