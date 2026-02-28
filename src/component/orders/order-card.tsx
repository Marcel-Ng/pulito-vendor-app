import { Icon } from "@/src/component/shared";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type OrderCardProps = {
  icon: string;
  label: string;
  badge?: number;
  fullWidth?: boolean;
  onPress?: () => void;
};

export function OrderCard({
  icon,
  label,
  badge,
  fullWidth,
  onPress,
}: OrderCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, fullWidth && styles.cardfullWidth]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon name={icon} size={28} color="#1a1a1a" />
      <Text style={styles.cardLabel}>{label}</Text>
      {badge !== undefined && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 18,
    width: "47.5%",
    minHeight: 110,
    justifyContent: "flex-end",
    position: "relative",
  },
  cardfullWidth: {
    width: "100%",
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 12,
  },
  // Badge
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#d4a017",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
});
