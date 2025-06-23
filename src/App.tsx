// -------------------------------------------------
// Projet   : razouk-nawfal-app
// Fichier  : App.tsx
// Auteur   : Nawfal Razouk
// Usage    : Layout principal avec Header/Footer, routing et Todo List
// -------------------------------------------------

import styles from './App.module.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TodoPage from './pages/TodoPage';
import Header from './components/Common/Header';
import { createNavItem, createHeaderAction } from './components/Common/Header';
// import ThemeSwitcher from './components/Common/ThemeSwitcher';
import { IconListCheck, IconSettings, IconHome } from '@tabler/icons-react';
import { Container, Stack, Text, Box } from '@mantine/core';

// Composant page d'accueil simple
const WelcomePage = () => (
  <div className={styles.pageTransition}>
    <Container size="md" py="xl">
      <Stack gap="xl" align="center">
        <IconHome size={64} color="var(--mantine-color-blue-6)" />
        <Text size="xl" fw={700} ta="center">
          Bienvenue dans Razouk Nawfal App
        </Text>
        <Text size="lg" c="dimmed" ta="center" style={{ maxWidth: 600 }}>
          Une application moderne de gestion de tâches. 
          Accédez à votre Todo List pour commencer à organiser vos projets.
        </Text>
        
        {/* Bouton d'accès rapide à la Todo List */}
        <Box
          component="a"
          href="/todos"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #4A90E2 0%, #50C9C3 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            transition: 'transform 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🚀 Accéder à la Todo List
        </Box>
      </Stack>
    </Container>
  </div>
);

export default function App() {
  // Configuration de la navigation
  const navigationItems = [
    createNavItem('home', 'Accueil', { 
      href: '/', 
      icon: <IconHome size={16} />,
      active: window.location.pathname === '/'
    }),
    createNavItem('todos', 'Todo List', { 
      href: '/todos', 
      icon: <IconListCheck size={16} />,
      active: window.location.pathname === '/todos'
    })
  ];

  // Actions du header
  const headerActions = [
    createHeaderAction(
      'settings',
      <IconSettings size={18} />,
      'Paramètres',
      () => console.log('Paramètres'),
      { variant: 'subtle', color: 'gray' }
    )
  ];

  return (
        <Router>
          <div className={styles.appContainer}>
            <main className={styles.mainContent}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      {/* Header and Footer only for WelcomePage */}
                      <Header
                        brand={{
                          name: 'Razouk Nawfal App',
                          logo: <span>🚀</span>,
                          onClick: () => window.location.href = '/'
                        }}
                        navigation={{
                          items: navigationItems,
                          buttonProps: {
                            variant: 'subtle',
                            size: 'sm'
                          }
                        }}
                        actions={headerActions}
                        layout={{
                          height: 64,
                          sticky: true,
                          withBorder: true,
                          withShadow: false,
                          containerSize: 'xl'
                        }}
                        style={{
                          variant: 'default'
                        }}
                        mobile={{
                          hideNavigation: false,
                          compactUser: true
                        }}
                        user={{
                          showThemeSwitcher: true,
                          themeSwitcherProps: {
                            variant: 'icon',
                            size: 'sm'
                          }
                        }}
                      />
                      <WelcomePage />
                      <footer className={styles.footer}>
                        <Container size="xl">
                          <Text size="sm" c="dimmed" ta="center">
                            © 2025 Razouk Nawfal | Tous droits réservés | 
                            <Text component="span" ml="xs" style={{ color: 'var(--mantine-color-blue-6)' }}>
                              Todo List App
                            </Text>
                          </Text>
                        </Container>
                      </footer>
                    </>
                  }
                />
                <Route path="/todos" element={<TodoPage />} />
                {/* Redirection par défaut vers l'accueil */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
  );
}