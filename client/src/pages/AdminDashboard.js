// client/src/pages/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const courseRes = await axios.get('/api/courses');
      const assignmentRes = await axios.get('/api/assignments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userRes = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(courseRes.data);
      setAssignments(assignmentRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    const url = `/api/admin/${type}/${id}`;
    try {
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`${type} deleted successfully`);
      fetchData();
    } catch (err) {
      alert(`Failed to delete ${type}`);
    }
  };

  const handleClear = async (type) => {
    if (!window.confirm(`Are you sure you want to clear ALL ${type}?`)) return;

    const url = `/api/admin/${type}/clear`;
    try {
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`All ${type} cleared`);
      fetchData();
    } catch (err) {
      alert(`Failed to clear ${type}`);
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Courses</h3>
        <button className="button" onClick={() => handleClear('courses')}>
          🧹 Clear All Courses
        </button>
        <ul>
          {courses.map((c) => (
            <li key={c._id}>
              {c.title}{' '}
              <button onClick={() => handleDelete('course', c._id)}>🗑️ Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Assignments</h3>
        <button className="button" onClick={() => handleClear('assignments')}>
          🧹 Clear All Assignments
        </button>
        <ul>
          {assignments.map((a) => (
            <li key={a._id}>
              {a.title}{' '}
              <button onClick={() => handleDelete('assignment', a._id)}>🗑️ Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Users</h3>
        <button className="button" onClick={() => handleClear('users')}>
          🧹 Clear All Users (except Admin)
        </button>
        <ul>
          {users
            .filter((u) => u.role !== 'admin')
            .map((u) => (
              <li key={u._id}>
                {u.name} ({u.email}) - {u.role}{' '}
                <button onClick={() => handleDelete('user', u._id)}>🗑️ Delete</button>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
