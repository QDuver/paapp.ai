import React, { useState, useMemo, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { TextInput as PaperTextInput, Portal } from "react-native-paper";
import { theme } from "../../styles/theme";

interface AutocompleteInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  fieldName?: string;
  suggestions?: any[];
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
  collection?: string;
  data?: any;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
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
  collection,
  data,
  onBlur,
  onSubmitEditing,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
  const [dropdownLayout, setDropdownLayout] = useState<{ top: number; left: number; width: number } | null>(null);
  const containerRef = useRef<View>(null);

  const suggestions = useMemo(() => {
    if (externalSuggestions && externalSuggestions.length > 0) {
      return externalSuggestions;
    }

    if (fieldName === "name" && collection && data?.[collection]?.uniques) {
      return data[collection].uniques;
    }

    return [];
  }, [externalSuggestions, fieldName, collection, data]);

  const measureLayout = () => {
    if (containerRef.current) {
      containerRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownLayout({
          top: pageY + height,
          left: pageX,
          width: width,
        });
      });
    }
  };

  const handleTextChange = (text: string) => {
    onChangeText(text);

    if (suggestions.length > 0 && text.length > 0) {
      const filtered = suggestions.filter(suggestion => {
        return suggestion.name.toLowerCase().includes(text.toLowerCase());
      });

      setFilteredSuggestions(filtered);
      const shouldShow = filtered.length > 0 && filtered[0].name.toLowerCase() !== text.toLowerCase();
      setShowSuggestions(shouldShow);
      if (shouldShow) {
        measureLayout();
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const resolvedBorderColor = hasError ? "#FF3B30" : borderColor || theme.colors.border;

  const selectSuggestion = (suggestion: any) => {
    onChangeText(suggestion.name);
    setShowSuggestions(false);

    if (onSuggestionSelect && typeof suggestion === "object") {
      onSuggestionSelect(suggestion);
    }
  };

  return (
    <>
      <View ref={containerRef} style={styles.container}>
        <PaperTextInput
          testID="autocomplete-input"
          mode="outlined"
          style={[style, { backgroundColor, color }]}
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
              measureLayout();
            }
          }}
          onBlur={() => {
            setShowSuggestions(false);
            onBlur?.();
          }}
          onSubmitEditing={onSubmitEditing}
          outlineColor={resolvedBorderColor}
          activeOutlineColor={resolvedBorderColor}
          dense
        />
      </View>

      {showSuggestions && dropdownLayout && (
        <Portal>
          <View
            style={[
              styles.suggestionsContainer,
              {
                backgroundColor,
                borderColor: borderColor,
                position: "absolute",
                top: dropdownLayout.top,
                left: dropdownLayout.left,
                width: dropdownLayout.width,
              },
            ]}
          >
            <FlatList
              data={filteredSuggestions.slice(0, 5)}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.suggestionItem, { borderBottomColor: borderColor }]} onPress={() => selectSuggestion(item)}>
                  <Text style={[styles.suggestionText, { color }]}>{item.name}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            />
          </View>
        </Portal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  suggestionsContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: theme.borderRadius.sm,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    zIndex: 99999,
    elevation: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  suggestionItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md - 2,
    borderBottomWidth: 0.5,
  },
  suggestionText: {
    fontSize: theme.typography.sizes.md,
  },
});

export default AutocompleteInput;
