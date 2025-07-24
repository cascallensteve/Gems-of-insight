import React, { useState } from 'react';
import './AppointmentBooking.css';

const AppointmentBooking = ({ user, onLogin, onClose }) => {
  const [currentStep, setCurrentStep] = useState(user ? 2 : 1); // Skip login if user is logged in
  const [formData, setFormData] = useState({
    // Login data
    email: user?.email || '',
    password: '',
    isNewUser: false,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    
    // Appointment data
    specialist: '',
    appointmentType: '',
    preferredDate: '',
    preferredTime: '',
    healthConcern: '',
    symptoms: '',
    medications: '',
    allergies: '',
    previousTreatments: '',
    urgency: 'normal',
    consultationType: 'video',
    specialRequests: '',
    
    // Contact preferences
    emailNotifications: true,
    smsNotifications: true,
    newsletterSubscription: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);

  const specialists = [
    {
      id: 'dr-sarah',
      name: 'Dr. Sarah Mitchell',
      specialty: 'Nutritionist',
      image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg',
      experience: '8 Years',
      rating: 4.9,
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday']
    },
    {
      id: 'dr-james',
      name: 'Dr. James Chen',
      specialty: 'Herbal Medicine',
      image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg',
      experience: '12 Years',
      rating: 4.8,
      availability: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday']
    },
    {
      id: 'dr-emily',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Wellness Coach',
      image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg',
      experience: '6 Years',
      rating: 4.7,
      availability: ['Monday', 'Wednesday', 'Thursday', 'Friday']
    }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1 && !user) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      
      if (!formData.isNewUser && !formData.password) {
        newErrors.password = 'Password is required';
      }
      
      if (formData.isNewUser) {
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.password || formData.password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        }
      }
    }

    if (step === 2) {
      if (!formData.specialist) newErrors.specialist = 'Please select a specialist';
      if (!formData.appointmentType) newErrors.appointmentType = 'Please select appointment type';
      if (!formData.preferredDate) newErrors.preferredDate = 'Please select a date';
      if (!formData.preferredTime) newErrors.preferredTime = 'Please select a time';
      if (!formData.healthConcern) newErrors.healthConcern = 'Please describe your health concern';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate appointment ID
      const newAppointmentId = 'APT-' + Date.now();
      setAppointmentId(newAppointmentId);
      
      // Simulate sending confirmation email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getSelectedSpecialist = () => {
    return specialists.find(s => s.id === formData.specialist);
  };

  if (showSuccess) {
    return (
      <div className="appointment-overlay" onClick={onClose}>
        <div className="appointment-container success-container" onClick={(e) => e.stopPropagation()}>
          <div className="success-animation">
            <div className="success-circle">
              <div className="checkmark">✓</div>
            </div>
          </div>
          
          <h2>Appointment Booked Successfully!</h2>
          <p>Your consultation has been scheduled and confirmed.</p>
          
          <div className="appointment-summary">
            <div className="summary-item">
              <span className="icon">🆔</span>
              <div>
                <strong>Appointment ID</strong>
                <p>{appointmentId}</p>
              </div>
            </div>
            <div className="summary-item">
              <span className="icon">👨‍⚕️</span>
              <div>
                <strong>Specialist</strong>
                <p>{getSelectedSpecialist()?.name}</p>
              </div>
            </div>
            <div className="summary-item">
              <span className="icon">📅</span>
              <div>
                <strong>Date & Time</strong>
                <p>{formData.preferredDate} at {formData.preferredTime}</p>
              </div>
            </div>
            <div className="summary-item">
              <span className="icon">💻</span>
              <div>
                <strong>Consultation Type</strong>
                <p>{formData.consultationType === 'video' ? 'Video Call' : formData.consultationType === 'phone' ? 'Phone Call' : 'In-Person'}</p>
              </div>
            </div>
          </div>

          <div className="notification-status">
            <h3>📧 Notifications Sent</h3>
            <div className="notification-list">
              <div className="notification-item">
                <span className="check">✅</span>
                <span>Confirmation email sent to {formData.email}</span>
              </div>
              {formData.smsNotifications && (
                <div className="notification-item">
                  <span className="check">✅</span>
                  <span>SMS reminder sent to {formData.phone}</span>
                </div>
              )}
              <div className="notification-item">
                <span className="check">✅</span>
                <span>Calendar invite sent</span>
              </div>
              <div className="notification-item">
                <span className="check">✅</span>
                <span>Specialist notified</span>
              </div>
            </div>
          </div>

          <div className="success-actions">
            <button className="primary-btn" onClick={onClose}>
              View My Appointments
            </button>
            <button className="secondary-btn" onClick={() => window.location.reload()}>
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-overlay" onClick={onClose}>
      <div className="appointment-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-appointment" onClick={onClose}>×</button>
        
        {/* Progress Steps */}
        <div className="appointment-progress">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Account</span>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Appointment</span>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <span>Confirmation</span>
          </div>
        </div>

        <form className="appointment-form" onSubmit={handleSubmit}>
          {/* Step 1: Login/Register */}
          {currentStep === 1 && !user && (
            <div className="form-step">
              <h2>Account Information</h2>
              <p>Sign in to your account or create a new one to book your appointment</p>

              <div className="auth-toggle">
                <button
                  type="button"
                  className={!formData.isNewUser ? 'active' : ''}
                  onClick={() => setFormData(prev => ({ ...prev, isNewUser: false }))}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={formData.isNewUser ? 'active' : ''}
                  onClick={() => setFormData(prev => ({ ...prev, isNewUser: true }))}
                >
                  Create Account
                </button>
              </div>

              {formData.isNewUser && (
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="your.email@example.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {formData.isNewUser && (
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
              )}

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                  placeholder={formData.isNewUser ? "Create a password (min 6 characters)" : "Enter your password"}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
            </div>
          )}

          {/* Step 2: Appointment Details */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>Book Your Appointment</h2>
              <p>Select your preferred specialist and appointment details</p>

              <div className="form-group">
                <label>Select Specialist</label>
                <div className="specialists-grid">
                  {specialists.map(specialist => (
                    <div
                      key={specialist.id}
                      className={`specialist-option ${formData.specialist === specialist.id ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, specialist: specialist.id }))}
                    >
                      <img src={specialist.image} alt={specialist.name} />
                      <div className="specialist-info">
                        <h4>{specialist.name}</h4>
                        <p>{specialist.specialty}</p>
                        <div className="specialist-meta">
                          <span>⭐ {specialist.rating}</span>
                          <span>📅 {specialist.experience}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.specialist && <span className="error-text">{errors.specialist}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Appointment Type</label>
                  <select
                    name="appointmentType"
                    value={formData.appointmentType}
                    onChange={handleInputChange}
                    className={errors.appointmentType ? 'error' : ''}
                  >
                    <option value="">Select type</option>
                    <option value="consultation">Initial Consultation</option>
                    <option value="follow-up">Follow-up Visit</option>
                    <option value="emergency">Emergency Consultation</option>
                    <option value="second-opinion">Second Opinion</option>
                  </select>
                  {errors.appointmentType && <span className="error-text">{errors.appointmentType}</span>}
                </div>
                <div className="form-group">
                  <label>Consultation Method</label>
                  <select
                    name="consultationType"
                    value={formData.consultationType}
                    onChange={handleInputChange}
                  >
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    className={errors.preferredDate ? 'error' : ''}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.preferredDate && <span className="error-text">{errors.preferredDate}</span>}
                </div>
                <div className="form-group">
                  <label>Preferred Time</label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className={errors.preferredTime ? 'error' : ''}
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.preferredTime && <span className="error-text">{errors.preferredTime}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Primary Health Concern</label>
                <textarea
                  name="healthConcern"
                  value={formData.healthConcern}
                  onChange={handleInputChange}
                  className={errors.healthConcern ? 'error' : ''}
                  rows="3"
                  placeholder="Please describe your main health concern or reason for consultation..."
                />
                {errors.healthConcern && <span className="error-text">{errors.healthConcern}</span>}
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Additional Information</h2>
              <p>Help your specialist prepare for your consultation</p>

              <div className="form-group">
                <label>Current Symptoms</label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe your current symptoms, when they started, and their severity..."
                />
              </div>

              <div className="form-group">
                <label>Current Medications & Supplements</label>
                <textarea
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="List any medications, vitamins, or supplements you're currently taking..."
                />
              </div>

              <div className="form-group">
                <label>Known Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="List any known allergies to foods, medications, or substances"
                />
              </div>

              <div className="form-group">
                <label>Previous Treatments</label>
                <textarea
                  name="previousTreatments"
                  value={formData.previousTreatments}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Describe any previous treatments you've tried for this condition..."
                />
              </div>

              <div className="form-group">
                <label>Urgency Level</label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                >
                  <option value="normal">Normal - Can wait a few days</option>
                  <option value="urgent">Urgent - Need appointment within 24-48 hours</option>
                  <option value="emergency">Emergency - Need immediate attention</option>
                </select>
              </div>

              <div className="form-group">
                <label>Special Requests or Questions</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Any special accommodations needed or questions for your specialist..."
                />
              </div>

              <div className="notification-preferences">
                <h3>Communication Preferences</h3>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Send appointment reminders via email
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={formData.smsNotifications}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Send appointment reminders via SMS
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="newsletterSubscription"
                      checked={formData.newsletterSubscription}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Subscribe to health and wellness newsletter
                  </label>
                </div>
              </div>
            </div>
          )}

          {errors.submit && <div className="error-text submit-error">{errors.submit}</div>}

          {/* Form Navigation */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" className="nav-btn prev-btn" onClick={handlePrevious}>
                ← Previous
              </button>
            )}
            
            <div className="nav-spacer"></div>
            
            {currentStep < 3 ? (
              <button type="button" className="nav-btn next-btn" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button 
                type="submit" 
                className="nav-btn submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner">⟳</span>
                    Booking...
                  </>
                ) : (
                  'Book Appointment'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBooking;
