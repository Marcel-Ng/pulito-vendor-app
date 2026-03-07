// ─── Screen 2: Items in a Category ───────────────────────────────────────────
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../shared";

// ─── Constants ────────────────────────────────────────────────────────────────

interface ServiceItem {
  id: string;
  category: string;
  name: string;
  amount: string;
}

const GREEN = "#3B5E3A";
const GREEN_LIGHT = "#EDF3EC";
const GREEN_MID = "#C8DEC7";

const CATEGORY_ICONS: Record<string, string> = {
  "Wash & Iron": "👕",
  "Dry Clean": "🧥",
  "Iron Only": "♨️",
  "Wash Only": "🫧",
  "Steam Press": "💨",
  "Stain Removal": "✨",
};

export default function CategoryItemsScreen({
  category,
  items,
  onBack,
  onOpenCreate,
  onEditItem,
}: {
  category: string;
  items: ServiceItem[];
  onBack: () => void;
  onOpenCreate: () => void;
  onEditItem: (item: ServiceItem) => void;
}) {
  const total = items.reduce((sum, i) => sum + parseFloat(i.amount || "0"), 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      {/* Header */}
      <View style={styles.itemsHeader}>
        <BackButton onPress={onBack} />

        <View style={{ flex: 1 }}>
          <Text style={styles.itemsHeaderTitle}>{category}</Text>
          <Text style={styles.itemsHeaderSub}>
            {items.length} item{items.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerCreateBtn}
          onPress={onOpenCreate}
          activeOpacity={0.85}
        >
          <Text style={styles.headerCreateBtnText}>＋ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No items yet</Text>
          <Text style={styles.emptyStateSub}>
            Tap "+ Add" to create your first item in this category.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListHeaderComponent={
            <View style={styles.summaryBar}>
              <Text style={styles.summaryLabel}>Price Range</Text>
              <Text style={styles.summaryValue}>
                ₦{Math.min(...items.map((i) => +i.amount)).toLocaleString()} – ₦
                {Math.max(...items.map((i) => +i.amount)).toLocaleString()}
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.itemRow}
              onPress={() => onEditItem(item)}
              activeOpacity={0.75}
            >
              <View style={styles.itemRowNum}>
                <Text style={styles.itemRowNumText}>{index + 1}</Text>
              </View>
              <Text style={styles.itemRowName}>{item.name}</Text>
              <View style={styles.itemRowRight}>
                <Text style={styles.itemRowAmount}>
                  ₦{parseFloat(item.amount).toLocaleString()}
                </Text>
                <View style={styles.editPill}>
                  <Text style={styles.editPillText}>Edit</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  itemsHeader: {
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 12,
  },

  itemsHeaderTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  itemsHeaderSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: 2,
  },

  headerCreateBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  headerCreateBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateIcon: { fontSize: 52, marginBottom: 16 },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 8,
  },
  emptyStateSub: {
    fontSize: 14,
    color: "#AAAAAA",
    textAlign: "center",
    lineHeight: 20,
  },
  // Summary bar
  summaryBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: GREEN_LIGHT,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  summaryLabel: { fontSize: 13, color: "#666666", fontWeight: "500" },
  summaryValue: { fontSize: 14, color: GREEN, fontWeight: "700" },

  // Item row
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    gap: 12,
  },
  itemRowNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: GREEN_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  itemRowNumText: { fontSize: 12, fontWeight: "700", color: GREEN },
  itemRowName: { flex: 1, fontSize: 16, color: "#1A1A1A", fontWeight: "500" },
  itemRowRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemRowAmount: { fontSize: 16, color: GREEN, fontWeight: "700" },
  editPill: {
    backgroundColor: GREEN_LIGHT,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  editPillText: { fontSize: 12, color: GREEN, fontWeight: "600" },
});
