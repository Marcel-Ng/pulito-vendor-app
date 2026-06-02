import { useVendor } from "@/src/lib/context/vendor-context";
import { BANKS } from "@/src/lib/data/banks";
import { bankAccountService } from "@/src/lib/services/bank-account.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
};

export default function BankSettingsScreen() {
  const router = useRouter();
  const { activeVendor } = useVendor();
  const vendorId = activeVendor?.id;

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [resolvedName, setResolvedName] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [bankSearcQuery, setBankSearchQuery] = useState("");
  const [bankSearch, setBankSearch] = useState<any[]>([]);

  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const canSave =
    selectedBank &&
    accountNumber.length >= 10 &&
    !saving &&
    !isResolving &&
    resolvedName &&
    !resolvedName.includes("Could not");

  if (!vendorId) {
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#3B6B44" />
    );
  }

  // Fetch on mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await bankAccountService.getBankAccounts(vendorId);
        setAccounts(res.data);
      } catch (err) {
        console.error("Failed to fetch bank accounts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [vendorId]);

  // Resolve account name when account number or bank changes
  useEffect(() => {
    const resolveAccount = async () => {
      if (accountNumber.length === 10 && selectedBankCode) {
        setIsResolving(true);
        setResolvedName(""); // Reset name while searching
        try {
          // Assuming you'll add this method to your bankAccountService
          const res = await bankAccountService.resolveAccount(
            accountNumber,
            selectedBankCode,
          );
          if (res.data?.account_name) {
            setResolvedName(res.data.account_name);
          }
        } catch (err) {
          console.error("Resolution failed", err);
          setResolvedName("Could not resolve account");
        } finally {
          setIsResolving(false);
        }
      } else {
        setResolvedName("");
      }
    };

    resolveAccount();
  }, [accountNumber, selectedBankCode]);

  useEffect(() => {
    Animated.timing(dropdownAnim, {
      toValue: bankSearch.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [bankSearch.length]);

  if (!activeVendor) return <ActivityIndicator style={{ flex: 1 }} />;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const res = await bankAccountService.addBankAccount(vendorId, {
        bankName: selectedBank,
        accountNumber,
        accountName: resolvedName || "N/A",
      });
      setAccounts((prev) => [...prev, res.data]);
      handleClose();
    } catch (err) {
      console.error("Failed to add bank account", err);
      // show a toast/alert here
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedBank("");
    setAccountNumber("");
    setBankDropdownOpen(false);
    setModalVisible(false);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>Bank Settings</Text>
        </View>

        {accounts.length === 0 ? (
          /* Empty state */
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Add your bank</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Bank cards */
          <View style={styles.cardList}>
            {accounts.map((account) => (
              <View key={account.id}>
                <Text style={styles.fieldLabel}>Bank Name</Text>
                <View style={styles.bankNameBox}>
                  <Text style={styles.bankNameText}>{account.bankName}</Text>
                </View>
                <View style={styles.accountCard}>
                  <Text style={styles.accountLabel}>Account Number</Text>
                  <Text style={styles.accountNumber}>
                    {account.accountNumber}
                  </Text>
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addAnotherBtn}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={16} color="#3B6B44" />
              <Text style={styles.addAnotherText}>Add another bank</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sheet Modal */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ width: "100%" }}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleClose}
          >
            <TouchableOpacity
              style={styles.bottomSheet}
              activeOpacity={1}
              onPress={() => setBankDropdownOpen(false)}
            >
              <View style={styles.sheetHandle} />

              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Add Bank Details</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name="close" size={22} color="#111" />
                </TouchableOpacity>
              </View>

              {/* Bank selector */}
              <Text style={styles.sheetLabel}>Bank</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={(e) => {
                  e.stopPropagation();
                  setBankDropdownOpen((v) => !v);
                }}
              >
                <TextInput
                  value={bankSearcQuery}
                  onChangeText={(text) => {
                    setBankSearchQuery(text.trim());
                    if (bankSearcQuery === "") {
                      setBankSearch([]);
                      return;
                    }
                    const bs = BANKS.filter((b) =>
                      b.name
                        .toLocaleLowerCase()
                        .includes(bankSearcQuery.toLocaleLowerCase()),
                    );
                    setBankSearch(bs);
                  }}
                  placeholder={selectedBank || "Bank name"}
                  style={[styles.dropdownText]}
                />
                <Ionicons name="search-outline" size={20} color="#666" />
              </TouchableOpacity>

              {bankSearch.length > 0 && (
                <Animated.View
                  style={[
                    styles.dropdownMenu,
                    {
                      opacity: dropdownAnim,
                      transform: [
                        {
                          translateY: dropdownAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-8, 0], // slides down 8px as it fades in
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                    {bankSearch.map((bank) => (
                      <TouchableOpacity
                        key={bank.code} // ← use code not index
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedBank(bank.name);
                          setSelectedBankCode(bank.code);
                          setBankSearchQuery(bank.name);
                          setBankSearch([]);
                          setBankDropdownOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{bank.name}</Text>
                        {selectedBank === bank.name && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#3B6B44"
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Animated.View>
              )}

              {/* Account number */}
              <Text style={[styles.sheetLabel, { marginTop: 20 }]}>
                Account Number
              </Text>
              <TextInput
                style={styles.input}
                placeholder="0000000000"
                placeholderTextColor="#bbb"
                keyboardType="number-pad"
                maxLength={10} // Nigerian NUBANs are 10 digits
                value={accountNumber}
                onChangeText={setAccountNumber}
              />

              {/* --- NEW: Resolved Account Name Feedback --- */}
              {(isResolving || resolvedName) && (
                <View
                  style={{
                    marginTop: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  {isResolving ? (
                    <ActivityIndicator
                      size="small"
                      color="#3B6B44"
                      style={{ marginRight: 8 }}
                    />
                  ) : (
                    <Ionicons
                      name={
                        resolvedName.includes("Could not")
                          ? "alert-circle"
                          : "checkmark-circle"
                      }
                      size={16}
                      color={
                        resolvedName.includes("Could not")
                          ? "#d32f2f"
                          : "#3B6B44"
                      }
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: resolvedName.includes("Could not")
                        ? "#d32f2f"
                        : "#3B6B44",
                    }}
                  >
                    {isResolving ? "Verifying..." : resolvedName}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.saveBtn, canSave && styles.saveBtnActive]}
                onPress={handleSave}
                disabled={!canSave} // Prevent accidental taps while resolving
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 24, paddingTop: 60, flexGrow: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 12,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 120,
  },
  emptyText: { fontSize: 16, color: "#aaa", marginBottom: 16 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#3B6B44",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },

  // Cards
  cardList: { gap: 0 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  bankNameBox: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  bankNameText: { fontSize: 15, color: "#222" },
  accountCard: {
    backgroundColor: "#1C2B1E",
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
  },
  accountLabel: { fontSize: 13, color: "#8aab8e", marginBottom: 6 },
  accountNumber: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  addAnotherBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  addAnotherText: { color: "#3B6B44", fontWeight: "600", fontSize: 14 },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  sheetTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  sheetLabel: { fontSize: 13, color: "#555", marginBottom: 8 },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: { fontSize: 15, color: "#222", flex: 1 },
  // placeholderText: { color: "#bbb" },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    marginTop: 4,
    backgroundColor: "#fff",
    zIndex: 99,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  dropdownItemText: { fontSize: 14, color: "#222" },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#222",
  },
  saveBtn: {
    backgroundColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveBtnActive: { backgroundColor: "#3B6B44" },
  saveBtnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  // dropdownSearch: {
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#f0f0f0",
  //   paddingHorizontal: 12,
  //   paddingVertical: 10,
  //   fontSize: 14,
  //   color: "#111",
  // },
});
