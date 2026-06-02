import { OrderStatus } from "@/src/types/order.types";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// type OrderActionButtonProps = {
//   orderId: string;
//   status: OrderStatus;
//   updatingId: string | null;
//   onPress: (orderId: string) => void;
// };

// export function OrderListActionButton({
//   orderId,
//   status,
//   updatingId,
//   onPress,
// }: OrderActionButtonProps) {
//   const isLoading = updatingId === orderId;
//   const label = ACTION_MAP[status];

//   return status === "completed" ? (
//     <View style={[styles.acceptBtn, styles.completedBadge]}>
//       <Text style={styles.completedBadgeText}> ✓ Completed</Text>
//     </View>
//   ) : (
//     <TouchableOpacity
//       style={[styles.acceptBtn, isLoading && styles.btnDisabled]}
//       onPress={() => onPress(orderId)}
//       disabled={isLoading}
//     >
//       <Text style={styles.acceptText}>{isLoading ? "Loading..." : label}</Text>
//     </TouchableOpacity>
//   );
// }

const ACTION_MAP: Record<OrderStatus, string> = {
  new: "Start",
  pickup: "Picked Up",
  ongoing: "Mark Ready",
  ready: "Out for Delivery",
  delivery: "Mark Delivered",
  completed: "Completed",
};

type OrderActionButtonProps = {
  orderId: string;
  status: OrderStatus;
  onPress: (orderId: string) => void;
  isLoading: boolean;
};

export function OrderActionButton({
  orderId,
  status,
  onPress,
  isLoading = false,
}: OrderActionButtonProps) {
  const label = ACTION_MAP[status];

  if (status === "completed") {
    return (
      <View style={[styles.btn, styles.completedBadge]}>
        <Text style={styles.completedBadgeText}>✓ Completed</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.btn, isLoading && styles.btnDisabled]}
      onPress={() => onPress(orderId)}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.btnText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

// const styles = StyleSheet.create({
//   acceptBtn: {
//     flex: 1,
//     backgroundColor: "#3B6B44",
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   btnDisabled: {
//     backgroundColor: "#a0b8a4",
//     opacity: 0.7,
//   },
//   acceptText: { color: "#fff", fontSize: 16, fontWeight: "600" },

//   completedBadge: {
//     backgroundColor: "#f0f7f2",
//   },
//   completedBadgeText: {
//     color: "#3B6B44",
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });

const styles = StyleSheet.create({
  btn: {
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
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  completedBadge: { backgroundColor: "#f0f7f2" },
  completedBadgeText: { color: "#3B6B44", fontSize: 14, fontWeight: "600" },
});
