import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const slideInterval = useRef(null);

  const slides = [
    {
      id: 1,
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      title: "Premium Natural Remedies",
      description: "Discover our collection of organic herbal solutions",
      cta: "Shop Now"
    },
    {
      id: 2,
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      title: "Fresh Ingredients",
      description: "Direct from nature to your doorstep",
      cta: "Explore"
    },
    {
      id: 3,
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753445611/pregnant-woman-receiving-bottle-pills-from-specialist-cure-disease-healthcare-physician-giving-prescription-treatment-medicine-patient-with-pregnancy-medical-office_qxkcps.jpg",
      title: "Expert Consultations",
      description: "Personalized wellness advice from our specialists",
      cta: "Book Now"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const startCarousel = () => {
      slideInterval.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
    };

    startCarousel();

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    // Reset timer when manually changing slides
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
  };

  const goToNext = () => goToSlide((currentSlide + 1) % slides.length);
  const goToPrev = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);

  return (
    <section className="hero">
      {/* Animated Background Elements */}
      <div className="hero-background">
        <div className="floating-element herb-1">🌿</div>
        <div className="floating-element herb-2">🍃</div>
        <div className="floating-element herb-3">🌱</div>
      </div>

      {/* Carousel Container */}
      <div className="carousel-container">
        <div 
          className="carousel-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`carousel-slide ${currentSlide === index ? 'active' : ''}`}
            >
              <div className="slide-image-container">
                <img src={slide.image} alt={slide.title} className="slide-image" />
                <div className="slide-overlay">
                  <div className="slide-content">
                    <h2 className="slide-title">{slide.title}</h2>
                    <p className="slide-description">{slide.description}</p>
                    <button className="slide-button">
                      {slide.cta} <span className="arrow-icon">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className="carousel-arrow prev" onClick={goToPrev}>
          &lt;
        </button>
        <button className="carousel-arrow next" onClick={goToNext}>
          &gt;
        </button>

        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;