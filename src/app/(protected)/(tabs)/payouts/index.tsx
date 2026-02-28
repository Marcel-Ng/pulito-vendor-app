import { SafeAreaView } from "react-native-safe-area-context";

import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PayoutStatus = "PENDING" | "PAID";

type Payout = {
  id: string;
  reference: string;
  date: string; // display string
  timestamp: number; // unix ms for sorting
  amountRaw: number; // raw number for sorting
  amount: string; // formatted display string
  status: PayoutStatus;
};

const PAYOUTS: Payout[] = [
  {
    id: "1",
    reference: "#110122311",
    date: "Wed, 23 November 2024",
    timestamp: new Date("2024-11-23").getTime(),
    amountRaw: 30000,
    amount: "NGN 30,000.00",
    status: "PENDING",
  },
  {
    id: "2",
    reference: "#110122312",
    date: "Thu, 14 November 2024",
    timestamp: new Date("2024-11-14").getTime(),
    amountRaw: 230000,
    amount: "NGN 230,000.00",
    status: "PAID",
  },
  {
    id: "3",
    reference: "#110122313",
    date: "Mon, 04 November 2024",
    timestamp: new Date("2024-11-04").getTime(),
    amountRaw: 175000,
    amount: "NGN 175,000.00",
    status: "PAID",
  },
  {
    id: "4",
    reference: "#110122314",
    date: "Fri, 25 October 2024",
    timestamp: new Date("2024-10-25").getTime(),
    amountRaw: 95000,
    amount: "NGN 95,000.00",
    status: "PAID",
  },
  {
    id: "5",
    reference: "#110122315",
    date: "Tue, 15 October 2024",
    timestamp: new Date("2024-10-15").getTime(),
    amountRaw: 310000,
    amount: "NGN 310,000.00",
    status: "PAID",
  },
  {
    id: "6",
    reference: "#110122316",
    date: "Wed, 02 October 2024",
    timestamp: new Date("2024-10-02").getTime(),
    amountRaw: 50000,
    amount: "NGN 50,000.00",
    status: "PAID",
  },
  {
    id: "7",
    reference: "#110122317",
    date: "Sat, 21 September 2024",
    timestamp: new Date("2024-09-21").getTime(),
    amountRaw: 420000,
    amount: "NGN 420,000.00",
    status: "PAID",
  },
  {
    id: "8",
    reference: "#110122318",
    date: "Mon, 09 September 2024",
    timestamp: new Date("2024-09-09").getTime(),
    amountRaw: 120000,
    amount: "NGN 120,000.00",
    status: "PAID",
  },
];

type SortOption =
  | "Newest First"
  | "Oldest First"
  | "Amount (High–Low)"
  | "Amount (Low–High)";

function sortPayouts(data: Payout[], option: SortOption): Payout[] {
  const copy = [...data];
  switch (option) {
    case "Newest First":
      return copy.sort((a, b) => b.timestamp - a.timestamp);
    case "Oldest First":
      return copy.sort((a, b) => a.timestamp - b.timestamp);
    case "Amount (High–Low)":
      return copy.sort((a, b) => b.amountRaw - a.amountRaw);
    case "Amount (Low–High)":
      return copy.sort((a, b) => a.amountRaw - b.amountRaw);
    default:
      return copy;
  }
}

const SORT_OPTIONS: SortOption[] = [
  "Newest First",
  "Oldest First",
  "Amount (High–Low)",
  "Amount (Low–High)",
];

const StatusBadge = ({ status }: { status: PayoutStatus }) => (
  <Text style={status === "PAID" ? styles.statusPaid : styles.statusPending}>
    {status}
  </Text>
);

const PayoutItem = ({ item, isLast }: { item: Payout; isLast: boolean }) => (
  <View style={[styles.row, !isLast && styles.rowBorder]}>
    <View style={styles.rowLeft}>
      <Text style={styles.reference}>{item.reference}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
    <View style={styles.rowRight}>
      <StatusBadge status={item.status} />
      <Text style={styles.amount}>{item.amount}</Text>
    </View>
  </View>
);

export default function PayoutsScreen() {
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>("Newest First");

  const sortedPayouts = sortPayouts(PAYOUTS, selectedSort);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Sort bar */}
      <View style={styles.sortBar}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortVisible(true)}
        >
          {/* Sort icon */}
          <View style={styles.sortIcon}>
            {[14, 10, 6].map((w, i) => (
              <View key={i} style={[styles.sortLine, { width: w }]} />
            ))}
          </View>
          <Text style={styles.sortText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={sortedPayouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PayoutItem item={item} isLast={index === sortedPayouts.length - 1} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

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
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  // Sort bar
  sortBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "flex-end",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sortIcon: {
    gap: 3,
    alignItems: "flex-end",
  },
  sortLine: {
    height: 2,
    backgroundColor: "#1a1a1a",
    borderRadius: 1,
  },
  sortText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  // List
  list: {
    paddingHorizontal: 20,
  },
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
  rowLeft: {
    gap: 6,
  },
  rowRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  reference: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.3,
  },
  date: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: "400",
  },
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
  // Modal
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
  sortOptionText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "400",
  },
  sortOptionActive: {
    color: "#1a1a1a",
    fontWeight: "600",
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
});
