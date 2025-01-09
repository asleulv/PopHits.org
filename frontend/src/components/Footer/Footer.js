import React from "react";
import { useAuth } from "../../services/auth";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="footer">
      <p>
        PopHits.org by Asle
        {isAuthenticated && (
          <a href="mailto:contact@pophits.org">📧 Contact</a>
        )}
      </p>
    </footer>
  );
};

export default Footer;
