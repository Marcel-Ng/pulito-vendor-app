import { useVendor } from "@/src/lib/context/vendor-context";
import { useVendorBalance } from "@/src/lib/hooks/vendor-hook";
import {
  BankAccount,
  bankAccountService,
} from "@/src/lib/services/bank-account.service";
import { payoutService } from "@/src/lib/services/payout-service";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatNGN(value: number): string {
  return `NGN ${value.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

function parseAmount(value: string): number {
  return parseFloat(value.replace(/,/g, "")) || 0;
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function RequestPayoutScreen() {
  const router = useRouter();
  const { activeVendor } = useVendor();
  const vendorId = activeVendor?.id ?? "";

  // const [availableBalance, setAvailableBalance] = useState(
  //   activeVendor?.balance ?? 0,
  // );

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null,
  );
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const [amountInput, setAmountInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // const [availableBalance, setAvailableBalance] = useState<number>(0);
  const queryClient = useQueryClient();

  const { data: vendorBalance, isLoading: loadingBalance } = useVendorBalance();
  const availableBalance = (vendorBalance?.balance ?? 0) / 100;
  const amount = parseAmount(amountInput);

  const canSubmit =
    selectedAccount !== null && amount > 0 && amount <= availableBalance;

  // Fetch bank accounts
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await bankAccountService.getBankAccounts(vendorId);
        setBankAccounts(res.data);
        if (res.data.length === 1) setSelectedAccount(res.data[0]);
      } catch (err) {
        console.error("Failed to load bank accounts", err);
      } finally {
        setLoadingAccounts(false);
      }
    };
    // setAvailableBalance(vendorBalance?.balance ?? 0);
    if (vendorId) fetch();
  }, [vendorId]);

  const handleUseFullBalance = () => {
    setAmountInput(availableBalance.toString());
  };

  const handleSubmit = async () => {
    if (!canSubmit || !selectedAccount) return;
    setSubmitting(true);
    try {
      await payoutService.requestPayout(vendorId, {
        amount: Math.round(amount * 100), // convert to kobo
        bankAccountId: selectedAccount.id,
      });

      queryClient.invalidateQueries({
        queryKey: ["vendorBalance", vendorId],
      });
      Alert.alert("Success", "Payout request submitted successfully.", [
        { text: "Done", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to submit payout request.";
      Alert.alert("Error", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
          <Text style={styles.backText}>Request Payout</Text>
        </TouchableOpacity>

        {/* Balance card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          {loadingBalance ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.balanceAmount}>
              {formatNGN(availableBalance)}
            </Text>
          )}
        </View>

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <View style={styles.amountRow}>
          <View style={styles.amountInputWrapper}>
            <Text style={styles.currencyPrefix}>NGN</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#bbb"
              keyboardType="numeric"
              value={amountInput}
              onChangeText={setAmountInput}
            />
          </View>
          <TouchableOpacity
            style={styles.maxBtn}
            onPress={handleUseFullBalance}
          >
            <Text style={styles.maxBtnText}>Use Max</Text>
          </TouchableOpacity>
        </View>
        {amount > availableBalance && (
          <Text style={styles.errorText}>Amount exceeds available balance</Text>
        )}

        {/* Bank account selector */}
        <Text style={[styles.label, { marginTop: 24 }]}>
          Pay to Bank Account
        </Text>

        {loadingAccounts ? (
          <ActivityIndicator color="#3B6B44" style={{ marginTop: 8 }} />
        ) : bankAccounts.length === 0 ? (
          <View style={styles.noAccountBox}>
            <Text style={styles.noAccountText}>
              No bank accounts found.{" "}
              <Text
                style={styles.noAccountLink}
                onPress={() =>
                  router.push("/(protected)/(tabs)/profile/bank-settings")
                }
              >
                Add one in Bank Settings.
              </Text>
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setAccountDropdownOpen((v) => !v)}
            >
              <View style={styles.dropdownContent}>
                {selectedAccount ? (
                  <View>
                    <Text style={styles.dropdownBankName}>
                      {selectedAccount.bankName}
                    </Text>
                    <Text style={styles.dropdownAccountNumber}>
                      {selectedAccount.accountNumber}
                      {selectedAccount.accountName
                        ? ` · ${selectedAccount.accountName}`
                        : ""}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.dropdownPlaceholder}>
                    Select bank account
                  </Text>
                )}
              </View>
              <Ionicons
                name={accountDropdownOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            {accountDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {bankAccounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedAccount(account);
                      setAccountDropdownOpen(false);
                    }}
                  >
                    <View>
                      <Text style={styles.dropdownBankName}>
                        {account.bankName}
                      </Text>
                      <Text style={styles.dropdownAccountNumber}>
                        {account.accountNumber}
                        {account.accountName ? ` · ${account.accountName}` : ""}
                      </Text>
                    </View>
                    {selectedAccount?.id === account.id && (
                      <Ionicons name="checkmark" size={18} color="#3B6B44" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.btn, canSubmit && styles.btnActive, { marginTop: 40 }]}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Request Payout</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  backText: { fontSize: 16, fontWeight: "600", color: "#111" },

  // Balance card
  balanceCard: {
    backgroundColor: "#1C2B1E",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    alignItems: "center",
  },
  balanceLabel: { fontSize: 13, color: "#8aab8e", marginBottom: 8 },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },

  // Amount
  label: { fontSize: 14, fontWeight: "500", color: "#111", marginBottom: 8 },
  amountRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  amountInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 8,
  },
  currencyPrefix: { fontSize: 15, color: "#888", fontWeight: "500" },
  amountInput: { flex: 1, fontSize: 15, color: "#222" },
  maxBtn: {
    backgroundColor: "#f0f7f1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#c8e0cc",
  },
  maxBtnText: { fontSize: 14, fontWeight: "600", color: "#3B6B44" },
  errorText: { fontSize: 12, color: "#e53935", marginTop: 6 },

  // Dropdown
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
  dropdownContent: { flex: 1 },
  dropdownPlaceholder: { fontSize: 15, color: "#bbb" },
  dropdownBankName: { fontSize: 15, fontWeight: "600", color: "#222" },
  dropdownAccountNumber: { fontSize: 13, color: "#777", marginTop: 2 },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    marginTop: 4,
    backgroundColor: "#fff",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },

  // No accounts
  noAccountBox: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#fafafa",
  },
  noAccountText: { fontSize: 14, color: "#777", lineHeight: 20 },
  noAccountLink: { color: "#3B6B44", fontWeight: "600" },

  // Button
  btn: {
    backgroundColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnActive: { backgroundColor: "#3B6B44" },
  btnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
