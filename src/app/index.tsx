import { router } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Auth() {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("@/src/assets/images/login-bg-image.png")}
        style={styles.background}
        resizeMode="cover" // or "contain", "stretch"
      >
        <View style={styles.content}>
          <Text style={styles.text}>
            Find The Best Laundry & Car Wash Services
          </Text>

          <Text style={styles.textSmall}>
            Find Best Laundry & Car Wash Service
          </Text>

          <View style={styles.loginBtnsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // router.navigate("/auth/login");
                router.navigate("/login");
              }}
            >
              <Text style={styles.Btntext}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonFilled}
              onPress={() => {
                console.log("navigate to signup");
              }}
            >
              <Text style={styles.BtntextFilled}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    paddingTop: 37,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 20,
    elevation: 8, // Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 5,
  },
  text: {
    color: "#000",
    fontSize: 28,
    fontWeight: 500,
  },
  textSmall: {
    color: "#737373",
    fontSize: 16,

    // screen specific
    marginTop: 24,
  },

  loginBtnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // space between buttons
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },

  button: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderColor: "#C0A006",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5, // adds spacing on left & right
  },

  buttonFilled: {
    flex: 1,
    backgroundColor: "#324D36",
    paddingVertical: 12,
    borderColor: "#324D36",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  Btntext: {
    color: "#020202",
    fontSize: 16,
    fontWeight: "600",
  },
  BtntextFilled: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
