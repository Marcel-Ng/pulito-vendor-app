import { ServicesProvider } from "@/src/lib/context/services-context";
import { Redirect, Stack } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout() {
  // const { isLoggedIn, isLoading, logIn } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  setTimeout(() => {
    setIsLoggedIn(true);
    setIsLoading(false);
  }, 1000);

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
    <ServicesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ServicesProvider>
  );
}
