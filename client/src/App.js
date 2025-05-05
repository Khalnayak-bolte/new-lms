import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CourseList from './pages/CourseList';
import NoticeBoard from './pages/NoticeBoard';
import AddNotice from './pages/AddNotice';
import ProtectedRoute from './utils/ProtectedRoute';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Protected: Instructor Dashboard */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Protected: Student Dashboard */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Public: Course List and Notice Board */}
        <Route path="/courses" element={<CourseList />} />
        <Route path="/notices" element={<NoticeBoard />} />

        {/* ✅ Protected: Add Notice (Instructor + Admin) */}
        <Route
          path="/add-notice"
          element={
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
              <AddNotice />
            </ProtectedRoute>
          }
        />
        
        <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

        {/* ✅ Catch-all: Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
