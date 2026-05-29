import { OrderDetailContent } from "@/src/component/orders/order-details-content";
import { useOrders } from "@/src/lib/context/order-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TABS = ["Order Details", "Delivery Details"];

export default function NewOrderDetailsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { updateOrderStatus, isUpdatingStatus } = useOrders();

  // const handleAccept = () => {
  //   Alert.alert("Order Accepted", "You have accepted this order.", [
  //     { text: "OK", onPress: () => router.back() },
  //   ]);
  // };

  const handleAccept = async () => {
    try {
      await updateOrderStatus(orderId, "ongoing");
      router.back();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Order {orderId}</Text>
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
          <OrderDetailContent orderId={orderId} />
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
          <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
            <Text style={styles.acceptText}>
              {isUpdatingStatus ? "Loading..." : "Start"}
            </Text>
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

  // Meta --- 111

  // ---- 222
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
