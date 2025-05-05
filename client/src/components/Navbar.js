import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>CyberLearn LMS</h2>
      <div style={styles.links}>
        {token ? (
          <>
            {role === 'admin' && (
              <Link to="/admin" style={styles.link}>
                Admin Dashboard
              </Link>
            )}
            {role === 'instructor' && (
              <Link to="/instructor" style={styles.link}>
                Instructor Dashboard
              </Link>
            )}
            {role === 'student' && (
              <Link to="/student" style={styles.link}>
                Student Dashboard
              </Link>
            )}
            <Link to="/courses" style={styles.link}>
              Courses
            </Link>
            <Link to="/notices" style={styles.link}>
              Notices
            </Link>
            {(role === 'instructor' || role === 'admin') && (
              <Link to="/add-notice" style={styles.link}>
                Add Notice
              </Link>
            )}
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/signup" style={styles.link}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 30px',
    backgroundColor: '#111',
    color: '#fff',
  },
  logo: {
    margin: 0,
  },
  links: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  link: {
    color: '#0ff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  logoutBtn: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default Navbar;
