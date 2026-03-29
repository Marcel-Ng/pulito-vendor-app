import { authService } from "@/src/lib/services/auth-service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email, code } = useLocalSearchParams<{
    email: string;
    code: string;
  }>();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirm;
  const canSubmit = password.length >= 8 && passwordsMatch;

  const handleReset = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await authService.resetPassword(email, code, password);
      Alert.alert("Success", "Password reset successfully.", [
        { text: "Login", onPress: () => router.replace("/auth/login") },
      ]);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to reset password.";
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
          <Text style={styles.backText}>New Password</Text>
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Create new password</Text>
          <Text style={styles.subtitle}>
            Your new password must be at least 8 characters.
          </Text>
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputInner}
            placeholder="Password"
            placeholderTextColor="#bbb"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm */}
        <Text style={styles.label}>Confirm Password</Text>
        <View
          style={[
            styles.inputRow,
            confirm.length > 0 && !passwordsMatch && styles.inputRowError,
          ]}
        >
          <TextInput
            style={styles.inputInner}
            placeholder="Confirm Password"
            placeholderTextColor="#bbb"
            secureTextEntry={!showConfirm}
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity onPress={() => setShowConfirm((v) => !v)}>
            <Ionicons
              name={showConfirm ? "eye-off" : "eye"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {confirm.length > 0 && !passwordsMatch && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.btn, canSubmit && styles.btnActive]}
          onPress={handleReset}
          disabled={!canSubmit || loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Saving..." : "Reset Password"}
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

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  inputRowError: {
    borderColor: "#e53935",
  },
  inputInner: {
    flex: 1,
    fontSize: 15,
    color: "#222",
  },

  errorText: {
    fontSize: 12,
    color: "#e53935",
    marginTop: -14,
    marginBottom: 16,
    marginLeft: 4,
  },

  btn: {
    backgroundColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  btnActive: { backgroundColor: "#3B6B44" },
  btnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
