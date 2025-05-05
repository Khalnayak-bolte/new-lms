// client/src/pages/StudentDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [files, setFiles] = useState({});

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchCourses();
    fetchNotices();
    fetchEnrolledAndAssignments();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notice');
      setNotices(res.data);
    } catch (err) {
      console.error('Error fetching notices:', err);
    }
  };

  const fetchEnrolledAndAssignments = async () => {
    try {
      const enrolledRes = await axios.get('http://localhost:5000/api/courses/enrolled', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const enrolledIds = enrolledRes.data.map((course) => course._id);
      setEnrolledCourses(enrolledIds);

      const assignmentRes = await axios.get('http://localhost:5000/api/assignments', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredAssignments = assignmentRes.data.filter(
        (a) => a.course && enrolledIds.includes(a.course._id)
      );

      setAssignments(filteredAssignments);
    } catch (err) {
      console.error('Error fetching enrolled courses or assignments:', err);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/courses/enroll/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Enrolled successfully!');
      fetchEnrolledAndAssignments();
    } catch (err) {
      console.error('Error enrolling:', err);
      alert('Failed to enroll.');
    }
  };

  const handleFileChange = (assignmentId, e) => {
    setFiles({ ...files, [assignmentId]: e.target.files[0] });
  };

  const handleFileSubmit = async (assignmentId) => {
    if (!files[assignmentId]) return alert('Please select a file to upload.');

    const formData = new FormData();
    formData.append('file', files[assignmentId]);

    try {
      await axios.post(
        `http://localhost:5000/api/assignments/submit/${assignmentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('✅ Assignment submitted!');
      setFiles({ ...files, [assignmentId]: null });
      fetchEnrolledAndAssignments();
    } catch (err) {
      console.error('Error submitting assignment:', err);
      alert('Failed to submit assignment.');
    }
  };

  return (
    <div className="container">
      <h2>Student Dashboard</h2>

      <section>
        <h3>📚 Available Courses</h3>
        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <ul>
            {courses.map((course) => (
              <li key={course._id}>
                <strong>{course.title}</strong>: {course.description}
                <br />
                <small>Instructor: {course.instructor?.name}</small>
                <br />
                {enrolledCourses.includes(course._id) ? (
                  <span style={{ color: 'limegreen' }}>Enrolled</span>
                ) : (
                  <button onClick={() => handleEnroll(course._id)}>Enroll</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>📢 Notices</h3>
        {notices.length > 0 ? (
          <ul>
            {notices.map((notice) => (
              <li key={notice._id}>
                <strong>{notice.title}</strong>: {notice.content}
              </li>
            ))}
          </ul>
        ) : (
          <p>No notices found.</p>
        )}
      </section>

      <section>
        <h3>📝 Assignments</h3>
        {assignments.length > 0 ? (
          <ul>
            {assignments.map((assignment) => {
              const submission = assignment.submissions.find(
                (sub) => sub.student?._id === userId
              );

              return (
                <li key={assignment._id}>
                  <strong>{assignment.title}</strong> - {assignment.description}
                  <br />
                  <small>Course: {assignment.course?.title || 'Unknown'}</small>
                  <br />
                  Deadline: {new Date(assignment.deadline).toLocaleString()}
                  <br />
                  {submission ? (
                    <p>
                      ✅ Submitted at {new Date(submission.submittedAt).toLocaleString()} {submission.late && '(Late)'}
                      <br />
                      <strong>File:</strong>{' '}
                      <a href={submission.answer} target="_blank" rel="noreferrer">
                        View Submission
                      </a>
                      <br />
                      <strong>Grade:</strong> {submission.grade || 'Not graded yet'}
                      <br />
                      <strong>Feedback:</strong> {submission.feedback || 'Pending'}
                    </p>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept=".pdf,image/*,video/*"
                        onChange={(e) => handleFileChange(assignment._id, e)}
                      />
                      <button onClick={() => handleFileSubmit(assignment._id)}>
                        Submit Assignment
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No assignments found.</p>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
