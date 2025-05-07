import React, { useState } from 'react';
import axios from 'axios';

const AddNotice = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      await axios.post(
        '/api/notice',
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Notice posted successfully');
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Error posting notice:', err.response?.data || err);
      alert('Failed to post notice');
    }
  };

  return (
    <div className="container">
      <h2>Add New Notice</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          className="input"
          placeholder="Notice title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="input"
          placeholder="Write notice content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="5"
          required
        ></textarea>
        <button type="submit" className="button">Post Notice</button>
      </form>
    </div>
  );
};

export default AddNotice;
