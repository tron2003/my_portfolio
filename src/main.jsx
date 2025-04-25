import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://e6d8be48ff24ad4030356f0c10e098b4@o4509211627880448.ingest.us.sentry.io/4509211628732416",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.feedbackIntegration({
      colorScheme: "system",
      isNameRequired: true,
      isEmailRequired: true,
    }),
  ],
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
