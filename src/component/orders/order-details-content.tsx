import { orderService } from "@/src/lib/services/order.service";
import { OrderDetailResponse } from "@/src/types/order.types";
import { formatDate } from "@/src/utils/time-date";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ErrorComponent } from "../shared";

const getOrderTotal = (order: OrderDetailResponse): number => {
  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.pricePerUnit * item.quantity,
    0,
  );
  return itemsTotal + order.pickupFee + order.deliveryFee;
};

export function OrderDetailContent({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse>();

  const totalPrice = orderDetail ? getOrderTotal(orderDetail) : 0;

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrderById(orderId);
      setOrderDetail(response.data);
    } catch (error) {
      setError("Failed to load order details.");
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#3B6B44" style={styles.centered} />
    );
  }

  if (error) {
    return <ErrorComponent refetch={fetchOrderDetails} />;
  }

  if (!orderDetail) return null;

  return (
    <>
      {/* Order meta */}
      <View style={styles.metaSection}>
        <View style={styles.metaRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.metaLabel}>Order Created By</Text>
            <Text style={styles.metaValue}>{orderDetail.customerName}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{orderDetail.currentStatus}</Text>
          </View>
        </View>

        <Text style={styles.metaLabel}>Order Created On</Text>
        <Text style={styles.metaValue}>
          {formatDate(orderDetail.createdAt)}
        </Text>

        <Text style={[styles.metaLabel, { marginTop: 16 }]}>
          Order To Be Delivered On
        </Text>
        <Text style={styles.metaValue}>
          {formatDate(orderDetail.orderCompletionDate)}
        </Text>
      </View>

      {/* Items */}
      <Text style={styles.itemsLabel}>Items</Text>
      <View style={styles.itemsList}>
        {orderDetail.items.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.itemRow,
              index === 1 && styles.itemRowHighlighted,
              index < orderDetail.items.length - 1 && styles.itemRowBorder,
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
              style={[styles.itemQty, index === 1 && styles.itemQtyHighlighted]}
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
              {item.pricePerUnit.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>
          NGN {totalPrice.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 80,
  },

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

  // Total
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalLabel: { fontSize: 15, fontWeight: "600", color: "#111" },
  totalValue: { fontSize: 17, fontWeight: "700", color: "#3B6B44" },
});
