// -------------------------------------------------
// Projet   : razouk-nawfal-app
// Fichier  : main.tsx
// Auteur   : Nawfal Razouk
// Usage    : Point d'entrée optimisé pour Todo List App
// -------------------------------------------------

import './styles/reset.css';  // Reset général navigateur
import './styles/main.css';   // Styles globaux personnalisés

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  MantineProvider,
  ColorSchemeScript,
  createTheme,
} from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

// Import des styles Mantine CSS (si nécessaire)
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// 🎨 Couleurs personnalisées pour la Todo App
const todoBlue: MantineColorsTuple = [
  '#e6f3ff',
  '#b3d9ff',
  '#80bfff',
  '#4da6ff',
  '#1a8cff',
  '#4A90E2', // Couleur principale
  '#3a7bc8',
  '#2a66ae',
  '#1a5194',
  '#0a3c7a'
];

const todoCyan: MantineColorsTuple = [
  '#e6fffe',
  '#b3fffc',
  '#80fffa',
  '#4dfff8',
  '#1afff6',
  '#50C9C3', // Couleur principale
  '#40a49f',
  '#307f7b',
  '#205a57',
  '#103533'
];

// 🚀 Configuration du thème Mantine optimisé pour l'application Todo
const theme = createTheme({
  // Couleurs principales
  primaryColor: 'todoBlue',

  // Palette de couleurs personnalisées
  colors: {
    todoBlue,
    todoCyan,
  },

  // Configuration de base
  defaultRadius: 'md',
  focusRing: 'auto',

  // Ombres améliorées pour les cards Todo
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },

  // Espacement cohérent
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    xxl: '3rem'     // 48px
  },

  // Configuration des composants pour la Todo App
  components: {
    // Boutons optimisés
    Button: {
      defaultProps: {
        radius: 'md'
      },
      styles: {
        root: {
          fontWeight: 600,
          transition: 'all 0.2s ease',
        }
      }
    },

    // ActionIcon pour les todos
    ActionIcon: {
      defaultProps: {
        radius: 'md'
      },
      styles: {
        root: {
          transition: 'all 0.2s ease',
        }
      }
    },

    // Cards pour les todos
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'md',
        padding: 'lg',
        withBorder: true
      },
      styles: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
          }
        }
      }
    },

    // Paper pour les containers
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm'
      }
    },

    // Container responsive
    Container: {
      defaultProps: {
        size: 'lg'
      }
    },

    // Stack pour l'espacement
    Stack: {
      defaultProps: {
        gap: 'md'
      }
    },

    // Group pour l'alignement
    Group: {
      defaultProps: {
        gap: 'md'
      }
    },

    // TextInput pour le formulaire Todo
    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'md'
      },
      styles: {
        input: {
          transition: 'all 0.2s ease',
          '&:focus': {
            transform: 'scale(1.01)'
          }
        }
      }
    },

    // Checkbox pour les todos
    Checkbox: {
      defaultProps: {
        radius: 'sm',
        size: 'md',
        color: 'green'
      },
      styles: {
        input: {
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        },
        label: {
          cursor: 'pointer'
        }
      }
    },

    // Modal pour les confirmations
    Modal: {
      defaultProps: {
        radius: 'md',
        shadow: 'xl',
        centered: true
      }
    },

    // Notifications
    Notification: {
      defaultProps: {
        radius: 'md'
      },
      styles: {
        root: {
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
      }
    },

    // Text pour la cohérence
    Text: {
      styles: {
        root: {
          lineHeight: 1.5
        }
      }
    },

    // Title pour les en-têtes
    Title: {
      styles: {
        root: {
          lineHeight: 1.2
        }
      }
    }
  },

  // Breakpoints responsive
  breakpoints: {
    xs: '30em',   // 480px
    sm: '48em',   // 768px
    md: '64em',   // 1024px
    lg: '74em',   // 1184px
    xl: '90em'    // 1440px
  },

  // Utilisez focusRing pour le comportement, supprimez focusRingStyles
  // focusRing: 'auto', // déjà défini ci-dessus
  // Pour des styles personnalisés, utilisez Global styles dans votre app si besoin
});

// Point d'entrée de l'application React
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Script Mantine pour gestion automatique du thème */}
    <ColorSchemeScript defaultColorScheme="light" />

    {/* Provider Mantine avec thème personnalisé Todo */}
    <MantineProvider theme={theme} defaultColorScheme="light">
      {/* Provider pour les notifications Todo */}
      <Notifications
        position="top-center"
        zIndex={1000}
        containerWidth={500}
        notificationMaxHeight={100}
      />

      {/* Application principale */}
      <App />

    </MantineProvider>
  </React.StrictMode>,
);