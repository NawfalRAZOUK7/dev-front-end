// -------------------------------------------------
// Projet   : razouk-nawfal-app
// Fichier  : main.tsx
// Auteur   : Nawfal Razouk
// Usage    : Point d’entrée app, MantineProvider, styles globaux
// -------------------------------------------------

import './styles/reset.css';  // Reset général navigateur
import './styles/main.css';   // Styles globaux personnalisés

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

// Point d’entrée de l’application React
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Script Mantine pour gestion dark/light automatique */}
    <ColorSchemeScript defaultColorScheme="light" />
    <MantineProvider defaultColorScheme="light">
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
