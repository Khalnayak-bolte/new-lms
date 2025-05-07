import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  return (
    <div className="container">
      <h2>Courses</h2>
      <p>This is where students and others will view available courses.</p>

      {courses.length === 0 ? (
        <p>No courses available yet.</p>
      ) : (
        <div className="course-list">
          {courses.map((course) => (
            <div key={course._id} className="course-card neon-border">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>
                <strong>Instructor:</strong> {course.instructor?.name} ({course.instructor?.email})
              </p>

              <div>
                <strong>Materials:</strong>
                <ul>
                  {course.materials.map((file, index) => (
                    <li key={index}>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="link">
                        {file.type === 'image' && <span>🖼️ Image</span>}
                        {file.type === 'video' && <span>🎥 Video</span>}
                        {file.type === 'application/pdf' && <span>📄 PDF</span>}
                        {file.type !== 'image' && file.type !== 'video' && file.type !== 'application/pdf' && (
                          <span>📁 File</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
