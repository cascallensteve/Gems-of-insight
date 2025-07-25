import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedServices from './components/FeaturedServices';
import NewArrivals from './components/NewArrivals';

import BlogPage from './components/BlogPage';
import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';
import OrdersPage from './components/OrdersPage';
import ProductSection from './components/ProductSection';
import ConsultationPage from './components/ConsultationPage';
import Shop from './components/Shop';

import Cart from './components/Cart';
import ProductView from './components/ProductView';
import QuickView from './components/QuickView';
import NewFooter from './components/NewFooter';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductViewOpen, setIsProductViewOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Check for logged in user on app load
  React.useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSearch = ({ searchTerm, category }) => {
    // In a real app, this would make an API call
    console.log('Search:', { searchTerm, category });
    // SEO-optimized search with keywords
    const allProductsForSearch = [...recentProducts, ...bestSellers, ...newProducts];
    const filtered = allProductsForSearch.filter(product => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchTermLower) ||
        product.category.toLowerCase().includes(searchTermLower) ||
        product.description.toLowerCase().includes(searchTermLower) ||
        (product.diseases && product.diseases.some(disease => 
          disease.toLowerCase().includes(searchTermLower)
        )) ||
        (product.seoKeywords && product.seoKeywords.some(keyword => 
          keyword.toLowerCase().includes(searchTermLower)
        ))
      );
    });
    setSearchResults(filtered);
  };

  // Natural Remedies and Disease Treatment Products
  const recentProducts = [
    {
      id: 1,
      name: "Golden Turmeric Extract",
      category: "Anti-Inflammatory",
      price: "2,499",
      originalPrice: "2,999",
      sale: true,
      description: "Pure curcumin extract with 95% active compounds for maximum healing benefits",
      diseases: ["Arthritis", "Joint Pain", "Inflammation", "Digestive Issues"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302980/turmeric-powder_joex5s.jpg"
    },
    {
      id: 2,
      name: "Organic Ginger Supreme",
      category: "Digestive Health",
      price: "1,850",
      description: "Premium ginger root powder for nausea relief and digestive wellness",
      diseases: ["Nausea", "Motion Sickness", "Digestive Problems", "Morning Sickness"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg"
    },
    {
      id: 3,
      name: "Immunity Boost Garlic",
      category: "Immune Support",
      price: "1,675",
      originalPrice: "1,999",
      sale: true,
      description: "Concentrated aged garlic extract for powerful immune system support",
      diseases: ["Cold & Flu", "Infections", "High Blood Pressure", "High Cholesterol"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302932/garlic-cherry-tomatoes-with-salt-shaker_hsjxnm.jpg"
    },
    {
      id: 4,
      name: "Healing Aloe Vera Gel",
      category: "Skin & Wound Care",
      price: "2,225",
      description: "Pure aloe vera gel for burns, cuts, and skin inflammation relief",
      diseases: ["Burns", "Cuts", "Eczema", "Psoriasis", "Skin Inflammation"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303607/aloe-vera-leaves-with-beauty-cream-bottle_jahbg4.jpg"
    },
    {
      id: 9,
      name: "Echinacea Immune Complex",
      category: "Immune Support",
      price: "2,199",
      description: "Potent echinacea blend to strengthen natural immune defenses",
      diseases: ["Cold Prevention", "Flu", "Respiratory Infections", "Weak Immunity"],
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 10,
      name: "Milk Thistle Liver Detox",
      category: "Detox & Cleanse",
      price: "2,750",
      originalPrice: "3,299",
      sale: true,
      description: "Silymarin-rich milk thistle for liver protection and detoxification",
      diseases: ["Liver Disease", "Hepatitis", "Fatty Liver", "Liver Detox"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982760/fresh-dairy-products_x9g8ov.jpg"
    },
     {
      id: 10,
      name: "Milk Thistle Liver Detox",
      category: "Detox & Cleanse",
      price: "2,750",
      originalPrice: "3,299",
      sale: true,
      description: "Silymarin-rich milk thistle for liver protection and detoxification",
      diseases: ["Liver Disease", "Hepatitis", "Fatty Liver", "Liver Detox"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg"
    },
     {
      id: 10,
      name: "Milk Thistle Liver Detox",
      category: "Detox & Cleanse",
      price: "2,750",
      originalPrice: "3,299",
      sale: true,
      description: "Silymarin-rich milk thistle for liver protection and detoxification",
      diseases: ["Liver Disease", "Hepatitis", "Fatty Liver", "Liver Detox"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302932/garlic-cherry-tomatoes-with-salt-shaker_hsjxnm.jpg"
    }
  ];

  const bestSellers = [
    {
      id: 5,
      name: "Ashwagandha Stress Relief",
      category: "Stress & Anxiety",
      price: "2,999",
      description: "Adaptogenic herb to reduce stress, anxiety and improve sleep quality",
      diseases: ["Stress", "Anxiety", "Insomnia", "Adrenal Fatigue", "Depression"],
      image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 6,
      name: "Cayenne Pain Relief",
      category: "Pain Management",
      price: "1,550",
      originalPrice: "1,900",
      sale: true,
      description: "Capsaicin-rich cayenne for natural pain relief and circulation",
      diseases: ["Arthritis Pain", "Muscle Pain", "Nerve Pain", "Poor Circulation"],
      image: "https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 7,
      name: "Hibiscus Blood Pressure",
      category: "Cardiovascular",
      price: "1,975",
      description: "Natural hibiscus extract to support healthy blood pressure levels",
      diseases: ["High Blood Pressure", "Hypertension", "Heart Health", "Cholesterol"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982760/fresh-dairy-products_x9g8ov.jpg"
    },
    {
      id: 8,
      name: "Chamomile Sleep Aid",
      category: "Sleep & Relaxation",
      price: "1,799",
      description: "Gentle chamomile flowers for peaceful sleep and anxiety relief",
      diseases: ["Insomnia", "Sleep Disorders", "Anxiety", "Restlessness"],
      image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
  ]

  // New Featured Products
  const newProducts = [
    {
      id: 11,
      name: "Premium Black Pepper",
      category: "Spices & Seasonings",
      price: "899",
      originalPrice: "1,199",
      sale: true,
      description: "Finest quality black pepper with intense aroma and flavor",
      diseases: ["Digestive Issues", "Poor Circulation", "Cold & Cough"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302980/turmeric-powder_joex5s.jpg",
      seoKeywords: ["black pepper", "spice", "natural pepper", "organic spice"]
    },
    {
      id: 12,
      name: "Organic Moringa Powder",
      category: "Superfoods",
      price: "1,799",
      description: "Nutrient-rich moringa leaves powder packed with vitamins and minerals",
      diseases: ["Malnutrition", "Low Energy", "Poor Immunity", "Diabetes"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      seoKeywords: ["moringa", "superfood", "organic moringa", "nutritional supplement"]
    },
    {
      id: 13,
      name: "Aromatic Cloves",
      category: "Spices & Seasonings", 
      price: "749",
      originalPrice: "999",
      sale: true,
      description: "Premium quality cloves with natural antiseptic properties",
      diseases: ["Toothache", "Bad Breath", "Digestive Problems", "Respiratory Issues"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302932/garlic-cherry-tomatoes-with-salt-shaker_hsjxnm.jpg",
      seoKeywords: ["cloves", "natural remedy", "aromatic spice", "dental health"]
    },
    {
      id: 14,
      name: "Authentic Tea Masala",
      category: "Spices & Seasonings",
      price: "649",
      description: "Traditional blend of spices for perfect chai tea",
      diseases: ["Digestion", "Cold & Flu", "Low Energy"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303607/aloe-vera-leaves-with-beauty-cream-bottle_jahbg4.jpg",
      seoKeywords: ["tea masala", "chai spice", "traditional blend", "indian spices"]
    },
    {
      id: 15,
      name: "Pure Vanilla Powder",
      category: "Natural Flavoring",
      price: "1,299",
      originalPrice: "1,599",
      sale: true,
      description: "Natural vanilla powder for baking and desserts",
      diseases: ["Mood Enhancement", "Stress Relief"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982760/fresh-dairy-products_x9g8ov.jpg",
      seoKeywords: ["vanilla powder", "natural flavoring", "pure vanilla", "baking ingredient"]
    },
    {
      id: 16,
      name: "Rich Cocoa Powder",
      category: "Natural Flavoring",
      price: "1,149",
      description: "Premium unsweetened cocoa powder rich in antioxidants",
      diseases: ["Heart Health", "Mood Enhancement", "Antioxidant Support"],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      seoKeywords: ["cocoa powder", "chocolate powder", "antioxidant rich", "natural cocoa"]
    }
  ];

  const allProducts = [...recentProducts, ...bestSellers, ...newProducts];

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleProductView = (product) => {
    setSelectedProduct(product);
    setIsProductViewOpen(true);
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'shop':
        return <Shop 
          allProducts={allProducts}
          bestSellers={bestSellers}
          onQuickView={handleQuickView}
          onProductView={handleProductView}
          onSearch={handleSearch}
        />;
      case 'blog':
        return <BlogPage />;
      case 'consultation':
        return <ConsultationPage />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onClose={() => setCurrentPage('home')} />;
      case 'profile':
        return <UserProfile currentUser={currentUser} onUpdate={handleLogin} />;
      case 'orders':
        return <OrdersPage currentUser={currentUser} />;
      case 'home':
      default:
        return (
          <>
            <Hero />
            <FeaturedServices />
            <NewArrivals onNavigateToShop={() => setCurrentPage('shop')} />
            
            {searchResults && (
              <ProductSection 
                title="Search Results"
                products={searchResults}
                onQuickView={handleQuickView}
                onProductView={handleProductView}
              />
            )}
          </>
        );
    }
  };

  return (
    <CartProvider>
      <div className="App">
        <Navbar 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          openAppointmentModal={() => setIsAppointmentModalOpen(true)}
          openCart={handleOpenCart}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        
        {renderPage()}
        

        
        <Cart 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onOpenQuickView={handleQuickView}
        />
        
        <ProductView 
          product={selectedProduct}
          isOpen={isProductViewOpen}
          onClose={() => setIsProductViewOpen(false)}
        />
        
        <QuickView 
          product={selectedProduct}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          onOpenFullView={handleProductView}
        />
        
        <NewFooter />
      </div>
    </CartProvider>
  );
}

export default App;
