import React from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Icon } from "@/src/component/shared";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Simple inline icons (swap with @expo/vector-icons if preferred) ──────────
const ChevronRight = () => (
  <View
    style={{
      width: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      style={{
        width: 7,
        height: 7,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: "#9ca3af",
        transform: [{ rotate: "45deg" }],
      }}
    />
  </View>
);

type IconName = "store" | "operation" | "bank" | "star" | "person" | "lock";

// ─── Menu Row ─────────────────────────────────────────────────────────────────
type MenuRowProps = {
  icon: IconName;
  label: string;
  onPress?: () => void;
  showDivider?: boolean;
};

const MenuRow = ({
  icon,
  label,
  onPress,
  showDivider = true,
}: MenuRowProps) => (
  <>
    <TouchableOpacity
      style={styles.menuRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <Icon name={icon} />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <ChevronRight />
    </TouchableOpacity>
    {showDivider && <View style={styles.divider} />}
  </>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("Logged out"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {/* Replace with <Image source={{ uri: '...' }} style={styles.avatar} /> for real logo */}
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarEmoji}>👔</Text>
            </View>
          </View>
          <Text style={styles.businessName}>Washerman Laundry Service</Text>
        </View>

        {/* Business Section */}
        <Text style={styles.sectionTitle}>Business</Text>
        <View style={styles.section}>
          <MenuRow icon="store" label="Business Profile" onPress={() => {}} />
          <MenuRow
            icon="operation"
            label="Business Operation"
            onPress={() => {}}
          />
          <MenuRow icon="bank" label="Bank Settings" onPress={() => {}} />
          <MenuRow
            icon="star"
            label="Reviews"
            onPress={() => {}}
            showDivider={false}
          />
        </View>

        {/* Personal Section */}
        <Text style={styles.sectionTitle}>Personal</Text>
        <View style={styles.section}>
          <MenuRow icon="person" label="Personal Profile" onPress={() => {}} />
          <MenuRow
            icon="lock"
            label="Password Settings"
            onPress={() => {}}
            showDivider={false}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // Header
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatarContainer: {
    marginBottom: 14,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#d4a017",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
  },
  // Sections
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  // Menu Row
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "400",
    color: "#1a1a1a",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e5e7eb",
  },
  // Logout
  logoutButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
    textDecorationLine: "underline",
  },
});
