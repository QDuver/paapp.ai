export const theme = {
  colors: {
    // Background colors
    primary: '#F5F5F5',
    secondary: '#FFFFFF',
    tertiary: '#FAFAFA',
    
    // Accent colors
    accent: '#6200EE',
    
    // Text colors
    text: '#202124',
    textSecondary: '#5F6368',
    textMuted: '#80868B',
    
    // UI colors
    border: '#DADCE0',
    modalBackground: '#FFFFFF',
    modalSecondary: '#F8F9FA',
    buttonPrimary: '#1A73E8',
    
    // Status colors
    error: '#D93025',
    warning: '#F9AB00',
    success: '#1E8E3E',
    
    // Icon backgrounds (subtle, colorful)
    iconBackgrounds: {
      blue: '#E8F0FE',
      purple: '#F3E8FD',
      green: '#E6F4EA',
      orange: '#FEF7E0',
      red: '#FCE8E6',
    },
    
    // Icon colors
    iconColors: {
      blue: '#1967D2',
      purple: '#8E24AA',
      green: '#1E8E3E',
      orange: '#F9AB00',
      red: '#D93025',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 32,
  },
  
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
  },
  
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 22,
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
  },
} as const;

// Common style mixins
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  
  appBar: {
    backgroundColor: theme.colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    elevation: 0,
  },
  
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.card,
  },
  
  modalContainer: {
    backgroundColor: theme.colors.modalBackground,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
  },
} as const;