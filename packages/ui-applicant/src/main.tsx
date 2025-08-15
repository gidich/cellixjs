import { HelmetProvider } from '@dr.pogodin/react-helmet';
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "react-oidc-context";
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx';
import { oidcConfig } from './config/oidc-config.tsx';

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element #root not found')
}

createRoot(rootEl).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider {...oidcConfig}>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
