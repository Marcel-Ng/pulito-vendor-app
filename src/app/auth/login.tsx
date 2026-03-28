import { useAuth } from "@/src/lib/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function LoginScreen() {
  const { isLoggedIn, isLoading, logIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginFormError, setLoginFormError] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleLogin = () => {
    setLoginFormError({});
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Please enter your password";
    }

    if (Object.keys(errors).length > 0) {
      setLoginFormError(errors);
      return;
    }
    logIn(email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Image
                source={{
                  uri: "https://uxwing.com/wp-content/themes/uxwing/download/arrow-direction/thin-arrow-left-icon.svg",
                }}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Login</Text>
            <View style={{ width: 40 }} />
          </View>

          <Text style={styles.welcomeText}>Welcome Back</Text>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {loginFormError.email ? (
            <Text style={styles.errorText}>{loginFormError.email}</Text>
          ) : null}

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          {loginFormError.password ? (
            <Text style={styles.errorText}>{loginFormError.password}</Text>
          ) : null}

          <TouchableOpacity style={styles.forgotLink}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.orText}>Or</Text>

          {/* Social Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("@/src/assets/images/apple-logo.png")}
                style={styles.socialLogo}
                resizeMode="contain"
              />
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => {
                router.navigate("/");
              }}
            >
              <Image
                source={require("@/src/assets/images/google-logo.png")} // Replace with your local asset
                style={styles.socialLogo}
                resizeMode="contain"
              />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupPrefix}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                console.log("navigate to signup");
              }}
            >
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 24, flexGrow: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  backIcon: { width: 24, height: 24 },
  headerText: { fontSize: 18, fontWeight: "600" },
  welcomeText: { fontSize: 28, fontWeight: "bold", marginBottom: 40 },
  label: { fontSize: 16, marginBottom: 8, color: "#333" },
  inputContainer: { position: "relative", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  eyeIcon: { position: "absolute", right: 16, top: 14 },
  forgotLink: { alignSelf: "flex-end", marginBottom: 32 },
  forgotText: { color: "#666", textDecorationLine: "underline" },
  loginButton: {
    backgroundColor: "#1e3a2b",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  loginButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  orText: { textAlign: "center", color: "#999", marginBottom: 24 },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 40,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  socialLogo: { width: 24, height: 24, marginRight: 8 },
  socialText: { fontSize: 16 },
  signupContainer: { flexDirection: "row", justifyContent: "center" },
  signupPrefix: { color: "#666" },
  signupText: {
    color: "#000",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  inputError: {
    borderColor: "#ff4444",
    borderWidth: 2,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
  },
});

export default LoginScreen;
