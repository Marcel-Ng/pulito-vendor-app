import { CategoriesList, CategoryItemsScreen } from "@/src/component/services";
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
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceItem {
  id: string;
  category: string;
  name: string;
  amount: string;
}

type ModalMode = "create" | "edit" | null;
type Screen = "categories" | "items";

// ─── Constants ────────────────────────────────────────────────────────────────

const GREEN = "#3B5E3A";
const GREEN_LIGHT = "#EDF3EC";

const SERVICE_CATEGORIES = [
  "Wash & Iron",
  "Dry Clean",
  "Iron Only",
  "Wash Only",
  "Steam Press",
  "Stain Removal",
];

const INITIAL_ITEMS: ServiceItem[] = [
  { id: "1", category: "Wash & Iron", name: "Shirts", amount: "400" },
  { id: "2", category: "Wash & Iron", name: "Trousers", amount: "450" },
  { id: "3", category: "Wash & Iron", name: "T-Shirts", amount: "300" },
  { id: "4", category: "Wash & Iron", name: "Dresses", amount: "500" },
  { id: "5", category: "Dry Clean", name: "Shirts", amount: "700" },
  { id: "6", category: "Dry Clean", name: "Trousers", amount: "800" },
  { id: "7", category: "Dry Clean", name: "T-Shirts", amount: "600" },
  { id: "8", category: "Dry Clean", name: "Jackets", amount: "1200" },
  { id: "9", category: "Dry Clean", name: "Suits", amount: "2000" },
  { id: "10", category: "Iron Only", name: "Dress", amount: "250" },
  { id: "11", category: "Iron Only", name: "Shirts", amount: "200" },
  { id: "12", category: "Steam Press", name: "Suits", amount: "1500" },
  { id: "13", category: "Steam Press", name: "Blazers", amount: "1000" },
];

// ─── Dropdown ─────────────────────────────────────────────────────────────────

const Dropdown = ({
  value,
  placeholder,
  options,
  onSelect,
}: {
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (v: string) => void;
}) => {
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
};

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────

const ItemBottomSheet = ({
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
}) => {
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
};

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function ServicesApp() {
  const [items, setItems] = useState<ServiceItem[]>(INITIAL_ITEMS);
  const [screen, setScreen] = useState<Screen>("categories");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editTarget, setEditTarget] = useState<ServiceItem | undefined>();

  const categoryItems = items.filter((i) => i.category === activeCategory);

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setScreen("items");
  };

  const handleBack = () => {
    setScreen("categories");
    setSearch("");
  };

  const handleSubmit = (data: Omit<ServiceItem, "id">) => {
    if (modalMode === "create") {
      const newItem = { id: Date.now().toString(), ...data };
      setItems((prev) => [...prev, newItem]);
      // If we're on items screen for a different category, navigate there
      if (screen === "items" && data.category !== activeCategory) {
        setActiveCategory(data.category);
      }
    } else if (modalMode === "edit" && editTarget) {
      setItems((prev) =>
        prev.map((i) => (i.id === editTarget.id ? { ...i, ...data } : i)),
      );
    }
    setModalMode(null);
  };

  const handleReject = () => {
    if (editTarget) {
      setItems((prev) => prev.filter((i) => i.id !== editTarget.id));
    }
    setModalMode(null);
  };

  const openCreate = (defaultCat?: string) => {
    setEditTarget(undefined);
    // Pre-select the category if we're on the items screen
    if (defaultCat) {
      setEditTarget({ id: "", category: defaultCat, name: "", amount: "" });
    }
    setModalMode("create");
  };

  return (
    <>
      {screen === "categories" ? (
        <CategoriesList
          items={items}
          search={search}
          onSearchChange={setSearch}
          onOpenCreate={() => openCreate()}
          onSelectCategory={handleSelectCategory}
        />
      ) : (
        <CategoryItemsScreen
          category={activeCategory}
          items={categoryItems}
          onBack={handleBack}
          onOpenCreate={() => openCreate(activeCategory)}
          onEditItem={(item) => {
            setEditTarget(item);
            setModalMode("edit");
          }}
        />
      )}

      <ItemBottomSheet
        visible={modalMode !== null}
        mode={modalMode}
        initialData={modalMode === "edit" ? editTarget : undefined}
        defaultCategory={
          modalMode === "create" ? (editTarget?.category ?? "") : ""
        }
        onClose={() => setModalMode(null)}
        onSubmit={handleSubmit}
        onReject={handleReject}
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },

  // Modal / Sheet
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
