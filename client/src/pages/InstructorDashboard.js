import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InstructorDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [courseId, setCourseId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchCourses();
    fetchAssignments();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const instructorCourses = res.data.filter(
        (course) => course.instructor && String(course.instructor._id) === String(userId)
      );
      setCourses(instructorCourses);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assignments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  const handleCourseCreate = async (e) => {
    e.preventDefault();
    if (!title || !description || files.length === 0) {
      return alert('Please fill out all course fields and upload at least one file.');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    files.forEach((file) => formData.append('files', file));

    try {
      await axios.post('http://localhost:5000/api/courses/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('✅ Course created!');
      setTitle('');
      setDescription('');
      setFiles([]);
      fetchCourses();
    } catch (err) {
      console.error('❌ Error creating course:', err);
      alert('Failed to create course');
    }
  };

  const handleAssignmentCreate = async (e) => {
    e.preventDefault();
    if (!title || !description || !deadline || !courseId) {
      return alert('Please fill all assignment fields');
    }

    try {
      await axios.post(
        'http://localhost:5000/api/assignments/create',
        { title, description, deadline, course: courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('✅ Assignment created!');
      setTitle('');
      setDescription('');
      setDeadline('');
      setCourseId('');
      fetchAssignments();
    } catch (err) {
      console.error('❌ Error creating assignment:', err.response?.data || err);
      alert('Failed to create assignment');
    }
  };

  const handleGradeSubmit = async (e, assignmentId, studentId) => {
    e.preventDefault();
    const form = e.target;
    const grade = form.grade.value;
    const feedback = form.feedback.value;

    try {
      await axios.post(
        'http://localhost:5000/api/assignments/grade',
        { assignmentId, studentId, grade, feedback },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('✅ Grade submitted!');
      fetchAssignments(); // refresh
    } catch (err) {
      console.error('❌ Error grading submission:', err.response?.data || err);
      alert('Failed to submit grade.');
    }
  };

  return (
    <div className="container">
      <h2>📘 Instructor Dashboard</h2>

      {/* 📂 Create Course */}
      <form onSubmit={handleCourseCreate} className="form neon-border" style={{ marginBottom: '30px' }}>
        <h3>Create Course</h3>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          className="input"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Course Description"
          value={description}
          className="input"
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          multiple
          accept=".pdf,video/*,image/*"
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="input"
          required
        />
        <button type="submit" className="button">Create Course</button>
      </form>

      {/* ✏️ Create Assignment */}
      <form onSubmit={handleAssignmentCreate} className="form neon-border" style={{ marginBottom: '30px' }}>
        <h3>Create Assignment</h3>
        <input
          type="text"
          placeholder="Assignment Title"
          value={title}
          className="input"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Assignment Description"
          value={description}
          className="input"
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          className="input"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
        <select
          value={courseId}
          className="input"
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>{course.title}</option>
          ))}
        </select>
        <button type="submit" className="button">Create Assignment</button>
      </form>

      {/* 📋 Assignment List */}
      <section className="neon-border">
        <h3>📝 Assignments & Submissions</h3>
        {assignments.length === 0 ? (
          <p>No assignments created.</p>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment._id} style={{ marginBottom: '30px' }}>
              <h4>{assignment.title}</h4>
              <p><strong>Due:</strong> {new Date(assignment.deadline).toLocaleString()}</p>
              <p><strong>Course:</strong> {assignment.course?.title || 'N/A'}</p>

              {assignment.submissions.length === 0 ? (
                <p>No submissions yet.</p>
              ) : (
                <ul>
                  {assignment.submissions.map((sub, idx) => (
                    <li key={idx} style={{ marginBottom: '15px' }}>
                      <p><strong>Student:</strong> {sub.student?.name || 'Unknown'}</p>
                      <p><strong>Submitted:</strong> {new Date(sub.submittedAt).toLocaleString()} {sub.late && <span style={{ color: 'red' }}>(Late)</span>}</p>
                      <p>
                        <strong>Answer:</strong>{' '}
                        {sub.answer ? (
                          <a
                            href={sub.answer.startsWith('http') ? sub.answer : `http://localhost:5000${sub.answer}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📎 View File
                          </a>
                        ) : (
                          'No answer provided'
                        )}
                      </p>

                      {sub.grade ? (
                        <>
                          <p><strong>Grade:</strong> {sub.grade}</p>
                          <p><strong>Feedback:</strong> {sub.feedback}</p>
                        </>
                      ) : (
                        <form onSubmit={(e) => handleGradeSubmit(e, assignment._id, sub.student._id)}>
                          <input name="grade" placeholder="Grade" className="input" required />
                          <input name="feedback" placeholder="Feedback" className="input" />
                          <button type="submit" className="button">Submit Grade</button>
                        </form>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default InstructorDashboard;
