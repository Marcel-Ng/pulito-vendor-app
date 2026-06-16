// components/shared/searchable-dropdown.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  value: string;
  placeholder?: string;
  options: string[];
  onSelect: (v: string) => void;
};

export function SearchableDropdown({
  value,
  placeholder = "Search...",
  options,
  onSelect,
}: Props) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase()),
  );

  const showDropdown = open && filtered.length > 0;

  const openDropdown = () => {
    setOpen(true);
    Animated.timing(dropdownAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const closeDropdown = () => {
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  };

  const handleSelect = (item: string) => {
    onSelect(item);
    setQuery(item);
    closeDropdown();
  };

  const handleChange = (text: string) => {
    setQuery(text);
    onSelect(""); // clear selection when typing
    if (!open) openDropdown();
  };

  const handleClear = () => {
    setQuery("");
    onSelect("");
    openDropdown();
  };

  return (
    <View>
      {/* Input */}
      <View style={[styles.inputRow, open && styles.inputRowOpen]}>
        <Ionicons
          name="search-outline"
          size={18}
          color="#AAAAAA"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleChange}
          onFocus={openDropdown}
          placeholder={placeholder}
          placeholderTextColor="#AAAAAA"
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color="#CCCCCC" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => (open ? closeDropdown() : openDropdown())}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginLeft: 6 }}
        >
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={18}
            color="#AAAAAA"
          />
        </TouchableOpacity>
      </View>

      {/* Dropdown */}
      {showDropdown && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              opacity: dropdownAnim,
              transform: [
                {
                  translateY: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-6, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <ScrollView
            style={{ maxHeight: 220 }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.option,
                    value === item && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === item && styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {value === item && (
                    <Ionicons name="checkmark" size={16} color="#3B6B44" />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No results for "{query}"</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: "#FAFAFA",
  },
  inputRowOpen: {
    borderColor: "#3B6B44",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#222222",
    padding: 0,
  },
  dropdown: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#3B6B44",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#fff",
    zIndex: 99,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  optionSelected: {
    backgroundColor: "#f0f7f2",
  },
  optionText: {
    fontSize: 15,
    color: "#222222",
  },
  optionTextSelected: {
    color: "#3B6B44",
    fontWeight: "600",
  },
  emptyRow: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#AAAAAA",
  },
});
