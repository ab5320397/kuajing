import React from 'react';
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Toaster } from 'sonner';
import { LanguageProvider } from "./contexts/LanguageContext.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
        <Toaster position="top-right" />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
  );

  // 确保在非开发环境下使用相对路径

