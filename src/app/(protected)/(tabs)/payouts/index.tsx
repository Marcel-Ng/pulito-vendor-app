import { useVendor } from "@/src/lib/context/vendor-context";
import {
  PayoutResponse,
  payoutService,
} from "@/src/lib/services/payout-service";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatNGN(amount: number): string {
  return `NGN ${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type SortOption =
  | "Newest First"
  | "Oldest First"
  | "Amount (High–Low)"
  | "Amount (Low–High)";

const SORT_OPTIONS: SortOption[] = [
  "Newest First",
  "Oldest First",
  "Amount (High–Low)",
  "Amount (Low–High)",
];

function sortPayouts(
  data: PayoutResponse[],
  option: SortOption,
): PayoutResponse[] {
  const copy = [...data];
  switch (option) {
    case "Newest First":
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "Oldest First":
      return copy.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    case "Amount (High–Low)":
      return copy.sort((a, b) => b.amount - a.amount);
    case "Amount (Low–High)":
      return copy.sort((a, b) => a.amount - b.amount);
    default:
      return copy;
  }
}

// ── Components ────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => (
  <Text style={status === "PAID" ? styles.statusPaid : styles.statusPending}>
    {status}
  </Text>
);

const PayoutItem = ({
  item,
  isLast,
}: {
  item: PayoutResponse;
  isLast: boolean;
}) => (
  <View style={[styles.row, !isLast && styles.rowBorder]}>
    <View style={styles.rowLeft}>
      <Text style={styles.reference}>{item.reference}</Text>
      <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
    </View>
    <View style={styles.rowRight}>
      <StatusBadge status={item.status} />
      <Text style={styles.amount}>{formatNGN((item.amount ?? 0) / 100)}</Text>
    </View>
  </View>
);

// ── Screen ────────────────────────────────────────────────────────────────────

export default function PayoutsScreen() {
  const router = useRouter();
  const { activeVendor } = useVendor();
  const vendorId = activeVendor?.id ?? "";

  const [payouts, setPayouts] = useState<PayoutResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>("Newest First");

  // Refetch every time screen comes into focus (e.g. after requesting a payout)
  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        if (!vendorId) return;
        setLoading(true);
        try {
          const res = await payoutService.getPayouts(vendorId);
          setPayouts(res.data);
        } catch (err) {
          setPayouts([]);

          console.error("Failed to fetch payouts", err);
        } finally {
          setLoading(false);
        }
      };
      fetch();
    }, [vendorId]),
  );

  const sortedPayouts = sortPayouts(payouts, selectedSort);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Sort bar */}
      <View style={styles.sortBar}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortVisible(true)}
        >
          <View style={styles.sortIcon}>
            {[14, 10, 6].map((w, i) => (
              <View key={i} style={[styles.sortLine, { width: w }]} />
            ))}
          </View>
          <Text style={styles.sortText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#3B6B44" />
      ) : sortedPayouts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No payout history yet.</Text>
        </View>
      ) : (
        <FlatList
          data={sortedPayouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <PayoutItem
              item={item}
              isLast={index === sortedPayouts.length - 1}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

      {/* Floating request payout button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            router.push("/(protected)/(tabs)/payouts/request-payout")
          }
        >
          <Text style={styles.fabText}>Request Payout</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Modal */}
      <Modal
        visible={sortVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSortVisible(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Sort by</Text>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.sortOption}
                onPress={() => {
                  setSelectedSort(option);
                  setSortVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    selectedSort === option && styles.sortOptionActive,
                  ]}
                >
                  {option}
                </Text>
                {selectedSort === option && (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },

  sortBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "flex-end",
  },
  sortButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  sortIcon: { gap: 3, alignItems: "flex-end" },
  sortLine: { height: 2, backgroundColor: "#1a1a1a", borderRadius: 1 },
  sortText: { fontSize: 16, fontWeight: "500", color: "#1a1a1a" },

  list: { paddingHorizontal: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 18,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d1d5db",
  },
  rowLeft: { gap: 6 },
  rowRight: { alignItems: "flex-end", gap: 6 },
  reference: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.3,
  },
  date: { fontSize: 14, color: "#9ca3af", fontWeight: "400" },
  amount: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.3,
  },
  statusPaid: {
    fontSize: 14,
    fontWeight: "700",
    color: "#22c55e",
    letterSpacing: 0.5,
  },
  statusPending: {
    fontSize: 14,
    fontWeight: "700",
    color: "#d4a017",
    letterSpacing: 0.5,
  },

  emptyState: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 15, color: "#aaa" },

  fabContainer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  fab: {
    backgroundColor: "#3B6B44",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#3B6B44",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { fontSize: 16, fontWeight: "700", color: "#fff" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f3f4f6",
  },
  sortOptionText: { fontSize: 16, color: "#6b7280", fontWeight: "400" },
  sortOptionActive: { color: "#1a1a1a", fontWeight: "600" },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: { color: "#ffffff", fontSize: 12, fontWeight: "700" },
});
