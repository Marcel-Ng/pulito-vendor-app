// ─── Dropdown ─────────────────────────────────────────────────────────────────

import { GREEN, GREEN_LIGHT } from "@/constants/Colors";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function Dropdown({
  value,
  placeholder,
  options,
  onSelect,
}: {
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ zIndex: 20 }}>
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setOpen((p) => !p)}
        activeOpacity={0.8}
      >
        <Text style={value ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {value || placeholder}
        </Text>
        <Text style={styles.chevronSmall}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownList}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.dropdownOption,
                opt === value && styles.dropdownOptionSelected,
              ]}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownOptionText,
                  opt === value && { color: GREEN, fontWeight: "600" },
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  dropdownValue: { fontSize: 15, color: "#222222", fontWeight: "500" },
  dropdownPlaceholder: { fontSize: 15, color: "#AAAAAA" },
  chevronSmall: { fontSize: 11, color: "#888888" },
  dropdownList: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownOptionSelected: { backgroundColor: GREEN_LIGHT },
  dropdownOptionText: { fontSize: 15, color: "#333333" },
});
