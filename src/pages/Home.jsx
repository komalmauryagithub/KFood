import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Try to seed products first if none exist
      try {
        await productAPI.seedProducts();
      } catch (err) {
        // Products already seeded, ignore error
      }
      const response = await productAPI.getProducts({ limit: 8 });
      setProducts(response.data.products);
    } catch (error) {
      setError('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Welcome to KFOOD</h1>
          <p className="hero-subtitle">
            Discover the authentic taste of Korean cuisine delivered to your doorstep
          </p>
          <Link to="/popular-foods" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section className="container">
        <h2 className="section-title">Our Featured Dishes</h2>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/popular-foods" className="btn btn-secondary">
            View All Products
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container" style={{ marginTop: '60px', marginBottom: '60px' }}>
        <h2 className="section-title">Browse by Category</h2>
        <div className="products-grid">
          <Link to="/drama-bites" className="product-card" style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#1d3557', marginBottom: '10px' }}>🍽️ Drama Bites</h3>
            <p style={{ color: '#6c757d' }}>Popular Korean dishes from your favorite dramas</p>
          </Link>
          <Link to="/popular-foods" className="product-card" style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#1d3557', marginBottom: '10px' }}>⭐ Popular Foods</h3>
            <p style={{ color: '#6c757d' }}>Most loved Korean delicacies</p>
          </Link>
          <Link to="/idol-meals" className="product-card" style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#1d3557', marginBottom: '10px' }}>🎤 Idol Meals</h3>
            <p style={{ color: '#6c757d' }}>Special meals for K-pop fans</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
