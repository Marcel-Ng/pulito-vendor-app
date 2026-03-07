// ─── Screen 1: Category List ──────────────────────────────────────────────────

import { GREEN } from "@/constants/Colors";
import { ServiceItem } from "@/src/types/service.types";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- types

const SERVICE_CATEGORIES = [
  "Wash & Iron",
  "Dry Clean",
  "Iron Only",
  "Wash Only",
  "Steam Press",
  "Stain Removal",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupByCategory(items: ServiceItem[]) {
  const map = new Map<string, ServiceItem[]>();
  for (const item of items) {
    if (!map.has(item.category)) map.set(item.category, []);
    map.get(item.category)!.push(item);
  }
  return map;
}

export default function CategoriesList({
  items,
  search,
  onSearchChange,
  onOpenCreate,
  onSelectCategory,
}: {
  items: ServiceItem[];
  search: string;
  onSearchChange: (v: string) => void;
  onOpenCreate: () => void;
  onSelectCategory: (cat: string) => void;
}) {
  const grouped = groupByCategory(items);

  // Build list of categories that have items OR are in the master list
  const allCategories = SERVICE_CATEGORIES.filter(
    (cat) =>
      cat.toLowerCase().includes(search.toLowerCase()) ||
      (grouped.get(cat) ?? []).some((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={onOpenCreate}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>＋ Create</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIconText}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Service"
          placeholderTextColor="#AAAAAA"
          value={search}
          onChangeText={onSearchChange}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange("")}>
            <Text style={{ color: "#AAAAAA", fontSize: 16, paddingLeft: 8 }}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Cards */}
      <FlatList
        data={allCategories}
        keyExtractor={(c) => c}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 32,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No services found.</Text>
        }
        renderItem={({ item: cat }) => {
          const catItems = grouped.get(cat) ?? [];
          const hasItems = catItems.length > 0;
          return (
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.75}
            >
              {/* Left accent bar */}
              <View />

              <View style={styles.categoryCardInner}>
                <View style={styles.categoryCardLeft}>
                  <View style={{ gap: 3 }}>
                    <Text style={styles.categoryCardName}>{cat}</Text>
                    <Text style={styles.categoryCardSub}>
                      {hasItems
                        ? `${catItems.length} item${catItems.length !== 1 ? "s" : ""}`
                        : "No items yet"}
                    </Text>
                  </View>
                </View>
                <View style={styles.categoryCardRight}>
                  <Text style={styles.categoryChevron}>›</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },

  // Top bar (categories screen)
  topBar: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  createBtn: {
    backgroundColor: GREEN,
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIconText: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#222222" },

  // Category card
  categoryCard: {
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EBEBEB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  categoryCardInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  categoryCardLeft: { flexDirection: "row", alignItems: "center", gap: 14 },

  iconCircleEmpty: { backgroundColor: "#F2F2F2" },
  iconEmoji: { fontSize: 22 },
  categoryCardName: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  categoryCardSub: { fontSize: 13, color: "#999999", fontWeight: "400" },
  categoryCardRight: { alignItems: "center", justifyContent: "center" },
  categoryChevron: {
    fontSize: 26,
    color: "#CCCCCC",
    fontWeight: "300",
    lineHeight: 30,
  },

  // Empty state

  emptyText: {
    textAlign: "center",
    color: "#AAAAAA",
    marginTop: 40,
    fontSize: 15,
  },
});
