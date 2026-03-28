import { useAuth } from "@/src/lib/context/AuthContext";
import { ServicesProvider } from "@/src/lib/context/services-context";
import { VendorProvider } from "@/src/lib/context/vendor-context";
import { Redirect, Stack } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout() {
  const { isLoggedIn } = useAuth();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href={"/auth/login"} />;
  }

  return (
    <VendorProvider>
      <ServicesProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ServicesProvider>
    </VendorProvider>
  );
}
