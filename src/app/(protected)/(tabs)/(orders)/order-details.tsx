import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type OrderDetail = {
  orderNumber: string;
  createdBy: string;
  createdOn: string;
  deliverOn: string;
  status: "New order" | "In progress" | "Completed";
  items: OrderItem[];
};

const MOCK_ORDER: OrderDetail = {
  orderNumber: "1210393783",
  createdBy: "Okonkwo Kenechi",
  createdOn: "Thursday, Nov 23, 2025",
  deliverOn: "Saturday, Nov 27, 2025",
  status: "New order",
  items: [
    { id: "1", name: "T-shirts", quantity: 10, price: 4000 },
    { id: "2", name: "T-shirts", quantity: 10, price: 4000 },
    { id: "3", name: "T-shirts", quantity: 10, price: 4000 },
    { id: "4", name: "T-shirts", quantity: 10, price: 4000 },
  ],
};

const TABS = ["Order Details", "Delivery Details"];

export default function NewOrderDetailsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const order = MOCK_ORDER;

  const totalPrice =
    order.items.reduce((sum, i) => sum + i.price * i.quantity, 0) /
    order.items.length;

  const handleAccept = () => {
    Alert.alert("Order Accepted", "You have accepted this order.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const handleReject = () => {
    Alert.alert("Reject Order", "Are you sure you want to reject this order?", [
      { text: "Cancel", style: "cancel" },
      { text: "Reject", style: "destructive", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Order {order.orderNumber}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => setActiveTab(i)}
          >
            <Text
              style={[styles.tabText, activeTab === i && styles.tabTextActive]}
            >
              {tab}
            </Text>
            {activeTab === i && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
        <View style={styles.tabBarDivider} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 0 ? (
          <>
            {/* Order meta */}
            <View style={styles.metaSection}>
              <View style={styles.metaRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metaLabel}>Order Created By</Text>
                  <Text style={styles.metaValue}>{order.createdBy}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>

              <Text style={styles.metaLabel}>Order Created On</Text>
              <Text style={styles.metaValue}>{order.createdOn}</Text>

              <Text style={[styles.metaLabel, { marginTop: 16 }]}>
                Order To Be Delivered On
              </Text>
              <Text style={styles.metaValue}>{order.deliverOn}</Text>
            </View>

            {/* Items */}
            <Text style={styles.itemsLabel}>Items</Text>
            <View style={styles.itemsList}>
              {order.items.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.itemRow,
                    index === 1 && styles.itemRowHighlighted,
                    index < order.items.length - 1 && styles.itemRowBorder,
                  ]}
                >
                  <Ionicons
                    name="shirt-outline"
                    size={22}
                    color="#F5C518"
                    style={styles.itemIcon}
                  />
                  <Text
                    style={[
                      styles.itemName,
                      index === 1 && styles.itemNameHighlighted,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.itemQty,
                      index === 1 && styles.itemQtyHighlighted,
                    ]}
                  >
                    ×{item.quantity}
                  </Text>
                  <Text
                    style={[
                      styles.itemPrice,
                      index === 1 && styles.itemPriceHighlighted,
                    ]}
                  >
                    NGN{" "}
                    {item.price.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyTab}>
            <Ionicons name="bicycle-outline" size={48} color="#ccc" />
            <Text style={styles.emptyTabText}>No delivery details yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: "700", color: "#111" },

  // Tabs
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    position: "relative",
  },
  tab: { marginRight: 24, paddingBottom: 10 },
  tabText: { fontSize: 15, color: "#aaa", fontWeight: "500" },
  tabTextActive: { color: "#111", fontWeight: "700" },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: "#F5C518",
    borderRadius: 2,
  },
  tabBarDivider: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#eee",
  },

  content: { padding: 20, paddingBottom: 120 },

  // Meta
  metaSection: { marginBottom: 24 },
  metaRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  metaLabel: { fontSize: 13, color: "#999", marginBottom: 4 },
  metaValue: { fontSize: 15, fontWeight: "500", color: "#111" },
  statusBadge: {
    backgroundColor: "#F5C518",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  statusText: { fontSize: 13, fontWeight: "600", color: "#111" },

  // Items
  itemsLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  itemsList: {},
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 10,
  },
  itemRowBorder: { borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  itemRowHighlighted: {
    borderWidth: 1.5,
    borderColor: "#7B5EA7",
    borderStyle: "dashed",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 2,
  },
  itemIcon: { width: 26 },
  itemName: { flex: 1, fontSize: 15, color: "#222" },
  itemNameHighlighted: { color: "#7B5EA7" },
  itemQty: { fontSize: 14, color: "#555", width: 36 },
  itemQtyHighlighted: { color: "#7B5EA7" },
  itemPrice: { fontSize: 15, fontWeight: "700", color: "#111" },
  itemPriceHighlighted: { color: "#7B5EA7" },

  // Empty tab
  emptyTab: { alignItems: "center", marginTop: 80, gap: 12 },
  emptyTabText: { fontSize: 15, color: "#aaa" },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  footerDivider: { height: 1, backgroundColor: "#f0f0f0", marginBottom: 16 },
  actions: { flexDirection: "row", alignItems: "center", gap: 12 },
  rejectBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  rejectText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8B0000",
    textDecorationLine: "underline",
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: "#3B6B44",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  acceptText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
