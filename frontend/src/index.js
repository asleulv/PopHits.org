import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './containers/App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './services/auth'; 
import './index.css'; 
import './global.css';
import './mobile.css';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-KWCKPJW0YJ'); 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();