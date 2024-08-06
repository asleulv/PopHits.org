import React from "react";
import { useAuth } from "../../services/auth";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  // Define the inline styles
  const footerStyle = {
    backgroundColor: '#BE2274', // Background color
    padding: '10px 0', // Vertical padding
    textAlign: 'center', // Center text horizontally
    color: 'white' // Text color
  };

  const containerStyle = {
    maxWidth: '1200px', // Limit maximum width
    margin: '0 auto', // Center container
  };

  const linkStyle = {
    color: '#ADD8E6' // Link color (light blue)
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p>
          PopHits.org by Asle
          {isAuthenticated && (
            <a href="mailto:contact@pophits.org" style={linkStyle}> - Contact</a>
          )}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
