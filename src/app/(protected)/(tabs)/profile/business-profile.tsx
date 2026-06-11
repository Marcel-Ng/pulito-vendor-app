import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useVendor } from "@/src/lib/context/vendor-context";
import { vendorService } from "@/src/lib/services/vendor.service";
import { BusinessProfile } from "@/src/types/vendor.types";

type Field = keyof BusinessProfile;

export default function BusinessProfileScreen() {
  const router = useRouter();
  const { activeVendor, updateBusinessProfile } = useVendor();

  const [form, setForm] = useState<BusinessProfile>(
    activeVendor?.profile ?? ({} as BusinessProfile),
  );
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedOnce, setSavedOnce] = useState(false);

  const handleChange = (field: Field, text: string) => {
    setForm((f) => ({ ...f, [field]: text }));
    setIsDirty(true);
    setSavedOnce(false);
  };

  const handleSave = async () => {
    if (!activeVendor || !isDirty) return;
    setSaving(true);
    try {
      await vendorService.updateBusinessProfile(activeVendor.id, form);
      updateBusinessProfile(form);
      setIsDirty(false);
      setSavedOnce(true);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const fields: {
    key: Field;
    label: string;
    placeholder?: string;
    multiline?: boolean;
  }[] = [
    {
      key: "businessName",
      label: "Business Name",
      placeholder: "e.g. Kenechi Laundry",
    },
    { key: "phone", label: "Phone Number", placeholder: "e.g. 08012345678" },
    { key: "address", label: "Address", placeholder: "Enter business address" },
    {
      key: "about",
      label: "About",
      placeholder: "Tell customers about your business",
      multiline: true,
    },
  ];

  useEffect(() => {
    console.log("business profile effect ran");
    console.log("Active vendor profile updated:", activeVendor?.profile);
  }, [activeVendor?.profile]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>Business Profile</Text>
        </View>

        {/* Fields */}
        {fields.map(({ key, label, placeholder, multiline }) => (
          <View key={key} style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={[
                styles.input,
                multiline && styles.inputMultiline,
                isDirty && styles.inputDirty,
              ]}
              value={form[key]}
              onChangeText={(text) => handleChange(key, text)}
              placeholder={placeholder}
              placeholderTextColor="#bbb"
              multiline={multiline}
            />
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating CTA */}
      {(isDirty || savedOnce) && (
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={[styles.ctaBtn, isDirty && styles.ctaBtnActive]}
            onPress={handleSave}
            disabled={!isDirty || saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : savedOnce && !isDirty ? (
              <>
                <Ionicons name="checkmark" size={18} color="#fff" />
                <Text style={styles.ctaText}>Saved</Text>
              </>
            ) : (
              <Text style={styles.ctaText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
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
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#222",
    backgroundColor: "#fafafa",
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputDirty: {
    borderColor: "#3B6B44",
    backgroundColor: "#fff",
  },

  // Floating CTA
  ctaContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  ctaBtn: {
    backgroundColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  ctaBtnActive: { backgroundColor: "#3B6B44" },
  ctaText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});

// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import { useVendor } from "@/src/lib/context/vendor-context";
// import { BusinessProfile } from "@/src/types/vendor.types";

// type Field = keyof BusinessProfile;

// export default function BusinessProfileScreen() {
//   const router = useRouter();
//   const { activeVendor, updateBusinessProfile } = useVendor();

//   const [editingField, setEditingField] = useState<Field | null>(null);

//   const [form, setForm] = useState<BusinessProfile>(
//     activeVendor?.profile ?? ({} as BusinessProfile),
//   );
//   const handleEdit = (field: Field) => setEditingField(field);

//   const handleSave = () => {
//     updateBusinessProfile(form);
//     setEditingField(null);
//   };

//   const fields: {
//     key: Field;
//     label: string;
//     icon: string;
//     isOutlined?: boolean;
//   }[] = [
//     { key: "businessName", label: "Business Name", icon: "pencil" },
//     { key: "phone", label: "Phone Number", icon: "pencil" },
//     {
//       key: "address",
//       label: "Address",
//       icon: "location-outline",
//       isOutlined: true,
//     },
//     { key: "about", label: "About", icon: "person", isOutlined: true },
//   ];

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
//           <Ionicons name="arrow-back" size={22} color="#111" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Business Profile</Text>
//       </View>

//       {fields.map(({ key, label, icon, isOutlined }) => (
//         <View key={key} style={styles.fieldGroup}>
//           <Text style={styles.label}>{label}</Text>
//           <View style={styles.inputRow}>
//             <TextInput
//               style={styles.input}
//               value={form[key]}
//               editable={editingField === key}
//               onChangeText={(text) => setForm((f) => ({ ...f, [key]: text }))}
//               onBlur={handleSave}
//               autoFocus={editingField === key}
//             />
//             <TouchableOpacity
//               style={[styles.iconBtn, isOutlined && styles.iconBtnOutline]}
//               onPress={() =>
//                 editingField === key ? handleSave() : handleEdit(key)
//               }
//             >
//               <Ionicons
//                 name={icon as any}
//                 size={16}
//                 color={isOutlined ? "#111" : "#fff"}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   content: { padding: 24, paddingTop: 60 },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 32,
//     gap: 12,
//   },
//   backBtn: { padding: 4 },
//   title: { fontSize: 22, fontWeight: "700", color: "#111" },
//   fieldGroup: { marginBottom: 20 },
//   label: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 8 },
//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 4,
//     backgroundColor: "#fafafa",
//   },
//   input: { flex: 1, fontSize: 15, color: "#222", paddingVertical: 12 },
//   iconBtn: {
//     backgroundColor: "#F5C518",
//     borderRadius: 8,
//     padding: 8,
//     marginLeft: 8,
//   },
//   iconBtnOutline: {
//     backgroundColor: "transparent",
//     borderWidth: 1.5,
//     borderColor: "#ccc",
//   },
// });
