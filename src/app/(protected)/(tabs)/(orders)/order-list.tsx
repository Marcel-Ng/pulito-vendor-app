import { EmptyOrders } from "@/src/component/orders";
import { useOrders } from "@/src/lib/context/order-context";
import { Order } from "@/src/types/order.types";
import { formatDate, momentsAgo } from "@/src/utils/time-date";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type OrderStatus =
  | "new"
  | "pickup"
  | "ongoing"
  | "ready"
  | "delivery"
  | "completed";

const VALID_STATUSES: OrderStatus[] = [
  "new",
  "pickup",
  "ongoing",
  "ready",
  "delivery",
  "completed",
];

const titleMap: Record<OrderStatus, string> = {
  new: "New Orders",
  pickup: "Out for Pickup",
  ongoing: "Ongoing",
  ready: "Ready",
  delivery: "Out for Delivery",
  completed: "Completed",
};

export default function OrderListScreen() {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const router = useRouter();
  const { status } = useLocalSearchParams();
  const { orders, isLoadingOrder, isUpdatingStatus, updateOrderStatus } =
    useOrders();

  const safeStatus: OrderStatus =
    typeof status === "string" && VALID_STATUSES.includes(status as OrderStatus)
      ? (status as OrderStatus)
      : "new";

  const orderMap: Record<OrderStatus, Order[]> = {
    new: orders.newOrders,
    pickup: orders.pickupOrders,
    ongoing: orders.ongoingOrders,
    ready: orders.readyOrders,
    delivery: orders.deliveryOrders,
    completed: orders.completedOrders,
  };

  const currentOrders = orderMap[safeStatus];
  const screenTitle = titleMap[safeStatus];

  // const handleStart = (id: string) => {
  //   Alert.alert("Order Accepted", "You have accepted this order.");
  // };

  const handleStart = async (orderId: string) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, "ongoing");
      router.back();
    } catch (err) {
      // show toast or alert
      console.log(err);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    console.log(currentOrders);
    console.log(orders);
  }, [currentOrders]);

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

        {isLoadingOrder ? (
          <ActivityIndicator
            color="#3B6B44"
            size="large"
            style={{ marginTop: 60 }}
          />
        ) : currentOrders.length === 0 ? (
          <EmptyOrders
            message={`No ${screenTitle.toLowerCase()} at the moment`}
          />
        ) : (
          currentOrders.map((order) => (
            <View key={order.id} style={styles.card}>
              <TouchableOpacity
                onPress={() =>
                  router.navigate({
                    pathname: "/(protected)/(tabs)/(orders)/order-details",
                    params: { orderId: order.id },
                  })
                }
              >
                <Text style={styles.orderNumber}>
                  Order {order.orderNumber}
                </Text>

                {/* Date range */}
                <View style={styles.dateRow}>
                  <Text style={styles.dateText}>
                    {momentsAgo(order.createdAt)}
                  </Text>
                  <View style={styles.dashedLine} />
                  <Text style={styles.dateText}>
                    {formatDate(order.scheduledDate)}
                  </Text>
                </View>

                {/* Items + price */}
                <View style={styles.metaRow}>
                  <Text style={styles.itemCount}>
                    {order.itemCount} {order.orderType}(s)
                  </Text>
                  <Text style={styles.price}>
                    NGN{" "}
                    {(order.totalPrice / 100).toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>

                <View style={styles.divider} />
              </TouchableOpacity>

              {/* Actions — only for new orders */}
              {safeStatus === "new" && (
                <View style={styles.actions}>
                  {/* <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleReject(order.id)}
                  >
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => handleStart(order.id)}
                  >
                    <Text style={styles.acceptText}>
                      {updatingId === order.id ? "Loading..." : "Start"}
                    </Text>
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
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
    paddingVertical: 14,
    alignItems: "center",
  },
  acceptText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
