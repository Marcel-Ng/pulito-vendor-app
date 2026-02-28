import { useAuth } from "@/src/lib/AuthContext";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout() {
  const { isLoggedIn, isLoading, logIn } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tab)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
