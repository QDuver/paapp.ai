import React, { useState, useMemo, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { TextInput as PaperTextInput, Portal } from "react-native-paper";
import { theme } from "../../styles/theme";

interface AutocompleteInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  fieldName?: string;
  suggestions?: any[];
  textStyle?: any;
  hasError?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  onSuggestionSelect?: (suggestion: any) => void;
  collection?: string;
  data?: any;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChangeText,
  placeholder,
  fieldName,
  suggestions: externalSuggestions,
  textStyle,
  hasError,
  borderColor = theme.colors.border,
  backgroundColor = theme.colors.modalSecondary,
  onSuggestionSelect,
  collection,
  data,
  onBlur,
  onSubmitEditing,
  autoFocus,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
  const [dropdownLayout, setDropdownLayout] = useState<{ top: number; left: number; width: number } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<View>(null);
  const isSelectingRef = useRef(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      setSelectedIndex(-1);
      const shouldShow = filtered.length > 0 && filtered[0].name.toLowerCase() !== text.toLowerCase();
      setShowSuggestions(shouldShow);
      if (shouldShow) {
        measureLayout();
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    const key = e.nativeEvent.key;

    if (key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredSuggestions.slice(0, 5).length);
    } else if (key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => {
        if (prev <= 0) return filteredSuggestions.slice(0, 5).length - 1;
        return prev - 1;
      });
    } else if (key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selected = filteredSuggestions.slice(0, 5)[selectedIndex];
      if (selected) {
        selectSuggestion(selected);
      }
    }
  };

  const resolvedBorderColor = hasError ? "#FF3B30" : borderColor || theme.colors.border;

  const selectSuggestion = (suggestion: any) => {
    isSelectingRef.current = true;

    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    onChangeText(suggestion.name);
    setShowSuggestions(false);

    if (onSuggestionSelect && typeof suggestion === "object") {
      onSuggestionSelect(suggestion);
    }

    setTimeout(() => {
      isSelectingRef.current = false;
    }, 0);
  };

  return (
    <>
      <View ref={containerRef} style={styles.container}>
        <PaperTextInput
          testID="autocomplete-input"
          mode="flat"
          style={[textStyle, { backgroundColor, color: theme.colors.text }]}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="default"
          inputMode="text"
          autoComplete="off"
          autoFocus={autoFocus}
          onKeyPress={handleKeyPress}
          onFocus={() => {
            if (value.length > 0 && filteredSuggestions.length > 0) {
              setShowSuggestions(true);
              measureLayout();
            }
          }}
          onBlur={() => {
            if (blurTimeoutRef.current) {
              clearTimeout(blurTimeoutRef.current);
            }

            blurTimeoutRef.current = setTimeout(() => {
              if (!isSelectingRef.current) {
                setShowSuggestions(false);
                onBlur?.();
              }
              blurTimeoutRef.current = null;
            }, 150);
          }}
          onSubmitEditing={onSubmitEditing}
          underlineColor={resolvedBorderColor}
          activeUnderlineColor={resolvedBorderColor}
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
              renderItem={({ item, index }) => {
                const isSelected = index === selectedIndex;
                return (
                  <TouchableOpacity
                    style={[
                      styles.suggestionItem,
                      { borderBottomColor: borderColor },
                      isSelected && { backgroundColor: borderColor + "20" },
                    ]}
                    onPress={() => selectSuggestion(item)}
                  >
                    <Text style={[styles.suggestionText, { color: theme.colors.text }, isSelected && { fontWeight: "600" }]}>{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
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
