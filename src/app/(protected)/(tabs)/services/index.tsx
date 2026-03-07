import {
  CategoriesList,
  CategoryItemsScreen,
  ItemBottomSheet,
} from "@/src/component/services";
import { ModalMode, ServiceItem } from "@/src/types/service.types";
import { useState } from "react";
import { Platform, StyleSheet, UIManager } from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "categories" | "items";

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_ITEMS: ServiceItem[] = [
  { id: "1", category: "Wash & Iron", name: "Shirts", amount: "400" },
  { id: "2", category: "Wash & Iron", name: "Trousers", amount: "450" },
  { id: "3", category: "Wash & Iron", name: "T-Shirts", amount: "300" },
  { id: "4", category: "Wash & Iron", name: "Dresses", amount: "500" },
  { id: "10", category: "Iron Only", name: "Dress", amount: "250" },
  { id: "11", category: "Iron Only", name: "Shirts", amount: "200" },
  { id: "12", category: "Steam Press", name: "Suits", amount: "1500" },
  { id: "13", category: "Steam Press", name: "Blazers", amount: "1000" },
];

export default function ServicesScreen() {
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
});
