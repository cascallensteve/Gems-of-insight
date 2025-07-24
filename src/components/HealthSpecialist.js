import React, { useState } from 'react';
import './HealthSpecialist.css';

const HealthSpecialist = ({ onNavigateToConsultation }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const specialists = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      specialty: "Nutritionist",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      experience: "8 Years",
      description: "Expert in organic nutrition and dietary planning for optimal health.",
      specialties: ["Weight Management", "Digestive Health", "Food Allergies"]
    },
    {
      id: 2,
      name: "Dr. James Chen",
      specialty: "Herbal Medicine",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      experience: "12 Years",
      description: "Traditional herbal medicine practitioner specializing in natural remedies.",
      specialties: ["Chronic Pain", "Stress Management", "Immune Support"]
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Wellness Coach",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      experience: "6 Years",
      description: "Holistic wellness coach focusing on mind-body health integration.",
      specialties: ["Mental Health", "Lifestyle Changes", "Preventive Care"]
    }
  ];

  const healthIssues = [
    { icon: "🩺", title: "Digestive Issues", description: "Bloating, IBS, food sensitivities" },
    { icon: "💊", title: "Chronic Fatigue", description: "Low energy, sleep disorders" },
    { icon: "🧠", title: "Mental Wellness", description: "Stress, anxiety, mood support" },
    { icon: "💪", title: "Weight Management", description: "Healthy weight loss/gain plans" },
    { icon: "🫀", title: "Heart Health", description: "Cardiovascular wellness support" },
    { icon: "🦴", title: "Joint & Bone", description: "Arthritis, osteoporosis prevention" }
  ];

  const handleBookConsultation = (specialist) => {
    setSelectedSpecialty(specialist);
    setShowBookingForm(true);
  };

  const closeBookingForm = () => {
    setShowBookingForm(false);
    setSelectedSpecialty(null);
  };

  return (
    <section className="health-specialist">
      <div className="container">
        {/* Header Section */}
        <div className="section-header">
          <h2 className="section-title">Having Health Issues?</h2>
          <p className="section-subtitle">Consult with our certified specialists for personalized natural health solutions</p>
        </div>

        {/* Health Issues Grid */}
        <div className="health-issues-grid">
          {healthIssues.map((issue, index) => (
            <div key={index} className="health-issue-card">
              <div className="issue-icon">{issue.icon}</div>
              <h3>{issue.title}</h3>
              <p>{issue.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <h3>Don't Let Health Issues Hold You Back</h3>
          <p>Get expert guidance from our certified natural health specialists</p>
          <button className="cta-button" onClick={onNavigateToConsultation}>Book Free Consultation</button>
        </div>

        {/* Specialists Section */}
        <div className="specialists-section">
          <h3 className="specialists-title">Meet Our Specialists</h3>
          <div className="specialists-grid">
            {specialists.map(specialist => (
              <div key={specialist.id} className="specialist-card">
                <div className="specialist-image">
                  <img src={specialist.image} alt={specialist.name} />
                  <div className="specialist-overlay">
                    <button 
                      className="book-btn"
                      onClick={() => handleBookConsultation(specialist)}
                    >
                      Book Session
                    </button>
                  </div>
                </div>
                <div className="specialist-info">
                  <h4>{specialist.name}</h4>
                  <span className="specialty">{specialist.specialty}</span>
                  <div className="experience">{specialist.experience} Experience</div>
                  <p className="description">{specialist.description}</p>
                  <div className="specialties-tags">
                    {specialist.specialties.map((spec, index) => (
                      <span key={index} className="specialty-tag">{spec}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Happy Patients</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">15+</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support Available</div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="booking-modal-overlay" onClick={closeBookingForm}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeBookingForm}>×</button>
            <div className="modal-header">
              <h3>Book Consultation</h3>
              <p>with {selectedSpecialty?.name} - {selectedSpecialty?.specialty}</p>
            </div>
            <form className="booking-form">
              <div className="form-step active" data-step="1">
                <h4>Personal Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" placeholder="Enter your first name" required />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" placeholder="Enter your last name" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="your.email@example.com" required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+1 (555) 123-4567" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Age Group</label>
                  <select required>
                    <option value="">Select your age group</option>
                    <option value="18-25">18-25 years</option>
                    <option value="26-35">26-35 years</option>
                    <option value="36-45">36-45 years</option>
                    <option value="46-55">46-55 years</option>
                    <option value="56-65">56-65 years</option>
                    <option value="65+">65+ years</option>
                  </select>
                </div>
              </div>

              <div className="form-step" data-step="2">
                <h4>Health Information</h4>
                <div className="form-group">
                  <label>Primary Health Concern</label>
                  <select required>
                    <option value="">Select your main concern</option>
                    <option value="digestive">Digestive Issues</option>
                    <option value="chronic-fatigue">Chronic Fatigue</option>
                    <option value="mental-wellness">Mental Wellness</option>
                    <option value="weight-management">Weight Management</option>
                    <option value="heart-health">Heart Health</option>
                    <option value="joint-bone">Joint & Bone Health</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Detailed Description</label>
                  <textarea 
                    placeholder="Please describe your symptoms, how long you've had them, and any treatments you've tried..."
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Current Medications/Supplements</label>
                  <textarea 
                    placeholder="List any medications, vitamins, or supplements you're currently taking..."
                    rows="3"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Allergies or Sensitivities</label>
                  <input type="text" placeholder="Any known allergies to foods, herbs, or medications" />
                </div>
              </div>

              <div className="form-step" data-step="3">
                <h4>Consultation Preferences</h4>
                <div className="form-group">
                  <label>Consultation Type</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input type="radio" name="consultationType" value="video" required />
                      <span className="radio-custom">📹</span>
                      <div>
                        <strong>Video Call</strong>
                        <p>Face-to-face consultation via video call</p>
                      </div>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="consultationType" value="phone" required />
                      <span className="radio-custom">📞</span>
                      <div>
                        <strong>Phone Call</strong>
                        <p>Audio consultation over the phone</p>
                      </div>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="consultationType" value="in-person" required />
                      <span className="radio-custom">🏥</span>
                      <div>
                        <strong>In-Person</strong>
                        <p>Visit our clinic for consultation</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date</label>
                    <input type="date" required />
                  </div>
                  <div className="form-group">
                    <label>Preferred Time</label>
                    <select required>
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Special Requests or Questions</label>
                  <textarea 
                    placeholder="Any specific questions or requests for your consultation..."
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="form-navigation">
                <button type="button" className="nav-btn prev-btn" style={{display: 'none'}}>
                  ← Previous
                </button>
                <div className="step-indicators">
                  <div className="step-indicator active"></div>
                  <div className="step-indicator"></div>
                  <div className="step-indicator"></div>
                </div>
                <button type="button" className="nav-btn next-btn">
                  Next →
                </button>
                <button type="submit" className="submit-btn" style={{display: 'none'}}>
                  Book Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default HealthSpecialist;
