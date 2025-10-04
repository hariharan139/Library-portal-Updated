import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BooksList from "./pages/BooksList";
import BookDetails from "./pages/BookDetails";
import BorrowForm from "./pages/BorrowForm";
import TokenPage from "./pages/TokenPage";
import BorrowedBooks from "./pages/BorrowedBooks";
import WaitlistPage from "./pages/WaitlistPage";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AddBookForm from "./admin/AddBookForm";
import BookListAdmin from "./admin/BookListAdmin";
import "./styles/global.css";

function App() {
  return (
    <>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books/:category" element={<BooksList />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/borrow/:bookId" element={<BorrowForm />} />
            <Route path="/token/:tokenId" element={<TokenPage />} />
            <Route path="/borrowed" element={<BorrowedBooks />} />
            <Route path="/waitlist/:bookId" element={<WaitlistPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-book" element={<AddBookForm />} />
            <Route path="/admin/books" element={<BookListAdmin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
