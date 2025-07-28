import React, { useState } from 'react';
import './AboutPage.css';

const AboutPage = () => {
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

    // Clear error when user starts typing
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

    // Generate email content
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

    // Create mailto link
    const mailtoLink = `mailto:applications@gemsofinsight.com?subject=Medical Missionary Training Registration&body=${encodeURIComponent(emailContent)}`;
    window.location.href = mailtoLink;

    alert('Registration form will be sent via email. Please make the KES 1,500 registration fee payment after submitting.');
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>About Gems of Insight</h1>
            <p>Empowering communities through natural health education and holistic wellness solutions</p>
          </div>
          <div className="hero-image">
            <img 
              src="https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg" 
              alt="Natural Health"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                At Gems of Insight, we are dedicated to promoting natural health and wellness through 
                education, quality products, and community support. We believe in the power of nature 
                to heal and restore, combining traditional wisdom with modern understanding.
              </p>
              <div className="mission-values">
                <div className="value-item">
                  <h3>🌿 Natural Healing</h3>
                  <p>Promoting the use of natural remedies and holistic approaches to health</p>
                </div>
                <div className="value-item">
                  <h3>📚 Education</h3>
                  <p>Empowering individuals with knowledge to make informed health decisions</p>
                </div>
                <div className="value-item">
                  <h3>🤝 Community</h3>
                  <p>Building a supportive network of health-conscious individuals and families</p>
                </div>
              </div>
            </div>
            <div className="mission-image">
              <img 
                src="https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg" 
                alt="Our Mission"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Medical Missionary Section */}
      <section className="medical-missionary-section">
        <div className="container">
          <div className="section-header">
            <h2>Join Medical Missionary Classes</h2>
            <p>Gospel Medical Missionary Evangelism Training</p>
          </div>

          <div className="missionary-content">
            <div className="missionary-quote">
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

            <div className="training-modules">
              <h3>Levels of Training</h3>
              <div className="modules-grid">
                <div className="module-card">
                  <h4>Module One</h4>
                  <h5>Essentials of Applied Clinical Nutrition</h5>
                  <div className="module-details">
                    <span className="duration">1 Month</span>
                    <span className="price">KSh 10,000</span>
                  </div>
                </div>
                
                <div className="module-card">
                  <h4>Module Two</h4>
                  <h5>Fundamentals of Human Anatomy, Physiology & Clinical Pathology</h5>
                  <div className="module-details">
                    <span className="duration">4 Months</span>
                    <span className="price">KSh 30,000</span>
                  </div>
                </div>
                
                <div className="module-card">
                  <h4>Module Three</h4>
                  <h5>Herbology and Botanical Medicine</h5>
                  <div className="module-details">
                    <span className="duration">2 Months</span>
                    <span className="price">KSh 20,000</span>
                  </div>
                </div>
              </div>
              
              <div className="total-cost">
                <strong>Total Cost: KSh 60,000</strong>
              </div>
            </div>

            <div className="payment-methods">
              <h3>Payment Methods</h3>
              <div className="payment-options">
                <div className="payment-option">
                  <h4>Lipa Na M-Pesa Paybill</h4>
                  <p><strong>Business No:</strong> 247247</p>
                  <p><strong>Account No:</strong> 901 858 076 15</p>
                </div>
                <div className="payment-option">
                  <h4>M-Pesa Send Money</h4>
                  <p><strong>Phone No:</strong> 0794491920</p>
                </div>
              </div>
            </div>

            <div className="registration-section">
              <button 
                className="register-btn"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Hide Registration Form' : 'Show Registration Form'}
              </button>

              {showForm && (
                <div className="registration-form-container">
                  <h3>Registration Form</h3>
                  <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-section">
                      <h4>Personal Details</h4>
                      
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
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className={errors.gender ? 'error' : ''}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
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
                      <h4>Select Module of Interest *</h4>
                      <div className="module-selection">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="selectedModules"
                            value="Module One - Essentials of Applied Clinical Nutrition"
                            checked={formData.selectedModules.includes('Module One - Essentials of Applied Clinical Nutrition')}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark"></span>
                          Module One - Essentials of Applied Clinical Nutrition (KSh 10,000)
                        </label>
                        
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="selectedModules"
                            value="Module Two - Fundamentals of Human Anatomy, Physiology & Clinical Pathology"
                            checked={formData.selectedModules.includes('Module Two - Fundamentals of Human Anatomy, Physiology & Clinical Pathology')}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark"></span>
                          Module Two - Fundamentals of Human Anatomy, Physiology & Clinical Pathology (KSh 30,000)
                        </label>
                        
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="selectedModules"
                            value="Module Three - Herbology and Botanical Medicine"
                            checked={formData.selectedModules.includes('Module Three - Herbology and Botanical Medicine')}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark"></span>
                          Module Three - Herbology and Botanical Medicine (KSh 20,000)
                        </label>
                      </div>
                      {errors.selectedModules && <span className="error-text">{errors.selectedModules}</span>}
                    </div>

                    <button type="submit" className="submit-btn">
                      Submit Registration
                    </button>
                  </form>

                  <div className="form-notes">
                    <h4>Notes:</h4>
                    <ul>
                      <li>Once this form is fully completed, email it to <strong>applications@gemsofinsight.com</strong></li>
                      <li>A non-refundable registration fee of <strong>KSh 1,500</strong> should be sent immediately after submitting the form</li>
                      <li>A certificate will be issued upon receipt and evaluation of all completed assignments</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="contact-info">
              <h3>Contact Information</h3>
              <div className="contact-details">
                <p>📞 0794491920</p>
                <p>✉️ info@gemsofinsight.com</p>
                <p>🌐 www.gemsofinsight.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
