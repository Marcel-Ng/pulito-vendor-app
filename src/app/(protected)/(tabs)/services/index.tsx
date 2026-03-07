import {
  CategoriesList,
  CategoryItemsScreen,
  ItemBottomSheet,
} from "@/src/component/services";
import { useVendor } from "@/src/lib/context/vendor-context";
import { ModalMode, ServiceItem } from "@/src/types/service.types";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, UIManager } from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "categories" | "items";

export default function ServicesScreen() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [screen, setScreen] = useState<Screen>("categories");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editTarget, setEditTarget] = useState<ServiceItem | undefined>();
  const { vendors, activeVendor, setActiveVendor } = useVendor();

  const categoryItems =
    items?.filter((i) => i.category === activeCategory) ?? [];

  useEffect(() => {
    if (activeVendor?.items) {
      setItems(activeVendor.items);
    }
  }, [activeVendor]); // Now it only runs when the vendor switches

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
          vendorType={activeVendor.vendorType}
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
        vendorType={activeVendor.vendorType}
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
