import { authService } from "@/src/lib/services/auth-service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = email.includes("@") && email.includes(".");

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      router.push({ pathname: "/auth/verify-otp", params: { email } });
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to send code. Try again.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
          <Text style={styles.backText}>Forgot Password</Text>
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Reset your password</Text>
          <Text style={styles.subtitle}>
            Enter the email address associated with your account and we'll send
            you a 6-digit code.
          </Text>
        </View>

        {/* Email input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.btn, canSubmit && styles.btnActive]}
          onPress={handleSubmit}
          disabled={!canSubmit || loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Sending..." : "Send Code"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 36,
  },
  backText: { fontSize: 16, fontWeight: "600", color: "#111" },

  titleBlock: { marginBottom: 32 },
  title: { fontSize: 26, fontWeight: "700", color: "#111", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#777", lineHeight: 22 },

  label: { fontSize: 14, fontWeight: "500", color: "#111", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#222",
    marginBottom: 24,
  },

  btn: {
    backgroundColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnActive: { backgroundColor: "#3B6B44" },
  btnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
