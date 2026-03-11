import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About KFOOD</h3>
            <p>
              Your one-stop destination for authentic Korean food. 
              We bring the best of Korean cuisine right to your doorstep.
            </p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/drama-bites">Drama Bites</Link></li>
              <li><Link to="/popular-foods">Popular Foods</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Categories</h3>
            <ul>
              <li><Link to="/drama-bites">Drama Bites</Link></li>
              <li><Link to="/popular-foods">Popular Foods</Link></li>
              <li><Link to="/idol-meals">Idol Meals</Link></li>
              <li><Link to="/ai-cook">AI Cook</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul>
              <li>Email: info@kfood.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Address: 123 Korean Town, City</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} KFOOD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
