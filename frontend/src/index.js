import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './containers/App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './services/auth'; 
import './index.css'; 
import './global.css';
import './mobile.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
