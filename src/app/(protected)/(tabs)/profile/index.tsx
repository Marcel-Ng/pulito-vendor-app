import React, { useState } from "react";
import {
  Alert,
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
import { router } from "expo-router";
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
  const { logOut } = useAuth();

  if (!activeVendor) {
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
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: activeVendor.avatarBg },
              ]}
            >
              <Text style={styles.avatarEmoji}>{activeVendor.avatarEmoji}</Text>
            </View>
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

          <TouchableOpacity style={styles.vendorRow} activeOpacity={0.7}>
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
});

// import React from "react";
// import {
//   Alert,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import { Icon } from "@/src/component/shared";
// import { router } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";

// // ─── Simple inline icons (swap with @expo/vector-icons if preferred) ──────────
// const ChevronRight = () => (
//   <View
//     style={{
//       width: 20,
//       height: 20,
//       alignItems: "center",
//       justifyContent: "center",
//     }}
//   >
//     <View
//       style={{
//         width: 7,
//         height: 7,
//         borderTopWidth: 2,
//         borderRightWidth: 2,
//         borderColor: "#9ca3af",
//         transform: [{ rotate: "45deg" }],
//       }}
//     />
//   </View>
// );

// type IconName = "store" | "operation" | "bank" | "star" | "person" | "lock";

// // ─── Menu Row ─────────────────────────────────────────────────────────────────
// type MenuRowProps = {
//   icon: IconName;
//   label: string;
//   onPress?: () => void;
//   showDivider?: boolean;
// };

// const MenuRow = ({
//   icon,
//   label,
//   onPress,
//   showDivider = true,
// }: MenuRowProps) => (
//   <>
//     <TouchableOpacity
//       style={styles.menuRow}
//       onPress={onPress}
//       activeOpacity={0.7}
//     >
//       <View style={styles.menuLeft}>
//         <Icon name={icon} />
//         <Text style={styles.menuLabel}>{label}</Text>
//       </View>
//       <ChevronRight />
//     </TouchableOpacity>
//     {showDivider && <View style={styles.divider} />}
//   </>
// );

// // ─── Screen ───────────────────────────────────────────────────────────────────
// export default function ProfileScreen() {
//   const handleLogout = () => {
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Logout",
//         style: "destructive",
//         onPress: () => console.log("Logged out"),
//       },
//     ]);
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
//       <ScrollView
//         contentContainerStyle={styles.scroll}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Avatar + Name */}
//         <View style={styles.profileHeader}>
//           <View style={styles.avatarContainer}>
//             {/* Replace with <Image source={{ uri: '...' }} style={styles.avatar} /> for real logo */}
//             <View style={styles.avatarPlaceholder}>
//               <Text style={styles.avatarEmoji}>👔</Text>
//             </View>
//           </View>
//           <Text style={styles.businessName}>Washerman Laundry Service</Text>
//         </View>

//         {/* Business Section */}
//         <Text style={styles.sectionTitle}>Business</Text>
//         <View style={styles.section}>
//           <MenuRow
//             icon="store"
//             label="Business Profile"
//             onPress={() => router.navigate("/profile/business-profile")}
//           />
//           <MenuRow
//             icon="operation"
//             label="Business Operation"
//             onPress={() => {
//               router.navigate("/profile/business-operation");
//             }}
//           />
//           <MenuRow
//             icon="bank"
//             label="Bank Settings"
//             onPress={() => router.navigate("/profile/bank-settings")}
//           />
//           <MenuRow
//             icon="star"
//             label="Reviews"
//             onPress={() => {}}
//             showDivider={false}
//           />
//         </View>

//         {/* Personal Section */}
//         <Text style={styles.sectionTitle}>Personal</Text>
//         <View style={styles.section}>
//           <MenuRow icon="person" label="Personal Profile" onPress={() => {}} />
//           <MenuRow
//             icon="lock"
//             label="Password Settings"
//             onPress={() => {}}
//             showDivider={false}
//           />
//         </View>

//         {/* Logout */}
//         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   scroll: {
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },
//   // Header
//   profileHeader: {
//     alignItems: "center",
//     paddingVertical: 32,
//   },
//   avatarContainer: {
//     marginBottom: 14,
//   },
//   avatarPlaceholder: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     backgroundColor: "#d4a017",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatar: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//   },
//   avatarEmoji: {
//     fontSize: 40,
//   },
//   businessName: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#1a1a1a",
//     textAlign: "center",
//   },
//   // Sections
//   sectionTitle: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#1a1a1a",
//     marginBottom: 8,
//     marginTop: 8,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   // Menu Row
//   menuRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 18,
//   },
//   menuLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 16,
//   },
//   menuLabel: {
//     fontSize: 16,
//     fontWeight: "400",
//     color: "#1a1a1a",
//   },
//   divider: {
//     height: StyleSheet.hairlineWidth,
//     backgroundColor: "#e5e7eb",
//   },
//   // Logout
//   logoutButton: {
//     alignItems: "center",
//     paddingVertical: 12,
//     marginTop: 8,
//   },
//   logoutText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#dc2626",
//     textDecorationLine: "underline",
//   },
// });
