import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder, initiateMpesaPayment, checkPaymentStatus } from '../services/api';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    city: '',
    county: '',
    postalCode: ''
  });

  const [errors, setErrors] = useState({});

  const subtotal = getCartTotal();
  const shippingCost = subtotal > 2000 ? 0 : 200; // Free shipping over KSH 2000
  const tax = subtotal * 0.16; // 16% VAT
  const total = subtotal + shippingCost + tax;

  const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu',
    'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa',
    'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
    'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
    'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
      if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
      if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
      if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
      if (!shippingInfo.county) newErrors.county = 'County is required';
    }

    if (step === 2) {
      if (!mpesaPhone.trim()) newErrors.mpesaPhone = 'M-Pesa phone number is required';
      if (!/^254\d{9}$/.test(mpesaPhone.replace(/\s/g, ''))) {
        newErrors.mpesaPhone = 'Please enter a valid Kenyan phone number (254xxxxxxxxx)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const formatPhoneNumber = (phone) => {
    // Convert to 254 format
    let formatted = phone.replace(/\s/g, '');
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (formatted.startsWith('+254')) {
      formatted = formatted.substring(1);
    } else if (!formatted.startsWith('254')) {
      formatted = '254' + formatted;
    }
    return formatted;
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      // Create order
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingInfo,
        paymentMethod,
        subtotal,
        shippingCost,
        tax,
        total: Math.round(total * 100) / 100 // Round to 2 decimal places
      };

      const orderResponse = await createOrder(orderData);
      const newOrderId = orderResponse.orderId || `ORD-${Date.now()}`;
      setOrderId(newOrderId);

      // Initiate M-Pesa payment (only payment method available)
      const formattedPhone = formatPhoneNumber(mpesaPhone);
      const paymentData = {
        phoneNumber: formattedPhone,
        amount: Math.round(total),
        orderId: newOrderId,
        accountReference: newOrderId,
        transactionDesc: `Payment for order ${newOrderId}`
      };

      const paymentResponse = await initiateMpesaPayment(paymentData);
      
      if (paymentResponse.success) {
        setPaymentStatus('pending');
        setOrderPlaced(true);
        clearCart();
        
        // Check payment status periodically
        const checkInterval = setInterval(async () => {
          try {
            const statusResponse = await checkPaymentStatus(paymentResponse.checkoutRequestId);
            
            if (statusResponse.resultCode === '0') {
              setPaymentStatus('completed');
              clearInterval(checkInterval);
            } else if (statusResponse.resultCode && statusResponse.resultCode !== '0') {
              setPaymentStatus('failed');
              clearInterval(checkInterval);
            }
          } catch (error) {
            console.error('Error checking payment status:', error);
          }
        }, 5000);

        // Stop checking after 5 minutes
        setTimeout(() => {
          clearInterval(checkInterval);
          if (paymentStatus === 'pending') {
            setPaymentStatus('timeout');
          }
        }, 300000);
      } else {
        throw new Error(paymentResponse.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      setErrors({ submit: error.message || 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">
              {paymentStatus === 'completed' ? '✅' : 
               paymentStatus === 'failed' ? '❌' : 
               paymentStatus === 'timeout' ? '⏰' : '⏳'}
            </div>
            
            <h2>
              {paymentStatus === 'completed' ? 'Order Confirmed!' :
               paymentStatus === 'failed' ? 'Payment Failed' :
               paymentStatus === 'timeout' ? 'Payment Timeout' :
               'Order Placed!'}
            </h2>
            
            <p>
              {paymentStatus === 'completed' ? 
                `Your order #${orderId} has been confirmed and payment received.` :
               paymentStatus === 'failed' ?
                'Your payment was not successful. Please try again or contact support.' :
               paymentStatus === 'timeout' ?
                'Payment verification timed out. Please check your M-Pesa messages or contact support.' :
               'Please check your phone for M-Pesa payment prompt and complete the transaction.'}
            </p>

            {paymentStatus === 'pending' && (
              <div className="mpesa-instructions">
                <h3>Complete your M-Pesa Payment</h3>
                <ol>
                  <li>Check your phone for M-Pesa payment request</li>
                  <li>Enter your M-Pesa PIN to complete payment</li>
                  <li>You'll receive a confirmation SMS</li>
                </ol>
                <div className="payment-status">
                  <div className="status-indicator pending"></div>
                  Waiting for payment confirmation...
                </div>
              </div>
            )}

            <div className="order-summary">
              <h3>Order Summary</h3>
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Total Amount:</strong> KSH {total.toLocaleString()}</p>
              <p><strong>Payment Method:</strong> M-Pesa Mobile Money</p>
              <p><strong>Delivery Address:</strong> {shippingInfo.address}, {shippingInfo.city}</p>
            </div>

            <div className="success-actions">
              <button 
                className="primary-btn" 
                onClick={() => window.location.href = '/orders'}
              >
                View My Orders
              </button>
              <button 
                className="secondary-btn" 
                onClick={() => window.location.href = '/shop'}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">


        <div className="checkout-content">
          {/* Main Content */}
          <div className="checkout-main">
            {currentStep === 1 && (
              <div className="shipping-step">
                <div className="step-header">
                  <button 
                    className="back-to-cart-btn"
                    onClick={() => window.location.href = '/cart'}
                  >
                    ← Back to Cart
                  </button>
                  <h2>Shipping Information</h2>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      placeholder="0712345678"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      placeholder="Street address, building, apartment"
                      className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>

                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label>County *</label>
                    <select
                      name="county"
                      value={shippingInfo.county}
                      onChange={handleInputChange}
                      className={errors.county ? 'error' : ''}
                    >
                      <option value="">Select County</option>
                      {counties.map(county => (
                        <option key={county} value={county}>{county}</option>
                      ))}
                    </select>
                    {errors.county && <span className="error-text">{errors.county}</span>}
                  </div>

                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="payment-step">
                <h2>Payment Method</h2>
                
                <div className="payment-methods">
                  <div className="payment-method-header">
                    <h3>Instant Payment - M-Pesa Only</h3>
                    <p>Secure and instant mobile money payment</p>
                  </div>
                  
                  <div className={`payment-option selected mpesa-only`}>
                    <div className="payment-info">
                      <div className="payment-logo">
                        <img 
                          src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1755521690/download_fab1uz.png" 
                          alt="M-Pesa"
                          onError={(e) => {
                            console.log(`Failed to load M-Pesa logo: ${e.target.src}`);
                            // Fallback to a simple M-Pesa text if image fails
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '<div style="color: #00D160; font-weight: bold; font-size: 18px;">M-PESA</div>';
                          }}
                          onLoad={() => console.log(`Successfully loaded M-Pesa logo`)}
                        />
                      </div>
                      <div className="payment-details">
                        <h3>M-Pesa Mobile Money</h3>
                        <p>Fast, secure & instant payment</p>
                        <div className="payment-features">
                          <span className="feature">✓ Instant Processing</span>
                          <span className="feature">✓ Secure Payment</span>
                          <span className="feature">✓ No Additional Fees</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* M-Pesa Details - Always show since it's the only payment method */}
                {true && (
                  <div className="mpesa-details">
                    <h3>M-Pesa Payment Details</h3>
                    <div className="form-group">
                      <label>M-Pesa Phone Number *</label>
                      <input
                        type="tel"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        placeholder="254712345678"
                        className={errors.mpesaPhone ? 'error' : ''}
                      />
                      {errors.mpesaPhone && <span className="error-text">{errors.mpesaPhone}</span>}
                      <small>Enter your M-Pesa registered phone number</small>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="review-step">
                <h2>Review Your Order</h2>
                
                <div className="review-sections">
                  <div className="review-section">
                    <h3>Shipping Information</h3>
                    <div className="review-content">
                      <p><strong>{shippingInfo.firstName} {shippingInfo.lastName}</strong></p>
                      <p>{shippingInfo.email}</p>
                      <p>{shippingInfo.phone}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.county} {shippingInfo.postalCode}</p>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Payment Method</h3>
                    <div className="review-content">
                      <p>M-Pesa Mobile Money ({mpesaPhone})</p>
                      <small>Instant & Secure Payment</small>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Order Items</h3>
                    <div className="review-items">
                      {cartItems.map(item => (
                        <div key={item.id} className="review-item">
                          <img src={item.image} alt={item.name} />
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p>Qty: {item.quantity}</p>
                          </div>
                          <div className="item-price">
                            KSH {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="error-message">
                    {errors.submit}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="checkout-navigation">
              {currentStep > 1 && (
                <button className="back-btn" onClick={handleBack}>
                  ← Back
                </button>
              )}
              
              {currentStep < 3 ? (
                <button className="next-btn" onClick={handleNext}>
                  Continue →
                </button>
              ) : (
                <button 
                  className="place-order-btn" 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Place Order - KSH ${total.toLocaleString()}`}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="item-total">
                      KSH {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>KSH {subtotal.toLocaleString()}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>{shippingCost === 0 ? 'Free' : `KSH ${shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="total-row">
                  <span>VAT (16%):</span>
                  <span>KSH {tax.toLocaleString()}</span>
                </div>
                <div className="total-row final-total">
                  <span>Total:</span>
                  <span>KSH {total.toLocaleString()}</span>
                </div>
              </div>

              {shippingCost === 0 && (
                <div className="free-shipping-notice">
                  🎉 You qualify for free shipping!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
