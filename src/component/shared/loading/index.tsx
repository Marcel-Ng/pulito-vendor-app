import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoadingVariant =
  | "fullscreen" // replaces the whole screen — page loading
  | "overlay" // sits on top of content — activity in progress
  | "inline"; // inside a section — partial loading

type LoadingProps = {
  variant?: LoadingVariant;
  message?: string;
  visible?: boolean; // only needed for overlay
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Loading({
  variant = "fullscreen",
  message,
  visible = true,
}: LoadingProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (variant === "fullscreen") {
    return (
      <Animated.View style={[styles.fullscreen, { opacity }]}>
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size="large" color="#3B6B44" />
        </View>
        {message && <Text style={styles.message}>{message}</Text>}
      </Animated.View>
    );
  }

  if (variant === "inline") {
    return (
      <Animated.View style={[styles.inline, { opacity }]}>
        <ActivityIndicator size="small" color="#3B6B44" />
        {message && <Text style={styles.inlineMessage}>{message}</Text>}
      </Animated.View>
    );
  }

  // overlay
  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.overlayBackdrop, { opacity }]}>
        <View style={styles.overlayCard}>
          <ActivityIndicator size="large" color="#3B6B44" />
          {message && <Text style={styles.overlayMessage}>{message}</Text>}
        </View>
      </Animated.View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Fullscreen
  fullscreen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  spinnerWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f0f7f2",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    maxWidth: 240,
  },

  // Inline
  inline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 10,
  },
  inlineMessage: {
    fontSize: 14,
    color: "#6b7280",
  },

  // Overlay
  overlayBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 16,
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  overlayMessage: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
    textAlign: "center",
    maxWidth: 200,
  },
});
