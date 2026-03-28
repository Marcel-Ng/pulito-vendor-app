import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  message?: string;
}

export default function EmptyOrders({ message = "No orders here yet" }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="receipt-outline" size={56} color="#ccc" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  text: {
    fontSize: 16,
    color: "#9E9E9E",
  },
});
