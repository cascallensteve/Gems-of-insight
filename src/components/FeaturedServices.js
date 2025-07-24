import React from 'react';
import './FeaturedServices.css';

const FeaturedServices = () => {
  const services = [
    {
      id: 1,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7V17C3 18.1 3.9 19 5 19H19C20.1 19 21 18.1 21 17V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 9V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3 9V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: "Free Shipping",
      description: "Free Shipping On All Us Order or Order Above $200"
    },
    {
      id: 2,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 10.5C18 14.1 15.3 17 12 17C8.7 17 6 14.1 6 10.5C6 6.9 8.7 4 12 4C15.3 4 18 6.9 18 10.5Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 13C10.3 13 9 11.7 9 10.5C9 9.3 10.3 8 12 8C13.7 8 15 9.3 15 10.5C15 11.7 13.7 13 12 13Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M19 16H5C4.4 16 4 16.4 4 17V19C4 19.6 4.4 20 5 20H19C19.6 20 20 19.6 20 19V17C20 16.4 19.6 16 19 16Z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      title: "Support 24/7",
      description: "Contact Us 24 Hours A Day, 7 Days A Week"
    },
    {
      id: 3,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7.05 7.05L4.22 4.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: "07 Days Return",
      description: "Simply Return It Within 30 Days For An Exchange"
    },
    {
      id: 4,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 6V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: "100% Payment Secure",  
      description: "We Ensure Secure Payment with PayPal And Card"
    }
  ];

  return (
    <section className="featured-services">
      <div className="services-container">
        {services.map((service, index) => (
          <div 
            key={service.id} 
            className={`service-card ${index % 2 === 0 ? 'animate-from-left' : 'animate-from-right'}`}
          >
            <div className="service-icon">{service.icon}</div>
            <div className="service-content">
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedServices;
