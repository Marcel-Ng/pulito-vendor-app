import { EmptyOrders } from "@/src/component/orders";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Order = {
  id: string;
  orderNumber: string;
  pickupDate: string;
  deliveryDate: string;
  itemCount: number;
  totalPrice: number;
};

type OrderList = {
  newOrders: Order[];
  pickupOrders: Order[];
  ongoingOrders: Order[];
  readyOrders: Order[];
  deliveryOrders: Order[];
  completedOrders: Order[];
};

// ✅ Explicit status type
type OrderStatus =
  | "new"
  | "pickup"
  | "ongoing"
  | "ready"
  | "delivery"
  | "completed";

const MOCK_ORDERS: OrderList = {
  newOrders: [],
  pickupOrders: [],
  ongoingOrders: [],
  readyOrders: [],
  deliveryOrders: [],
  completedOrders: [
    {
      id: "1",
      orderNumber: "1210393783",
      pickupDate: "Nov 24 | 11:30",
      deliveryDate: "Nov 27 | 12:30",
      itemCount: 12,
      totalPrice: 12000,
    },
  ],
};

export default function OrderListScreen() {
  const router = useRouter();
  const { status } = useLocalSearchParams();

  const [orders] = useState<OrderList>(MOCK_ORDERS);

  // ✅ Normalize status safely
  const VALID_STATUSES: OrderStatus[] = [
    "new",
    "pickup",
    "ongoing",
    "ready",
    "delivery",
    "completed",
  ];

  const safeStatus: OrderStatus =
    typeof status === "string" && VALID_STATUSES.includes(status as OrderStatus)
      ? (status as OrderStatus)
      : "new";

  // ✅ Map status → actual data
  const orderMap: Record<OrderStatus, Order[]> = {
    new: orders.newOrders,
    pickup: orders.pickupOrders,
    ongoing: orders.ongoingOrders,
    ready: orders.readyOrders,
    delivery: orders.deliveryOrders,
    completed: orders.completedOrders,
  };

  const currentOrders = orderMap[safeStatus];

  // ✅ Title map
  const titleMap: Record<OrderStatus, string> = {
    new: "New Orders",
    pickup: "Out for Pickup",
    ongoing: "Ongoing",
    ready: "Ready",
    delivery: "Out for Delivery",
    completed: "Completed",
  };

  const screenTitle = titleMap[safeStatus];

  const handleAccept = (id: string) => {
    Alert.alert("Order Accepted", "You have accepted this order.");
  };

  const handleReject = (id: string) => {
    Alert.alert("Reject Order", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Reject", style: "destructive" },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>{screenTitle}</Text>
        </View>

        {/* Empty State */}
        {currentOrders.length === 0 ? (
          <EmptyOrders
            message={`No ${screenTitle.toLowerCase()} at the moment`}
          />
        ) : (
          currentOrders.map((order) => (
            <View key={order.id} style={styles.card}>
              <TouchableOpacity
                onPress={() =>
                  router.navigate("/(protected)/(tabs)/(orders)/order-details")
                }
              >
                <Text style={styles.orderNumber}>
                  Order {order.orderNumber}
                </Text>

                {/* Date range */}
                <View style={styles.dateRow}>
                  <Text style={styles.dateText}>{order.pickupDate}</Text>
                  <View style={styles.dashedLine} />
                  <Text style={styles.dateText}>{order.deliveryDate}</Text>
                </View>

                {/* Items + price */}
                <View style={styles.metaRow}>
                  <Text style={styles.itemCount}>{order.itemCount} items</Text>
                  <Text style={styles.price}>
                    NGN{" "}
                    {order.totalPrice.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>

                <View style={styles.divider} />
              </TouchableOpacity>

              {/* Actions (only for new orders) */}
              {safeStatus === "new" && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleReject(order.id)}
                  >
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => handleAccept(order.id)}
                  >
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingTop: 60, gap: 16 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },

  // Card
  card: {
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  orderNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },

  // Date row
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: { fontSize: 14, color: "#888" },

  dashedLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 10,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  // Meta
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemCount: { fontSize: 14, color: "#888" },
  price: { fontSize: 16, fontWeight: "700", color: "#111" },

  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 16,
  },

  // Actions
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rejectBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
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
    paddingVertical: 14,
    alignItems: "center",
  },
  acceptText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
