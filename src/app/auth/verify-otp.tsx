import { authService } from "@/src/lib/services/auth-service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const inputs = useRef<(TextInput | null)[]>([]);

  const filled = otp.every((d) => d !== "");

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (value: string, index: number) => {
    // Only allow single digit
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    // Auto-advance
    if (digit && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputs.current[0]?.focus();
    try {
      await authService.requestPasswordReset(email);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to resend code.";
      Alert.alert("Error", message);
    }
  };

  const handleVerify = async () => {
    if (!filled) return;
    setLoading(true);
    try {
      const code = otp.join("");
      await authService.verifyOtp(email, code);
      router.push({
        pathname: "/auth/reset-password",
        params: { email, code },
      });
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid or expired code.";
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
          <Text style={styles.backText}>Verify Code</Text>
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Enter the code</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{" "}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>
        </View>

        {/* OTP inputs */}
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, i)
              }
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive the code? </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.countdown}>Resend in {countdown}s</Text>
          )}
        </View>

        {/* Verify button */}
        <TouchableOpacity
          style={[styles.btn, filled && styles.btnActive]}
          onPress={handleVerify}
          disabled={!filled || loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Verifying..." : "Verify"}
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

  titleBlock: { marginBottom: 36 },
  title: { fontSize: 26, fontWeight: "700", color: "#111", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#777", lineHeight: 22 },
  emailHighlight: { color: "#111", fontWeight: "600" },

  otpRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginBottom: 24,
  },
  otpBox: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },
  otpBoxFilled: {
    borderColor: "#3B6B44",
    backgroundColor: "#f0f7f1",
  },

  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  resendLabel: { fontSize: 14, color: "#777" },
  resendLink: { fontSize: 14, color: "#3B6B44", fontWeight: "600" },
  countdown: { fontSize: 14, color: "#aaa" },

  btn: {
    backgroundColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnActive: { backgroundColor: "#3B6B44" },
  btnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
