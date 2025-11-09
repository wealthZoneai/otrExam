import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
 
// 🌍 Public Pages
import UserLoginForm from "../pages/auth/LoginForm";
import SignUpForm from "../pages/auth/SignUpForm";
import ExamScreen from "../ExamScreen";
 

 
const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<UserLoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/examScreen" element={<ExamScreen />} />
      
 
      </Routes>
    </BrowserRouter>
  );
};
 
export default AppRoutes;
 
 