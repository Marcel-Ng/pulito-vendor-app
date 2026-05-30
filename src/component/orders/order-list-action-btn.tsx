import { OrderStatus } from "@/src/types/order.types";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type OrderActionButtonProps = {
  orderId: string;
  status: OrderStatus;
  updatingId: string | null;
  onPress: (orderId: string) => void;
};

const ACTION_MAP: Record<OrderStatus, string> = {
  new: "Start",
  pickup: "Picked Up",
  ongoing: "Mark Ready",
  ready: "Out for Delivery",
  delivery: "Mark Delivered",
  completed: "Completed",
};

export function OrderListActionButton({
  orderId,
  status,
  updatingId,
  onPress,
}: OrderActionButtonProps) {
  const isLoading = updatingId === orderId;
  const label = ACTION_MAP[status];

  return (
    <TouchableOpacity
      style={[styles.acceptBtn, isLoading && styles.btnDisabled]}
      onPress={() => onPress(orderId)}
      disabled={isLoading}
    >
      <Text style={styles.acceptText}>{isLoading ? "Loading..." : label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  acceptBtn: {
    flex: 1,
    backgroundColor: "#3B6B44",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: "#a0b8a4",
    opacity: 0.7,
  },
  acceptText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
