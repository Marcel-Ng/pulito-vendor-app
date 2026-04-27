import {
  CategoriesList,
  CategoryItemsScreen,
  ItemBottomSheet,
} from "@/src/component/services";
import { useServices } from "@/src/lib/context/services-context";
import { useVendor } from "@/src/lib/context/vendor-context";
import { ModalMode, ServiceItem } from "@/src/types/service.types";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  UIManager,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "categories" | "items";

export default function ServicesScreen() {
  // const [items, setItems] = useState<ServiceItem[]>([]);
  const [screen, setScreen] = useState<Screen>("categories");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editTarget, setEditTarget] = useState<ServiceItem | undefined>();
  const { vendors, activeVendor, setActiveVendor } = useVendor();
  const {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    isMutating,
  } = useServices();

  const categoryItems =
    items?.filter((i) => i.category === activeCategory) ?? [];

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setScreen("items");
  };

  const handleBack = () => {
    setScreen("categories");
    setSearch("");
  };

  const handleSubmit = async (data: Omit<ServiceItem, "id">) => {
    let result;

    if (modalMode === "create") {
      result = await createItem(data);
    } else if (modalMode === "edit" && editTarget) {
      result = await updateItem(editTarget.id, data);
    }

    // Only close the modal if the operation was successful
    if (result) {
      setModalMode(null);
    }
  };

  const handleReject = async () => {
    if (editTarget) {
      // Calls context which handles the API delete and state update
      const success = await deleteItem(editTarget.id);

      if (success) {
        setModalMode(null);
        setEditTarget(undefined);
      }
    }
  };
  const openCreate = (defaultCat?: string) => {
    setEditTarget(undefined);
    if (defaultCat) {
      setEditTarget({ id: "", category: defaultCat, name: "", price: 0 });
    }
    setModalMode("create");
  };

  if (!activeVendor) return <ActivityIndicator style={{ flex: 1 }} />;

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
        isSaving={
          isMutating("create") || isMutating(`update:${editTarget?.id}`)
        }
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
});
