const express = require("express");
const router = express.Router();
const {
  borrowBook,
  getTokenInfo,
  getAllBorrowedBooks,
  joinWaitlist,
  getWaitlist,
} = require("../controllers/borrowController");

// Borrow a book
router.post("/borrow/:bookId", borrowBook);

// Get token info
router.get("/token/:tokenId", getTokenInfo);

// Get all borrowed books
router.get("/borrowed", getAllBorrowedBooks);

// Join waitlist
router.post("/waitlist/:bookId", joinWaitlist);

// Get waitlist for a book
router.get("/waitlist/:bookId", getWaitlist);

module.exports = router;
