import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', form);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.userId); // ✅ Added userId for dashboard filtering

      // Redirect based on role
      if (res.data.role === 'instructor') {
        window.location.href = '/instructor';
      } else if (res.data.role === 'student') {
        window.location.href = '/student';
      } else if (res.data.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/courses';
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
