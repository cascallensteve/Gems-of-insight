import React, { useState } from 'react';
import './AppointmentModal.css';

const AppointmentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    specialist: '',
    date: '',
    time: '',
    concern: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    { id: 'nutrition', name: 'Nutrition Consultation', price: 'KSH 2,500', duration: '30 min' },
    { id: 'herbal', name: 'Herbal Medicine', price: 'KSH 3,000', duration: '45 min' },
    { id: 'wellness', name: 'Wellness Coaching', price: 'KSH 2,000', duration: '30 min' },
    { id: 'initial', name: 'Initial Consultation', price: 'Free', duration: '15 min' }
  ];

  const specialists = [
    { id: 'sarah', name: 'Dr. Sarah Mitchell', specialty: 'Nutritionist', available: true },
    { id: 'james', name: 'Dr. James Chen', specialty: 'Herbal Medicine', available: true },
    { id: 'emily', name: 'Dr. Emily Rodriguez', specialty: 'Wellness Coach', available: false }
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const healthConcerns = [
    'Weight Management',
    'Digestive Issues',
    'Chronic Fatigue',
    'Stress & Anxiety',
    'Heart Health',
    'Joint Pain',
    'Sleep Problems',
    'Immune Support',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    // Allow navigation to completed steps or current step
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };
// Convert 12-hour time format to 24-hour format for API
const convertTo24Hour = (time12h) => {
  if (!time12h) return "";
  
  const [time, period] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (period === 'PM' && hours !== '12') {
    hours = String(parseInt(hours) + 12);
  } else if (period === 'AM' && hours === '12') {
    hours = '00';
  }
  
  return `${hours.padStart(2, '0')}:${minutes}:00`;
};

// Format phone number to ensure consistency
const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  
  // Remove any non-digit characters except + at the beginning
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // If it doesn't start with +, add +254 prefix for Kenya
  if (!cleanPhone.startsWith('+')) {
    // Remove leading 0 if present for Kenyan numbers
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
    cleanPhone = '+254' + cleanPhone;
  }
  
  return cleanPhone;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const requestData = {
    full_name: formData.fullName.trim(),
    email: formData.email.trim().toLowerCase(),
    phone_no: formatPhoneNumber(formData.phone),
    health_concern: formData.concern,
    preferred_date: formData.date,
    preferred_time: convertTo24Hour(formData.time),
    additional_notes: formData.notes ? formData.notes.trim() : "",
  };

  console.log("Sending appointment data:", requestData);

  try {
    const response = await fetch("https://gems-of-truth.vercel.app/bookings/book-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    if (!response.ok) {
      let errorMessage = "Failed to book appointment";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
        if (errorData.errors) {
          console.log("Validation errors:", errorData.errors);
        }
      } catch (parseError) {
        console.error("Could not parse error response:", parseError);
        errorMessage = `Server error (${response.status}): ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    alert("✅ " + (data.message || "Appointment booked successfully!"));

    // Reset form after success
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      service: "",
      specialist: "",
      date: "",
      time: "",
      concern: "",
      notes: "",
    });
    setCurrentStep(1);
    onClose();
  } catch (error) {
    console.error("Appointment booking error:", error);
    alert("❌ Error: " + error.message);
  } finally {
    setIsSubmitting(false);
  }
};

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone;
      case 2:
        return formData.service && formData.specialist && formData.concern;
      case 3:
        return formData.date && formData.time;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="appointment-modal-overlay" onClick={onClose}>
      <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book Your Appointment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3].map(step => (
              <div 
                key={step} 
                className={`progress-step ${currentStep >= step ? 'active' : ''} ${step < currentStep ? 'clickable' : ''}`}
                onClick={() => goToStep(step)}
                title={step < currentStep ? 'Click to go back to this step' : ''}
              >
                <div className="step-circle">
                  {step < currentStep ? '✓' : step}
                </div>
                <span className="step-label">
                  {step === 1 ? 'Personal Info' : step === 2 ? 'Service & Specialist' : 'Date & Time'}
                </span>
              </div>
            ))}
          </div>
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit} className="appointment-form">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+254 712 345 678"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service & Specialist */}
          {currentStep === 2 && (
            <div className="form-step">
              <h3>Choose Service & Specialist</h3>
              
              <div className="form-group">
                <label>Select Service *</label>
                <div className="service-cards">
                  {services.map(service => (
                    <div 
                      key={service.id}
                      className={`service-card ${formData.service === service.id ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, service: service.id }))}
                    >
                      <h4>{service.name}</h4>
                      <div className="service-details">
                        <span className="price">{service.price}</span>
                        <span className="duration">{service.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Choose Specialist *</label>
                <div className="specialist-cards">
                  {specialists.map(specialist => (
                    <div 
                      key={specialist.id}
                      className={`specialist-card ${formData.specialist === specialist.id ? 'selected' : ''} ${!specialist.available ? 'disabled' : ''}`}
                      onClick={() => specialist.available && setFormData(prev => ({ ...prev, specialist: specialist.id }))}
                    >
                      <h4>{specialist.name}</h4>
                      <p>{specialist.specialty}</p>
                      <span className={`availability ${specialist.available ? 'available' : 'unavailable'}`}>
                        {specialist.available ? '✓ Available' : '✗ Unavailable'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Main Health Concern *</label>
                <select
                  name="concern"
                  value={formData.concern}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your main concern</option>
                  {healthConcerns.map(concern => (
                    <option key={concern} value={concern}>{concern}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {currentStep === 3 && (
            <div className="form-step">
              <h3>Select Date & Time</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Preferred Time *</label>
                  <div className="time-slots">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        className={`time-slot ${formData.time === time ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, time }))}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any specific symptoms, questions, or requirements..."
                  rows="4"
                />
              </div>
            </div>
          )}

          {/* Form Navigation */}
          <div className="form-navigation">
            <div className="nav-left">
              {currentStep > 1 && (
                <>
                  <button type="button" className="btn-secondary" onClick={handlePrevious}>
                    ← Previous
                  </button>
                  <span className="back-hint">
                    or click on step {currentStep - 1} above to go back
                  </span>
                </>
              )}
            </div>
            
            <div className="nav-right">
              {currentStep < 3 ? (
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next →
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn-primary submit-btn"
                  disabled={!isStepValid() || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading">
                      <span className="spinner"></span>
                      Booking...
                    </span>
                  ) : (
                    '🗓️ Book Appointment'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
