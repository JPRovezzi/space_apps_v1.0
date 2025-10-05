// Colores del proyecto SpaceApps
export const COLORS = {
  // Colores principales
  primary: "#0960e1", // Azul principal del sitio
  primaryDark: "#0747a6", // Azul más oscuro para hover
  primaryLight: "#4a90e2", // Azul más claro

  // Gradientes
  gradientPrimary:
    "linear-gradient(135deg, #0960e1 0%, #4a90e2 50%, #7bb3ff 100%)",
  gradientSecondary:
    "linear-gradient(135deg, #0747a6 0%, #0960e1 50%, #4a90e2 100%)",

  // Colores de texto y fondos
  textPrimary: "#ffffff",
  textSecondary: "#f8f9fa",
  textMuted: "rgba(255, 255, 255, 0.7)",

  // Colores de interfaz
  backgroundOverlay: "rgba(255, 255, 255, 0.1)",
  backgroundOverlayHover: "rgba(255, 255, 255, 0.2)",
  borderPrimary: "rgba(255, 255, 255, 0.2)",
  borderSecondary: "rgba(255, 255, 255, 0.3)",

  // Colores de estados
  success: "#28a745",
  warning: "#ffc107",
  error: "#dc3545",
  info: "#17a2b8",

  // Sombras
  shadowLight: "rgba(0, 0, 0, 0.1)",
  shadowMedium: "rgba(0, 0, 0, 0.2)",
  shadowHeavy: "rgba(0, 0, 0, 0.3)",
};

// Tema completo
export const THEME = {
  colors: COLORS,

  // Breakpoints
  breakpoints: {
    mobile: "768px",
    tablet: "1024px",
    desktop: "1200px",
  },

  // Espaciado
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },

  // Bordes
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "50px",
  },

  // Fuentes
  fontSize: {
    xs: "0.8rem",
    sm: "0.9rem",
    md: "1rem",
    lg: "1.2rem",
    xl: "1.5rem",
    xxl: "2rem",
    xxxl: "4rem",
  },

  // Transiciones
  transition: {
    fast: "0.2s ease",
    normal: "0.3s ease",
    slow: "0.5s ease",
  },
};

export default COLORS;
