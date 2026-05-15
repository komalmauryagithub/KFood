import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { contactAPI } from "../services/api";

const Contact = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Handle change with trim safety
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    // ✅ validation
    if (!trimmedData.name || !trimmedData.email || !trimmedData.message) {
      setError("Please fill all required fields");
      return;
    }

    if (!isValidEmail(trimmedData.email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await contactAPI.submitMessage(trimmedData);

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-hide success safely
  useEffect(() => {
    if (!submitted) return;

    const timer = setTimeout(() => {
      setSubmitted(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [submitted]);

  // ✅ Disable button condition
  const isDisabled =
    loading ||
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.message.trim();

  return (
    <div className="contact-page">
      <h1 className="page-title">Contact Us</h1>
      
      <div className="contact-form">

        {submitted && (
          <div className="success-message">
            ✅ Message sent successfully!
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              placeholder="Your message..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary submit-btn"
            disabled={isDisabled}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <h3>Other ways to reach us:</h3>
          <p>
            <strong>Email:</strong> info@kfood.com <br />
            <strong>Phone:</strong> +1 234 567 890 <br />
            <strong>Address:</strong> Korean Town
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;