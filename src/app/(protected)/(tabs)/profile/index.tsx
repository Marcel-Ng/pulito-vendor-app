import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Icon } from "@/src/component/shared";
import { useAuth } from "@/src/lib/context/AuthContext";
import { useVendor } from "@/src/lib/context/vendor-context";
import { Vendor } from "@/src/types/vendor.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Chevron right ────────────────────────────────────────────────────────────
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
  const { vendors, activeVendor, setActiveVendor } = useVendor();
  const { logOut, deleteAccount, user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [addBusinessVisible, setAddBusinessVisible] = useState(false);

  if (!activeVendor) {
    return <NoVendor />;
  }

  const handleAddBusiness = async () => {
    const to = "support@getpulito.com";
    const subject = encodeURIComponent("add my new business");
    const body = encodeURIComponent(
      `Hi Pulito Support,\n\nI would like to add a new business to my account.\n\nAccount email: ${user?.email ?? ""}`,
    );
    const url = `mailto:${to}?subject=${subject}&body=${body}`;

    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    } else {
      // fallback — show the email so they can copy it manually
      Alert.alert(
        "No Mail App Found",
        "Please send an email to support@getpulito.com with the subject 'add my new business'.",
        [
          {
            text: "Copy Email",
            onPress: () => {
              Clipboard.setStringAsync("support@getpulito.com");
            },
          },
          { text: "OK", style: "cancel" },
        ],
      );
    }
  };

  const [switcherVisible, setSwitcherVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logOut();
        },
      },
    ]);
  };

  const handleSwitch = (vendor: Vendor) => {
    setActiveVendor(vendor);
    setSwitcherVisible(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all associated data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // second confirmation
            Alert.alert(
              "Are you absolutely sure?",
              "Your account, vendors, and all data will be permanently removed.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Yes, Delete My Account",
                  style: "destructive",
                  onPress: confirmDeleteAccount,
                },
              ],
            );
          },
        },
      ],
    );
  };

  const confirmDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Failed to delete account. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    console.log("Active vendor changed:", activeVendor);
  }, [activeVendor]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Name — tap to switch vendor */}
        <TouchableOpacity
          style={styles.profileHeader}
          onPress={() => setSwitcherVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.avatarContainer}>
            {/* <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: activeVendor.avatarBg },
              ]}
            >
              <Text style={styles.avatarEmoji}>{activeVendor.avatarEmoji}</Text>
            </View> */}
            <Image
              source={{ uri: activeVendor.profile.imageUrl }}
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                // position: "absolute",
              }}
            />
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.businessName}>{activeVendor.name}</Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#9ca3af"
            />
          </View>
          <Text style={styles.switchHint}>Switch Account</Text>
        </TouchableOpacity>

        {/* Business Section */}
        <Text style={styles.sectionTitle}>Business</Text>
        <View style={styles.section}>
          <MenuRow
            icon="store"
            label="Business Profile"
            onPress={() => router.navigate("/profile/business-profile")}
          />
          <MenuRow
            icon="operation"
            label="Business Operation"
            onPress={() => router.navigate("/profile/business-operation")}
          />
          <MenuRow
            icon="bank"
            label="Bank Settings"
            onPress={() => router.navigate("/profile/bank-settings")}
          />
          <MenuRow
            icon="star"
            label="Reviews"
            onPress={() => router.navigate("/profile/review")}
            showDivider={false}
          />
        </View>

        {/* Personal Section, re-add when I find what to add there */}
        {/* <Text style={styles.sectionTitle}>Personal</Text>
        <View style={styles.section}>
          <MenuRow icon="person" label="Personal Profile" onPress={() => {}} />
          <MenuRow
            icon="lock"
            label="Password Settings"
            onPress={() => {}}
            showDivider={false}
          />
        </View> */}

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* delete account */}
        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={styles.deleteBtn}
        >
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Account Switcher Modal ──────────────────────────────────────────── */}
      <Modal
        visible={switcherVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSwitcherVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setSwitcherVisible(false)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Switch Account</Text>

          {vendors.map((vendor, index) => (
            <TouchableOpacity
              key={vendor.id}
              style={[
                styles.vendorRow,
                index < vendors.length - 1 && styles.vendorRowBorder,
              ]}
              onPress={() => handleSwitch(vendor)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.vendorRowAvatar,
                  { backgroundColor: vendor.avatarBg },
                ]}
              >
                <Text style={{ fontSize: 20 }}>{vendor.avatarEmoji}</Text>
              </View>
              <View style={styles.vendorRowInfo}>
                <Text style={styles.vendorRowName}>{vendor.name}</Text>
                <Text style={styles.vendorRowRole}>{vendor.vendorType}</Text>
              </View>
              {activeVendor.id === vendor.id && (
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color="#007AFF"
                />
              )}
            </TouchableOpacity>
          ))}

          <View style={styles.sheetDivider} />

          <TouchableOpacity
            style={styles.vendorRow}
            activeOpacity={0.7}
            onPress={() => {
              setSwitcherVisible(false); // close switcher
              setTimeout(() => setAddBusinessVisible(true), 300); // wait for dismiss animation
            }}
          >
            <View style={styles.addIconCircle}>
              <MaterialCommunityIcons name="plus" size={22} color="#007AFF" />
            </View>
            <Text style={styles.addAccountText}>Add Another Business</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setSwitcherVisible(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* add a new business modal */}
      <Modal
        visible={addBusinessVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddBusinessVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setAddBusinessVisible(false)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 24,
              paddingBottom: 8,
            }}
          >
            <View style={styles.addBizIconCircle}>
              <MaterialCommunityIcons
                name="store-plus-outline"
                size={32}
                color="#007AFF"
              />
            </View>

            <Text style={styles.addBizTitle}>Add Another Business</Text>
            <Text style={styles.addBizBody}>
              To add a new business to your Pulito account, send us an email and
              our team will get it set up for you.
            </Text>

            <View style={styles.addBizEmailBox}>
              <MaterialCommunityIcons
                name="email-outline"
                size={16}
                color="#9ca3af"
              />
              <Text style={styles.addBizEmailText}>support@getpulito.com</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addBizBtn}
            onPress={handleAddBusiness}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="send-outline"
              size={18}
              color="#fff"
            />
            <Text style={styles.addBizBtnText}>Send Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setAddBusinessVisible(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function NoVendor() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, color: "#9ca3af" }}>
          No active vendor found.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  profileHeader: { alignItems: "center", paddingVertical: 32 },
  avatarContainer: { marginBottom: 14 },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 40 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  businessName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
  },
  switchHint: {
    marginTop: 4,
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    marginTop: 8,
  },
  section: { marginBottom: 24 },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 16 },
  menuLabel: { fontSize: 16, fontWeight: "400", color: "#1a1a1a" },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: "#e5e7eb" },
  logoutButton: { alignItems: "center", paddingVertical: 12, marginTop: 8 },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
    textDecorationLine: "underline",
  },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  vendorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
  },
  vendorRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  vendorRowAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  vendorRowInfo: { flex: 1 },
  vendorRowName: { fontSize: 15, fontWeight: "600", color: "#1a1a1a" },
  vendorRowRole: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  sheetDivider: { height: 8, backgroundColor: "#f3f4f6", marginVertical: 8 },
  addIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  addAccountText: { fontSize: 15, color: "#007AFF", fontWeight: "500" },
  cancelBtn: {
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelText: { fontSize: 16, fontWeight: "600", color: "#007AFF" },

  // delete account
  deleteBtn: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  deleteText: {
    fontSize: 14,
    color: "#9ca3af", // muted — not screaming red
    textDecorationLine: "underline",
  },

  // add business modal
  addBizIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  addBizTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 10,
    textAlign: "center",
  },
  addBizBody: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  addBizEmailBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
  },
  addBizEmailText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  addBizBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#007AFF",
    borderRadius: 14,
    marginHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  addBizBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
