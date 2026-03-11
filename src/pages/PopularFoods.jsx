import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const PopularFoods = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts({ category: 'Popular Foods' });
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
      {/* Category Header */}
      <div className="category-header">
        <div className="container">
          <h1 className="category-title">Popular Foods</h1>
          <p className="category-description">
            The most beloved Korean dishes that everyone craves
          </p>
        </div>
      </div>

      {/* Products Section */}
      <section className="container">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : products.length === 0 ? (
          <div className="wishlist-empty">
            <h2>No products found</h2>
            <p>Check back later for new dishes!</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PopularFoods;
