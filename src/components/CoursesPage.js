import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './CoursesPage.css';

const CoursesPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    otherNames: '',
    gender: '',
    yearOfBirth: '',
    email: '',
    phoneNumber: '',
    otherNumber: '',
    homeAddress: '',
    city: '',
    country: 'Kenya',
    religion: '',
    church: '',
    membershipDuration: '',
    selectedModules: []
  });

  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'selectedModules') {
      setFormData(prev => ({
        ...prev,
        selectedModules: checked 
          ? [...prev.selectedModules, value]
          : prev.selectedModules.filter(module => module !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.yearOfBirth) newErrors.yearOfBirth = 'Year of birth is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.homeAddress) newErrors.homeAddress = 'Home address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (formData.selectedModules.length === 0) {
      newErrors.selectedModules = 'Please select at least one module';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const emailContent = `
      GOSPEL MEDICAL MISSIONARY EVANGELISM TRAINING - REGISTRATION FORM
      
      PERSONAL DETAILS:
      First Name: ${formData.firstName}
      Other Names: ${formData.otherNames}
      Gender: ${formData.gender}
      Year of Birth: ${formData.yearOfBirth}
      Email: ${formData.email}
      Phone Number: ${formData.phoneNumber}
      Other Number: ${formData.otherNumber}
      Home Address: ${formData.homeAddress}
      City: ${formData.city}
      Country: ${formData.country}
      Religion: ${formData.religion}
      Church: ${formData.church}
      Duration of Membership: ${formData.membershipDuration}
      
      SELECTED MODULES:
      ${formData.selectedModules.join(', ')}
    `;

    const mailtoLink = `mailto:applications@gemsofinsight.com?subject=Medical Missionary Training Registration&body=${encodeURIComponent(emailContent)}`;
    window.location.href = mailtoLink;

    alert('Registration form will be sent via email. Please make the KES 1,500 registration fee payment after submitting.');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div 
      ref={ref}
      className="courses-page"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.section className="courses-hero" variants={itemVariants}>
        <div className="hero-overlay"></div>
        <div className="hero-background">
          <img 
            src="https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg" 
            alt="Medical Missionary Training"
          />
        </div>
        <div className="hero-content">
          <h1>Gospel Medical Missionary Evangelism Training</h1>
          <p>Equipping you with the knowledge and skills to serve others through natural health ministry</p>
          <div className="contact-info-hero">
            <p>📞 0794491920 | ✉️ info@gemsofinsight.com | 🌐 www.gemsofinsight.com</p>
          </div>
        </div>
      </motion.section>

      <div className="courses-container">
        {/* Mission Quote */}
        <motion.section className="mission-quote-section" variants={itemVariants}>
          <div className="quote-content">
            <blockquote>
              "Medical missionary work brings to humanity the gospel of release from suffering. 
              It is the pioneer work of the gospel. It is the gospel practiced, the compassion of Christ revealed. 
              Of this work there is great need, and the world is open for it. God grant that the importance of 
              medical missionary work shall be understood, and that new fields may be immediately entered. 
              Then will the work of the ministry be after the Lord's order; the sick will be healed, 
              and poor, suffering humanity will be blessed."
            </blockquote>
            <cite>- MM 239.3</cite>
          </div>
        </motion.section>

        {/* Training Modules */}
        <motion.section className="training-modules" variants={itemVariants}>
          <h2>Levels of Training</h2>
          <div className="modules-grid">
            <motion.div className="module-card" variants={itemVariants}>
              <div className="module-header">
                <span className="module-letter">A</span>
                <h3>Module One</h3>
              </div>
              <h4>Essentials of Applied Clinical Nutrition</h4>
              <div className="module-details">
                <span className="duration">1 Month</span>
                <span className="price">KES 10,000</span>
              </div>
              <p>Master the fundamentals of clinical nutrition and therapeutic dietary approaches for optimal health.</p>
            </motion.div>

            <motion.div className="module-card" variants={itemVariants}>
              <div className="module-header">
                <span className="module-letter">B</span>
                <h3>Module Two</h3>
              </div>
              <h4>Fundamentals of Human Anatomy, Physiology & Clinical Pathology</h4>
              <div className="module-details">
                <span className="duration">4 Months</span>
                <span className="price">KES 30,000</span>
              </div>
              <p>Comprehensive understanding of human body systems, functions, and disease processes.</p>
            </motion.div>

            <motion.div className="module-card" variants={itemVariants}>
              <div className="module-header">
                <span className="module-letter">C</span>
                <h3>Module Three</h3>
              </div>
              <h4>Herbology and Botanical Medicine</h4>
              <div className="module-details">
                <span className="duration">2 Months</span>
                <span className="price">KES 20,000</span>
              </div>
              <p>Study of medicinal plants and their applications in traditional and modern healing practices.</p>
            </motion.div>
          </div>
          
          <div className="total-cost">
            <h3>Total Cost: KES 60,000</h3>
          </div>
        </motion.section>

        {/* Payment Methods */}
        <motion.section className="payment-methods" variants={itemVariants}>
          <h2>Payment Methods</h2>
          <div className="payment-options">
            <div className="payment-option">
              <h4>Lipa Na M-Pesa Paybill</h4>
              <div className="payment-details">
                <p><strong>Business No:</strong> 247247</p>
                <p><strong>Account No:</strong> 00 901 858 076 15</p>
              </div>
            </div>
            <div className="payment-option">
              <h4>M-Pesa Send Money</h4>
              <div className="payment-details">
                <p><strong>Phone No:</strong> 0794491920</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Registration Section */}
        <motion.section className="registration-section" variants={itemVariants}>
          <h2>Registration Form</h2>
          
          <div className="registration-cta">
            <button 
              className="toggle-form-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Hide Registration Form' : 'Show Registration Form'}
            </button>
          </div>

          {showForm && (
            <motion.div 
              className="registration-form-container"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-section">
                  <h3>Personal Details</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Other Names</label>
                      <input
                        type="text"
                        name="otherNames"
                        value={formData.otherNames}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Gender *</label>
                      <div className="gender-options">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={formData.gender === 'Male'}
                            onChange={handleInputChange}
                          />
                          <span className="radio-custom"></span>
                          Male
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={formData.gender === 'Female'}
                            onChange={handleInputChange}
                          />
                          <span className="radio-custom"></span>
                          Female
                        </label>
                      </div>
                      {errors.gender && <span className="error-text">{errors.gender}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Year of Birth *</label>
                      <input
                        type="number"
                        name="yearOfBirth"
                        value={formData.yearOfBirth}
                        onChange={handleInputChange}
                        min="1920"
                        max="2010"
                        className={errors.yearOfBirth ? 'error' : ''}
                      />
                      {errors.yearOfBirth && <span className="error-text">{errors.yearOfBirth}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+254..."
                        className={errors.phoneNumber ? 'error' : ''}
                      />
                      {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Other Number</label>
                      <input
                        type="tel"
                        name="otherNumber"
                        value={formData.otherNumber}
                        onChange={handleInputChange}
                        placeholder="+254..."
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Home Address *</label>
                      <input
                        type="text"
                        name="homeAddress"
                        value={formData.homeAddress}
                        onChange={handleInputChange}
                        className={errors.homeAddress ? 'error' : ''}
                      />
                      {errors.homeAddress && <span className="error-text">{errors.homeAddress}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? 'error' : ''}
                      />
                      {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Country *</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={errors.country ? 'error' : ''}
                      />
                      {errors.country && <span className="error-text">{errors.country}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Religion</label>
                      <input
                        type="text"
                        name="religion"
                        value={formData.religion}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Church</label>
                      <input
                        type="text"
                        name="church"
                        value={formData.church}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Duration of Membership</label>
                    <input
                      type="text"
                      name="membershipDuration"
                      value={formData.membershipDuration}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 years"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Select Module of Interest *</h3>
                  <div className="module-selection">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="selectedModules"
                        value="Module One"
                        checked={formData.selectedModules.includes('Module One')}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      Module One - Essentials of Applied Clinical Nutrition (KES 10,000)
                    </label>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="selectedModules"
                        value="Module Two"
                        checked={formData.selectedModules.includes('Module Two')}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      Module Two - Fundamentals of Human Anatomy, Physiology & Clinical Pathology (KES 30,000)
                    </label>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="selectedModules"
                        value="Module Three"
                        checked={formData.selectedModules.includes('Module Three')}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      Module Three - Herbology and Botanical Medicine (KES 20,000)
                    </label>
                  </div>
                  {errors.selectedModules && <span className="error-text">{errors.selectedModules}</span>}
                </div>

                <button type="submit" className="submit-btn">
                  Submit Registration
                </button>
              </form>
            </motion.div>
          )}
        </motion.section>

        {/* Notes Section */}
        <motion.section className="notes-section" variants={itemVariants}>
          <h2>Important Notes</h2>
          <div className="notes-content">
            <div className="note-item">
              <span className="note-icon">📧</span>
              <p>Once this form is fully completed, email it to <strong>applications@gemsofinsight.com</strong></p>
            </div>
            <div className="note-item">
              <span className="note-icon">💰</span>
              <p>A non-refundable registration fee of <strong>KES 1,500</strong> should be sent immediately after submitting the form.</p>
            </div>
            <div className="note-item">
              <span className="note-icon">🎓</span>
              <p>A certificate will be issued upon receipt and evaluation of all completed assignments.</p>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default CoursesPage;
