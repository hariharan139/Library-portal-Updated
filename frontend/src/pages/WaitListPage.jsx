import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const WaitlistPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
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
    fetchBookAndWaitlist();
  }, [bookId]);

  const fetchBookAndWaitlist = async () => {
    try {
      const bookResponse = await axiosInstance.get(`/book/${bookId}`);
      setBook(bookResponse.data);

      const waitlistResponse = await axiosInstance.get(`/waitlist/${bookId}`);
      setWaitlist(waitlistResponse.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      const response = await axiosInstance.post(
        `/waitlist/${bookId}`,
        formData
      );
      alert(
        `${response.data.message}. Your position: ${response.data.position}`
      );
      navigate(`/book/${bookId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Error joining waitlist");
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
    <div className="waitlist-page">
      <div className="form-container">
        <h1>Join Waitlist</h1>

        <div className="book-info-card unavailable">
          <h3>{book.title}</h3>
          <p>by {book.author}</p>
          <p className="unavailable-text">❌ Currently Unavailable</p>
          <p className="waitlist-count">
            {waitlist.length} {waitlist.length === 1 ? "person" : "people"}{" "}
            waiting
          </p>
        </div>

        <div className="waitlist-info">
          <h3>How it works:</h3>
          <ul>
            <li>Join the waitlist by filling out the form below</li>
            <li>
              You'll be notified via email when the book becomes available
            </li>
            <li>You'll have 48 hours to borrow the book once notified</li>
          </ul>
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
              {submitting ? "Processing..." : "Join Waitlist"}
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

export default WaitlistPage;
