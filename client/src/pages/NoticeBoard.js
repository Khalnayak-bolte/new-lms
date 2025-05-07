import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get('/api/notice');
        setNotices(res.data);
      } catch (err) {
        console.error('Failed to fetch notices:', err);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div className="container">
      <h2>📢 Notice Board</h2>
      {notices.length === 0 ? (
        <p>No notices available.</p>
      ) : (
        <ul className="notice-list">
          {notices.map((notice) => (
            <li key={notice._id} className="notice-item neon-border">
              <h3>{notice.title}</h3>
              <p>{notice.content}</p>
              <small>
                By: {notice.createdBy?.name || 'Unknown'} ({notice.createdBy?.role})
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NoticeBoard;
