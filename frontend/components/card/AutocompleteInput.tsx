import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { useAppContext } from "../../contexts/AppContext";

interface AutocompleteInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  fieldName?: string; // Add fieldName to determine suggestions
  suggestions?: any[]; // External suggestions from field metadata
  style?: any;
  keyboardType?: any;
  inputMode?: any;
  autoComplete?: any;
  multiline?: boolean;
  numberOfLines?: number;
  textAlignVertical?: any;
  hasError?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  color?: string;
  onSuggestionSelect?: (suggestion: any) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  fieldName,
  suggestions: externalSuggestions,
  style,
  keyboardType,
  inputMode,
  autoComplete,
  multiline,
  numberOfLines,
  textAlignVertical,
  hasError,
  borderColor,
  backgroundColor,
  color,
  onSuggestionSelect,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);

  const { data, dialogSettings } = useAppContext();

  // Determine suggestions based on field name and context
  const suggestions = useMemo(() => {
    // Use external suggestions if provided, otherwise fall back to internal logic
    if (externalSuggestions && externalSuggestions.length > 0) {
      return externalSuggestions;
    }

    if (
      fieldName === "name" &&
      dialogSettings.cardList?.collection === "exercises"
    ) {
      return data?.uniqueExercises || [];
    }

    return [];
  }, [
    externalSuggestions,
    fieldName,
    dialogSettings.cardList?.collection,
    data?.uniqueExercises,
  ]);

  const handleTextChange = (text: string) => {
    onChangeText(text);

    if (suggestions.length > 0 && text.length > 0) {
      const filtered = suggestions.filter(suggestion => {
        return suggestion.name.toLowerCase().includes(text.toLowerCase());
      });

      setFilteredSuggestions(filtered);
      setShowSuggestions(
        filtered.length > 0 &&
          filtered[0].name.toLowerCase() !== text.toLowerCase()
      );
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: any) => {
    onChangeText(suggestion.name);
    setShowSuggestions(false);

    if (onSuggestionSelect && typeof suggestion === "object") {
      onSuggestionSelect(suggestion);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          style,
          {
            backgroundColor,
            borderColor: hasError ? "#FF3B30" : borderColor,
            color,
          },
        ]}
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType={keyboardType}
        inputMode={inputMode}
        autoComplete={autoComplete}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={textAlignVertical}
        onFocus={() => {
          if (value.length > 0 && filteredSuggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
      />

      {(() => {
        return null;
      })()}

      {showSuggestions && (
        <View style={[styles.suggestionsContainer, { backgroundColor }]}>
          <FlatList
            data={filteredSuggestions.slice(0, 5)}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.suggestionItem,
                  { borderBottomColor: borderColor },
                ]}
                onPress={() => selectSuggestion(item)}
              >
                <Text style={[styles.suggestionText, { color }]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    maxHeight: 150,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    zIndex: 999,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  suggestionText: {
    fontSize: 16,
  },
});

export default AutocompleteInput;
