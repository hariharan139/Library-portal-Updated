import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const BorrowForm = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    dept: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      const response = await axiosInstance.get(`/book/${bookId}`);
      setBook(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching book:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axiosInstance.post(`/borrow/${bookId}`, formData);
      const token = response.data.borrow.token;
      navigate(`/token/${token}`);
    } catch (error) {
      alert(error.response?.data?.message || "Error borrowing book");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!book) {
    return <div className="error-message">Book not found</div>;
  }

  return (
    <div className="borrow-form-page">
      <div className="form-container">
        <h1>Borrow Book</h1>

        <div className="book-info-card">
          <h3>{book.title}</h3>
          <p>by {book.author}</p>
          <p className="copies-info">
            Available: {book.availableCopies} of {book.totalCopies}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="borrow-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="studentId">Roll Number *</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              placeholder="Enter your roll number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dept">Department *</label>
            <input
              type="text"
              id="dept"
              name="dept"
              value={formData.dept}
              onChange={handleChange}
              required
              placeholder="Enter your department"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-large btn-primary"
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Confirm Borrow"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-large btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowForm;
