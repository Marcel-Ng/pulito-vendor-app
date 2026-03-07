// ─── Bottom Sheet ─────────────────────────────────────────────────────────────

import { GREEN } from "@/constants/Colors";
import { ModalMode, ServiceItem } from "@/src/types/service.types";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dropdown } from "./drop-down";

const SERVICE_CATEGORIES = [
  "Wash & Iron",
  "Dry Clean",
  "Iron Only",
  "Wash Only",
  "Steam Press",
  "Stain Removal",
];

export function ItemBottomSheet({
  visible,
  mode,
  initialData,
  defaultCategory,
  onClose,
  onSubmit,
  onReject,
}: {
  visible: boolean;
  mode: ModalMode;
  initialData?: ServiceItem;
  defaultCategory?: string;
  onClose: () => void;
  onSubmit: (data: Omit<ServiceItem, "id">) => void;
  onReject?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (visible) {
      setCategory(initialData?.category ?? defaultCategory ?? "");
      setName(initialData?.name ?? "");
      setAmount(initialData?.amount ?? "");
    }
  }, [visible, initialData, defaultCategory]);

  const isCreate = mode === "create";
  const canSubmit = category && name && amount;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayBg} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {isCreate ? "Create New Item" : "Edit Item"}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Service Category</Text>
              <Dropdown
                value={category}
                placeholder="Select Service"
                options={SERVICE_CATEGORIES}
                onSelect={setCategory}
              />

              <Text style={[styles.label, { marginTop: 20 }]}>Item Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Item Name"
                placeholderTextColor="#AAAAAA"
                value={name}
                onChangeText={setName}
              />

              <Text style={[styles.label, { marginTop: 20 }]}>Item Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Amount"
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              {isCreate ? (
                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    { marginTop: 28 },
                    !canSubmit && { opacity: 0.5 },
                  ]}
                  onPress={() =>
                    canSubmit && onSubmit({ category, name, amount })
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>Create</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.editActions}>
                  <TouchableOpacity onPress={onReject}>
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.primaryBtn,
                      { flex: 1, marginLeft: 16 },
                      !canSubmit && { opacity: 0.5 },
                    ]}
                    onPress={() =>
                      canSubmit && onSubmit({ category, name, amount })
                    }
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryBtnText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={{ height: 36 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "90%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDDDDD",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  sheetTitle: { fontSize: 20, fontWeight: "700", color: "#111111" },
  closeIcon: { fontSize: 18, color: "#777777" },
  label: { fontSize: 13, color: "#888888", fontWeight: "500", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#222222",
    backgroundColor: "#FAFAFA",
  },

  primaryBtn: {
    backgroundColor: GREEN,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  editActions: { flexDirection: "row", alignItems: "center", marginTop: 28 },
  rejectText: {
    color: "#CC3333",
    fontSize: 15,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
