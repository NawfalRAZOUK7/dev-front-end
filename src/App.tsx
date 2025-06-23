// -------------------------------------------------
// Projet   : razouk-nawfal-app
// Fichier  : App.tsx
// Auteur   : Nawfal Razouk
// Usage    : Layout principal avec Header/Footer, routing et composants communs
// -------------------------------------------------

import styles from './App.module.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import { Header } from './components/Common/Header';
import { Footer } from './components/Common/Footer';
import { ThemeSwitcher } from './components/Common/ThemeSwitcher';

export default function App() {
  // Définition de la navigation pour le Header (générique)
  const navItems = [
    { label: 'Accueil', to: '/' },
    { label: 'À propos', to: '/about' },
    { label: 'Connexion', to: '/login' }
  ];

  return (
    <Router>
      {/* Header toujours visible, navItems paramétrés */}
      <Header
        logo={<span>🚀 Razouk Nawfal</span>}
        navItems={navItems}
        rightSection={<ThemeSwitcher />}
      />

      {/* Contenu central routé */}
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {/* Footer générique */}
      <Footer>
        © 2025 Razouk Nawfal | Tous droits réservés
      </Footer>
    </Router>
  );
}
