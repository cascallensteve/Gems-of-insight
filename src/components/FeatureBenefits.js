import React, { useEffect } from 'react';
import './FeatureBenefits.css';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';

const FeatureBenefits = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    },
    hidden: {}
  };

  const itemVariants = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: 'easeOut'
      }
    },
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9
    }
  };

  const features = [
    {
      icon: '🚚',
      title: 'Free Shipping',
      description: 'Free shipping on all orders over KSH 2,000',
      color: '#4CAF50'
    },
    {
      icon: '🌍',
      title: 'Support 24/7',
      description: 'Contact us 24 hours a day, 7 days a week',
      color: '#2196F3'
    },
    {
      icon: '↩️',
      title: '30 Days Return',
      description: 'Simply return it within 30 days for an exchange',
      color: '#FF9800'
    },
    {
      icon: '🔒',
      title: '100% Payment Secure',
      description: 'We ensure secure payment with M-Pesa and cards',
      color: '#9C27B0'
    }
  ];

  return (
    <section className="feature-benefits" ref={ref}>
      <div className="container">
        <motion.div 
          className="features-grid"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-item"
              variants={itemVariants}
            >
              <div className="feature-icon" style={{ backgroundColor: feature.color + '20', color: feature.color }}>
                <span className="icon-emoji">{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureBenefits;
