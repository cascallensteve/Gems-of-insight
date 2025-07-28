import React, { useState } from 'react';
import './CoursesPage.css';

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courses = [
    {
      id: 1,
      title: "Introduction to Natural Health",
      description: "Learn the fundamentals of natural health and wellness practices",
      category: "beginner",
      duration: "4 weeks",
      price: "KSH 5,000",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748432253/samples/two-ladies.jpg",
      instructor: "Dr. Jane Smith",
      students: 150
    },
    {
      id: 2,
      title: "Herbal Medicine Basics",
      description: "Discover the power of herbs for healing and wellness",
      category: "intermediate",
      duration: "6 weeks",
      price: "KSH 8,000",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748432253/samples/two-ladies.jpg",
      instructor: "Dr. Michael Johnson",
      students: 120
    },
    {
      id: 3,
      title: "Nutrition for Optimal Health",
      description: "Master the art of nutrition for a healthy lifestyle",
      category: "beginner",
      duration: "5 weeks",
      price: "KSH 6,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748432253/samples/two-ladies.jpg",
      instructor: "Sarah Williams",
      students: 200
    },
    {
      id: 4,
      title: "Advanced Wellness Coaching",
      description: "Become a certified wellness coach with advanced techniques",
      category: "advanced",
      duration: "12 weeks",
      price: "KSH 15,000",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748432253/samples/two-ladies.jpg",
      instructor: "Dr. Emily Brown",
      students: 80
    }
  ];

  const categories = [
    { value: 'all', label: 'All Courses' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  return (
    <div className="courses-page">
      <div className="courses-hero">
        <div className="hero-content">
          <h1>Transform Your Knowledge</h1>
          <p>Discover our comprehensive courses in natural health and wellness</p>
        </div>
      </div>

      <div className="courses-container">
        <div className="courses-header">
          <h2>Our Courses</h2>
          <div className="course-filters">
            {categories.map(category => (
              <button
                key={category.value}
                className={`filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="courses-grid">
          {filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <div className="course-badge">{course.category}</div>
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                
                <div className="course-meta">
                  <div className="course-instructor">
                    <span>👨‍🏫 {course.instructor}</span>
                  </div>
                  <div className="course-students">
                    <span>👥 {course.students} students</span>
                  </div>
                </div>

                <div className="course-details">
                  <div className="course-duration">
                    <span>📅 {course.duration}</span>
                  </div>
                  <div className="course-price">
                    <span>{course.price}</span>
                  </div>
                </div>

                <button className="enroll-btn">Enroll Now</button>
              </div>
            </div>
          ))}
        </div>

        <div className="courses-cta">
          <h3>Ready to Start Your Wellness Journey?</h3>
          <p>Join thousands of students who have transformed their lives through our courses</p>
          <button className="cta-btn">Browse All Courses</button>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
