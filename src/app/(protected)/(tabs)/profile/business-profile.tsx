import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useVendor } from "@/src/lib/context/vendor-context";
import { BusinessProfile } from "@/src/types/vendor.types";

type Field = keyof BusinessProfile;

export default function BusinessProfileScreen() {
  const router = useRouter();
  const { activeVendor, updateBusinessProfile } = useVendor();

  const [editingField, setEditingField] = useState<Field | null>(null);

  const [form, setForm] = useState<BusinessProfile>(
    activeVendor?.profile ?? ({} as BusinessProfile),
  );
  const handleEdit = (field: Field) => setEditingField(field);

  const handleSave = () => {
    updateBusinessProfile(form);
    setEditingField(null);
  };

  const fields: {
    key: Field;
    label: string;
    icon: string;
    isOutlined?: boolean;
  }[] = [
    { key: "businessName", label: "Business Name", icon: "pencil" },
    { key: "phone", label: "Phone Number", icon: "pencil" },
    {
      key: "address",
      label: "Address",
      icon: "location-outline",
      isOutlined: true,
    },
    { key: "about", label: "About", icon: "person", isOutlined: true },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Business Profile</Text>
      </View>

      {fields.map(({ key, label, icon, isOutlined }) => (
        <View key={key} style={styles.fieldGroup}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={form[key]}
              editable={editingField === key}
              onChangeText={(text) => setForm((f) => ({ ...f, [key]: text }))}
              onBlur={handleSave}
              autoFocus={editingField === key}
            />
            <TouchableOpacity
              style={[styles.iconBtn, isOutlined && styles.iconBtnOutline]}
              onPress={() =>
                editingField === key ? handleSave() : handleEdit(key)
              }
            >
              <Ionicons
                name={icon as any}
                size={16}
                color={isOutlined ? "#111" : "#fff"}
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 24, paddingTop: 60 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 12,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: "#fafafa",
  },
  input: { flex: 1, fontSize: 15, color: "#222", paddingVertical: 12 },
  iconBtn: {
    backgroundColor: "#F5C518",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  iconBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#ccc",
  },
});
