import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* <AuthProvider> */}

      {/* Add safearea view here */}
      <StatusBar style="auto" />

      <Stack>
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>

      {/* </AuthProvider> */}
    </SafeAreaProvider>
  );
}
