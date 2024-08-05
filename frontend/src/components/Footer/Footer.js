import React from "react";
import { useAuth } from "../../services/auth";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  // Define the inline styles
  const footerStyle = {
    backgroundColor: 'hotpink', // Background color
    padding: '10px 0', // Vertical padding
    textAlign: 'center', // Center text horizontally
  };

  const containerStyle = {
    maxWidth: '1200px', // Limit maximum width
    margin: '0 auto', // Center container
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p>
          PopHits.org by Asle
          {isAuthenticated && (
            <a href="mailto:contact@pophits.org"> - Contact</a>
          )}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
