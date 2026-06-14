

// LandingPage.jsx - Professional with Floating Bubbles Animation
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaGithub, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./LandingPage.css";

const LandingPage = () => {
  const heroRef = useRef(null);

  // Create floating bubbles effect
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const bubbles = [];
    const bubbleCount = 12;

    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement("div");
      bubble.className = "bubble";
      const size = Math.random() * 100 + 50;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.top = `${Math.random() * 100}%`;
      bubble.style.animation = `float ${Math.random() * 10 + 8}s ease-in-out infinite`;
      bubble.style.animationDelay = `${Math.random() * 5}s`;
      hero.appendChild(bubble);
      bubbles.push(bubble);
    }

    // Add keyframes dynamically
    const style = document.createElement("style");
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
        50% { transform: translateY(-30px) translateX(20px); opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      bubbles.forEach(bubble => bubble.remove());
      style.remove();
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">Chatify</div>
        <div className="right-nav">
          <ul className="nav-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}>Home</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>Features</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection("about"); }}>About</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}>Contact</a></li>
          </ul>
          <Link to="/login" className="btn-login">
            Login
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero" id="home" ref={heroRef}>
        <div className="hero-content">
          <h1>Welcome to Chatify</h1>
          <p>
            Connect with your friends and team instantly.
            Real-time messaging, group chats, and secure communication — all in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <a href="#features" className="btn-secondary" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>Learn More</a>
          </div>
          
          {/* Stats */}
          <div className="stats">
            <div className="stat-item">
              <div className="stat-number"></div>
              <div className="stat-label"></div>
            </div>
            <div className="stat-item">
              <div className="stat-number"></div>
              <div className="stat-label"></div>
            </div>
            <div className="stat-item">
              <div className="stat-number"></div>
              <div className="stat-label"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features" id="features">
        <h2>Powerful Features</h2>
        <p className="section-subtitle">Everything you need for seamless communication</p>
        <div className="features-container">
          <div className="feature-box">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Messaging</h3>
            <p>Instant communication with WebSocket technology. Messages delivered in real-time with zero lag.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🔐</div>
            <h3>Secure Authentication</h3>
            <p>Enterprise-grade security with JWT tokens and encrypted password storage.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">👥</div>
            <h3>Group Chats</h3>
            <p>Create group conversations, add members, and manage teams effortlessly.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">📱</div>
            <h3>Fully Responsive</h3>
            <p>Seamless experience across desktop, tablet, and mobile devices.</p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about" id="about">
        <h2>About Chatify</h2>
        <p className="about-text">
          Chatify is a modern full-stack chat application built with the MERN stack (MongoDB, Express.js, React, Node.js).
          It leverages Socket.IO for real-time communication, providing users with instant messaging capabilities,
          group chat functionality, and secure authentication. The platform is designed with performance,
          scalability, and user experience in mind, making it perfect for both personal and team communication.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact" id="contact">
        <h2>Connect With Us</h2>
        <p className="section-subtitle">Follow us on social media for updates and support</p>
        <div className="social-icons">
          <a href="mailto:support@chatify.com" target="_blank" rel="noreferrer">
            <MdEmail />
          </a>
          <a href="https://www.linkedin.com/in/yash-ulekar-4519a4371/" target="_blank" rel="noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FaTwitter />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <FaGithub />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>&copy; {new Date().getFullYear()} Chatify. All rights reserved. | Built with ❤️ using MERN Stack</p>
      </footer>
    </div>
  );
};

export default LandingPage;