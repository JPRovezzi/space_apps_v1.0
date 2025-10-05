// Colores oficiales del proyecto NASA Space Apps
// Siguiendo las especificaciones de agents.md
export const COLORS = {
  // Paleta principal - NASA Space Apps
  electricBlue: "#0042A6", // Azul eléctrico principal
  deepBlue: "#07173F", // Azul profundo para fondos
  neonYellow: "#eafe07", // Amarillo neón - solo acento (60-30-10 rule)
  white: "#FFFFFF", // Blanco puro
  neonBlue: "#0960E1", // Azul neón
  blueYonder: "#2E96F5", // Azul cielo
  rocketRed: "#E43700", // Rojo cohete
  martianRed: "#8E1100", // Rojo marciano

  // Gradientes oficiales
  // Gradiente principal 45° - Electric Blue hacia Deep Blue
  gradientPrimary: "linear-gradient(45deg, #0042A6 0%, #07173F 100%)",
  // Gradiente de fondo completo (transición suave)
  gradientBackground: "linear-gradient(45deg, #0042A6 0%, #07173F 100%)",
  // Gradiente secundario con Neon Blue
  gradientSecondary:
    "linear-gradient(45deg, #0042A6 0%, #0960E1 50%, #07173F 100%)",
  // Gradiente para headers/componentes pequeños
  gradientAccent: "linear-gradient(45deg, #0960E1 0%, #2E96F5 100%)",

  // Aplicación de la regla 60-30-10 para Neon Yellow (solo acento)
  accentPrimary: "#eafe07", // 60% - elemento principal de acento
  accentSecondary: "#eafe07", // 30% - elementos secundarios
  accentMinimal: "rgba(234, 254, 7, 0.1)", // 10% - toques mínimos

  // Aliases para compatibilidad
  primary: "#0042A6", // Electric Blue como principal
  primaryDark: "#07173F", // Deep Blue como oscuro
  primaryLight: "#0960E1", // Neon Blue como claro

  // Colores de texto y fondos (optimizados para fondos azules)
  textPrimary: "#FFFFFF", // Blanco puro sobre azules profundos
  textSecondary: "#f8f9fa",
  textMuted: "rgba(255, 255, 255, 0.7)",
  textOnDark: "#FFFFFF", // Texto sobre Deep Blue
  textOnPrimary: "#FFFFFF", // Texto sobre Electric Blue

  // Colores de interfaz
  backgroundOverlay: "rgba(255, 255, 255, 0.1)",
  backgroundOverlayHover: "rgba(255, 255, 255, 0.2)",
  borderPrimary: "rgba(255, 255, 255, 0.2)",
  borderSecondary: "rgba(255, 255, 255, 0.3)",

  // Colores de estados (usando paleta oficial)
  success: "#2E96F5", // Blue Yonder para éxito
  warning: "#eafe07", // Neon Yellow para advertencias (acento)
  error: "#E43700", // Rocket RED para errores
  danger: "#8E1100", // Martian Red para peligro extremo
  info: "#0960E1", // Neon Blue para información

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
