import React from "react";
import { useAuth } from "../../services/auth";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="footer">
      <div className="container">
        <p>PopHits.org by Asle 
        {isAuthenticated && (
          <a href="mailto:contact@pophits.org"> - Contact</a>
        )}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
