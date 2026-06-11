import { useOrders } from "@/src/lib/context/order-context";
import { useVendor } from "@/src/lib/context/vendor-context";
import { orderService } from "@/src/lib/services/order.service";
import {
  NEXT_STATUS_MAP,
  OrderDetailResponse,
  OrderStatus,
} from "@/src/types/order.types";
import { VendorType } from "@/src/types/vendor.types";
import { formatDate } from "@/src/utils/time-date";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ErrorComponent } from "../shared";
import { OrderActionButton } from "./order-list-action-btn";

const getOrderTotal = (order: OrderDetailResponse): number => {
  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.pricePerUnit * item.quantity,
    0,
  );
  return itemsTotal;
  // removed the delivery fee + order.pickupFee + order.deliveryFee;
};

const SERVICE_ICON: Record<VendorType, keyof typeof Ionicons.glyphMap> = {
  laundry: "water-outline", // washing/water — not item specific
  // dry_cleaning: "sparkles-outline", // clean/fresh feel
  carwash: "car-outline",
};

const getServiceIcon = (
  serviceType?: string,
): keyof typeof Ionicons.glyphMap => {
  return SERVICE_ICON[serviceType as VendorType] ?? "cube-outline";
};

export function OrderDetailContent({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse>();
  const { updateOrderStatus, isUpdatingStatus } = useOrders();
  const router = useRouter();
  const { activeVendor } = useVendor();
  const vendorId = activeVendor?.id ?? "";

  const queryClient = useQueryClient();

  const handleAccept = async (status: OrderStatus) => {
    try {
      const nextStatus = NEXT_STATUS_MAP[status];

      await updateOrderStatus(orderId, nextStatus);
      if (nextStatus === "completed") {
        queryClient.invalidateQueries({
          queryKey: ["vendorBalance", vendorId],
        });
      }
      router.back();
    } catch (err) {
      console.log(err);
    }
  };

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
              index < orderDetail.items.length - 1 && styles.itemRowBorder,
            ]}
          >
            <Ionicons
              name={getServiceIcon(orderDetail.serviceType)}
              size={22}
              color="#F5C518"
              style={styles.itemIcon}
            />

            {/* Name + price per unit */}
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemUnitPrice}>
                NGN{" "}
                {item.pricePerUnit.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}{" "}
                / unit
              </Text>
            </View>

            {/* Qty */}
            <Text style={styles.itemQty}>×{item.quantity}</Text>

            {/* Subtotal */}
            <Text style={styles.itemPrice}>
              NGN{" "}
              {(item.pricePerUnit * item.quantity).toLocaleString("en-NG", {
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

      {/* Bottom actions */}
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <OrderActionButton
          orderId={orderId}
          status={orderDetail.currentStatus}
          onPress={() => handleAccept(orderDetail.currentStatus)}
          isLoading={isUpdatingStatus}
        />
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
  // itemName: { flex: 1, fontSize: 15, color: "#222" },
  itemNameHighlighted: { color: "#7B5EA7" },
  itemQty: { fontSize: 14, color: "#555", width: 36 },
  itemQtyHighlighted: { color: "#7B5EA7" },
  itemPrice: { fontSize: 15, fontWeight: "700", color: "#111" },
  itemPriceHighlighted: { color: "#7B5EA7" },

  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, color: "#222", fontWeight: "500" },
  itemUnitPrice: { fontSize: 12, color: "#999", marginTop: 2 },

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
});
