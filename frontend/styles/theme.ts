export const palette = {
  color1: "#40F99B",
  color2: "#2E4052",
  color3: "#FFC857",
  color4: "#412234",
  color5: "#FCB0B3",
};

export const theme = {
  colors: {
    palette,

    // Background colors
    primary: "#FAFAFA",
    secondary: "#FFFFFF",
    tertiary: "#FAFAFA",
    cardCompleted: "#F8F9FA",

    // Accent colors
    accent: palette.color2,
    accentLight: `${palette.color3}40`,

    // Text colors
    text: "#1C1C1E",
    textSecondary: "#6D6D72",
    textMuted: "#8E8E93",
    textDisabled: "#C7C7CC",

    // UI colors
    border: "#E5E5EA",
    borderLight: "#F2F2F7",
    modalBackground: "#FFFFFF",
    modalSecondary: "#F8F9FA",
    buttonPrimary: palette.color3,

    // Status colors
    error: "#FF3B30",
    warning: palette.color1,
    success: palette.color4,

    // Icon backgrounds (subtle, colorful)
    iconBackgrounds: {
      blue: `${palette.color3}20`,
      purple: `${palette.color2}20`,
      green: `${palette.color4}20`,
      orange: `${palette.color1}20`,
      red: "#FFEBEE",
      teal: "#E0F2F1",
      indigo: `${palette.color2}30`,
      pink: "#FCE4EC",
    },

    // Icon colors
    iconColors: {
      blue: palette.color3,
      purple: palette.color2,
      green: palette.color4,
      orange: palette.color1,
      red: "#F44336",
      teal: "#009688",
      indigo: palette.color2,
      pink: "#E91E63",
    },

    // Section-specific theme colors
    sections: {
      routines: {
        icon: palette.color1,
        iconBackground: `${palette.color1}20`,
        accent: palette.color1,
      },
      exercises: {
        icon: palette.color4,
        iconBackground: `${palette.color4}20`,
        accent: palette.color4,
      },
      meals: {
        icon: "#F44336",
        iconBackground: "#FFEBEE",
        accent: "#F44336",
      },
      groceries: {
        icon: palette.color3,
        iconBackground: `${palette.color3}20`,
        accent: palette.color3,
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
    fontFamily: {
      light: "Poppins_300Light",
      regular: "Poppins_400Regular",
      medium: "Poppins_500Medium",
      semibold: "Poppins_600SemiBold",
      bold: "Poppins_700Bold",
    },
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
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  shadows: {
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    cardHover: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    fab: {
      shadowColor: "#000",
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

  // Default text style with Poppins
  text: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
  },

  // Default input style with Poppins
  input: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.sizes.md,
  },
} as const;

// Typography helper function
export const getTypography = (size: keyof typeof theme.typography.sizes, weight?: keyof typeof theme.typography.fontFamily) => {
  const fontFamily = weight ? theme.typography.fontFamily[weight] : theme.typography.fontFamily.regular;
  return {
    fontFamily,
    fontSize: theme.typography.sizes[size],
  };
};
