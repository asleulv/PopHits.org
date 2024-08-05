import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Cookie Policy</h1>
      <p className="mb-4">
        This website uses cookies to enhance your experience while navigating through the website. Cookies help us analyze the performance and functionality of our website, provide personalized content, and ensure the best possible user experience.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">What Are Cookies?</h2>
      <p className="mb-4">
        Cookies are small text files that are stored on your device when you visit a website. They help the website recognize your device and remember your preferences or actions over time.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Cookies</h2>
      <p className="mb-4">
        We use cookies to improve the functionality of our website, analyze user behavior, and provide personalized content. Cookies also help us understand how visitors interact with our website, so we can make improvements.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Your Choices</h2>
      <p className="mb-4">
        You can manage your cookie preferences through your browser settings. You can choose to disable cookies or delete existing cookies. However, please note that disabling cookies may affect the functionality of our website.
      </p>
    </div>
  );
};

export default CookiePolicy;
