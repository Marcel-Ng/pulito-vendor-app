import { OrderCard, OrderCardProps } from "@/src/component/orders";
import { Icon } from "@/src/component/shared";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const orderCategories: OrderCardProps[] = [
    {
      icon: "orders",
      label: "New Orders",
      onPress: () => {
        router.navigate("/(protected)/(tabs)/(orders)/order-list");
      },
    },
    { icon: "pickup", label: "Out for pickup" },
    { icon: "ongoing", label: "Ongoing" },
    { icon: "ready", label: "Ready" },
    { icon: "delivery", label: "Out for delivery" },
    { icon: "completed", label: "Completed" },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.shopName} numberOfLines={1}>
            Washerman Dry-clea...
          </Text>
          <View style={styles.statusToggle}>
            <Text style={styles.statusText}>{isOpen ? "Open" : "Closed"}</Text>
            <Switch
              value={isOpen}
              onValueChange={setIsOpen}
              trackColor={{ false: "#d1d5db", true: "#22c55e" }}
              thumbColor="#ffffff"
              ios_backgroundColor="#d1d5db"
            />
          </View>
        </View>

        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <TouchableOpacity onPress={() => setBalanceVisible((v) => !v)}>
              <Icon
                name={balanceVisible ? "eye" : "eyeClose"}
                size={24}
                color="#6b7280"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.walletAmount}>
            {balanceVisible ? "NGN 0" : "NGN ••••"}
          </Text>
          <View style={styles.divider} />
          <TouchableOpacity>
            <Text style={styles.transactionHistory}>Transaction History</Text>
          </TouchableOpacity>
        </View>

        {/* Order Grid */}
        <View style={styles.grid}>
          {orderCategories.map((item, index) => (
            <OrderCard key={index} {...item} />
          ))}
        </View>

        {/* Rejected — full width */}
        <OrderCard
          icon="rejected"
          label="Rejected"
          fullWidth={true}
          badge={2}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  shopName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 12,
  },
  statusToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  // Wallet
  walletCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  walletLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "400",
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginBottom: 14,
  },
  transactionHistory: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "500",
    textAlign: "center",
  },
  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
});
