export const theme = {
  colors: {
    // Background colors
    primary: '#F3F3F8',
    secondary: '#FFFFFF',
    tertiary: '#FAFAFA',
    cardCompleted: '#F8F9FA',
    
    // Accent colors
    accent: '#5E5CE6',
    accentLight: '#E8E7FF',
    
    // Text colors
    text: '#1C1C1E',
    textSecondary: '#6D6D72',
    textMuted: '#8E8E93',
    textDisabled: '#C7C7CC',
    
    // UI colors
    border: '#E5E5EA',
    borderLight: '#F2F2F7',
    modalBackground: '#FFFFFF',
    modalSecondary: '#F8F9FA',
    buttonPrimary: '#5E5CE6',
    
    // Status colors
    error: '#FF3B30',
    warning: '#FF9500',
    success: '#34C759',
    
    // Icon backgrounds (subtle, colorful)
    iconBackgrounds: {
      blue: '#E3F2FD',
      purple: '#F3E5F5',
      green: '#E8F5E9',
      orange: '#FFF3E0',
      red: '#FFEBEE',
      teal: '#E0F2F1',
      indigo: '#E8EAF6',
      pink: '#FCE4EC',
    },
    
    // Icon colors
    iconColors: {
      blue: '#2196F3',
      purple: '#9C27B0',
      green: '#4CAF50',
      orange: '#FF9800',
      red: '#F44336',
      teal: '#009688',
      indigo: '#3F51B5',
      pink: '#E91E63',
    },
    
    // Section-specific theme colors
    sections: {
      routines: {
        icon: '#FF9800',
        iconBackground: '#FFF3E0',
        accent: '#FF9800',
      },
      exercises: {
        icon: '#4CAF50',
        iconBackground: '#E8F5E9',
        accent: '#4CAF50',
      },
      meals: {
        icon: '#F44336',
        iconBackground: '#FFEBEE',
        accent: '#F44336',
      },
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 999,
  },
  
  typography: {
    sizes: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 17,
      xl: 20,
      xxl: 24,
      xxxl: 28,
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
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    cardHover: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    fab: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
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
    backgroundColor: theme.colors.secondary,
    elevation: 0,
  },
  
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.card,
  },
  
  modalContainer: {
    backgroundColor: theme.colors.modalBackground,
    borderTopLeftRadius: theme.borderRadius.xxl,
    borderTopRightRadius: theme.borderRadius.xxl,
  },
} as const;