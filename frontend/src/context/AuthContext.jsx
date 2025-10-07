/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";
import {} from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [isStudentAuthenticated, setIsStudentAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      // Check student authentication
      const studentToken = localStorage.getItem("studentToken");
      const studentInfo = localStorage.getItem("studentInfo");

      if (studentToken && studentInfo) {
        const parsedStudent = JSON.parse(studentInfo);
        setStudent(parsedStudent);
        setIsStudentAuthenticated(true);
      }

      // Check admin authentication
      const adminLoggedIn = localStorage.getItem("adminLoggedIn");
      setIsAdmin(adminLoggedIn === "true");
    } catch (error) {
      console.error("Error checking auth status:", error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const loginStudent = (studentData, token) => {
    try {
      localStorage.setItem("studentToken", token);
      localStorage.setItem("studentInfo", JSON.stringify(studentData));
      setStudent(studentData);
      setIsStudentAuthenticated(true);
    } catch (error) {
      console.error("Error saving student data:", error);
    }
  };

  const logoutStudent = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentInfo");
    setStudent(null);
    setIsStudentAuthenticated(false);
  };

  const loginAdmin = () => {
    localStorage.setItem("adminLoggedIn", "true");
    setIsAdmin(true);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsAdmin(false);
  };

  const clearAuth = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentInfo");
    localStorage.removeItem("adminLoggedIn");
    setStudent(null);
    setIsStudentAuthenticated(false);
    setIsAdmin(false);
  };

  const updateStudent = (updatedData) => {
    try {
      const updatedStudent = { ...student, ...updatedData };
      localStorage.setItem("studentInfo", JSON.stringify(updatedStudent));
      setStudent(updatedStudent);
    } catch (error) {
      console.error("Error updating student data:", error);
    }
  };

  const value = {
    student,
    isStudentAuthenticated,
    isAdmin,
    loading,
    loginStudent,
    logoutStudent,
    loginAdmin,
    logoutAdmin,
    updateStudent,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
