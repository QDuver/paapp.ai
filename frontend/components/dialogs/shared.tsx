import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, Switch, HelperText } from "react-native-paper";
import { theme, commonStyles } from "../../styles/theme";
import { IFieldMetadata } from "../../models/Abstracts";
import AutocompleteInput from "../cards/AutocompleteInput";
import { DataType } from "../../contexts/AppContext";

export interface SharedDialogStyles {
  modalContainer: any;
  keyboardView: any;
  titleContainer: any;
  titleAccent: any;
  title: any;
  formContainer: any;
  fieldContainer: any;
  toggleContainer: any;
  fieldLabel: any;
  textInput: any;
  multilineInput: any;
  errorText: any;
  actionContainer: any;
  actionRow: any;
  rightActions: any;
}

export const sharedDialogStyles = StyleSheet.create({
  modalContainer: {
    ...commonStyles.modalContainer,
    margin: theme.spacing.lg,
    maxHeight: "90%",
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
    borderRadius: theme.borderRadius.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  keyboardView: {
    maxHeight: "100%",
  },
  titleContainer: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xxl,
    paddingBottom: theme.spacing.md,
  },
  titleAccent: {
    width: 32,
    height: 3,
    borderRadius: theme.borderRadius.xs,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text,
  },
  formContainer: {
    flexShrink: 1,
    padding: theme.spacing.xxl,
    paddingTop: theme.spacing.md,
  },
  fieldContainer: {
    marginBottom: theme.spacing.lg,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.xs,
  },
  fieldLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
  },
  textInput: {
    backgroundColor: theme.colors.modalSecondary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.sizes.md,
  },
  multilineInput: {
    minHeight: 80,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.sizes.sm,
  },
  actionContainer: {
    padding: theme.spacing.xxl,
    paddingTop: theme.spacing.md,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
});

export const getSectionColor = (collection?: string) => {
  if (collection === "routines") return theme.colors.sections.routines.accent;
  if (collection === "exercises") return theme.colors.sections.exercises.accent;
  if (collection === "meals") return theme.colors.sections.meals.accent;
  return theme.colors.buttonPrimary;
};

interface RenderFieldProps {
  fieldMetadata: IFieldMetadata;
  formData: { [key: string]: any };
  errors: { [key: string]: string | null };
  collection?: string;
  data?: DataType;
  onInputChange: (fieldName: string, value: string | boolean) => void;
  onSuggestionSelect?: (suggestion: any) => void;
}

export const renderField = ({ fieldMetadata, formData, errors, collection, data, onInputChange, onSuggestionSelect }: RenderFieldProps) => {
  const { field: fieldName, label: fieldLabel, type: fieldType, keyboardType, multiline, suggestions } = fieldMetadata;
  const sectionColor = getSectionColor(collection);
  console.log('data:', data);

  const value = formData[fieldName];
  const displayValue = value === null || value === undefined ? "" : value.toString();
  const hasError = !!errors[fieldName];
  const isMultiline = multiline || false;
  const hasSuggestions = suggestions && suggestions.length > 0;

  if (fieldType === "boolean") {
    return (
      <View key={fieldName} style={sharedDialogStyles.fieldContainer}>
        <View style={sharedDialogStyles.toggleContainer}>
          <Text variant="bodyLarge" style={sharedDialogStyles.fieldLabel}>
            {fieldLabel}
          </Text>
          <Switch value={!!value} onValueChange={newValue => onInputChange(fieldName, newValue)} color={sectionColor} />
        </View>
        {hasError && (
          <Text variant="bodySmall" style={sharedDialogStyles.errorText}>
            {errors[fieldName]}
          </Text>
        )}
      </View>
    );
  }

  const shouldUseAutocomplete = (hasSuggestions && !isMultiline) || (fieldName === "name" && !isMultiline);
  console.log('collection:', data, 'shouldUseAutocomplete:', shouldUseAutocomplete);

  return (
    <View key={fieldName} testID="form-field" style={sharedDialogStyles.fieldContainer}>
      {shouldUseAutocomplete ? (
        <>
          <Text variant="bodyLarge" style={sharedDialogStyles.fieldLabel}>
            {fieldLabel}
          </Text>
          <AutocompleteInput
            value={displayValue}
            onChangeText={text => onInputChange(fieldName, text)}
            placeholder={fieldMetadata.placeholder || fieldLabel}
            suggestions={suggestions}
            collection={collection}
            data={data}
            textStyle={sharedDialogStyles.textInput}
            hasError={hasError}
            onSuggestionSelect={onSuggestionSelect}
            fieldName={fieldName}
          />
          {hasError && (
            <HelperText type="error" visible={hasError}>
              {errors[fieldName]}
            </HelperText>
          )}
        </>
      ) : (
        <>
          <TextInput
            testID="form-input"
            mode="outlined"
            label={fieldLabel}
            style={[sharedDialogStyles.textInput, isMultiline && sharedDialogStyles.multilineInput]}
            contentStyle={{ fontFamily: theme.typography.fontFamily.regular }}
            value={displayValue}
            onChangeText={text => onInputChange(fieldName, text)}
            placeholder={fieldMetadata.placeholder}
            placeholderTextColor={theme.colors.textMuted}
            keyboardType={keyboardType || "default"}
            inputMode={fieldType === "number" ? "numeric" : "text"}
            autoComplete={fieldType === "number" ? "off" : undefined}
            multiline={isMultiline}
            numberOfLines={isMultiline ? 3 : 1}
            error={hasError}
            outlineColor={theme.colors.border}
            activeOutlineColor={sectionColor}
          />
          {hasError && (
            <HelperText type="error" visible={hasError}>
              {errors[fieldName]}
            </HelperText>
          )}
        </>
      )}
    </View>
  );
};
