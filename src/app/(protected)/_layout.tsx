import { useAuth } from "@/src/lib/context/AuthContext";
import { OrderProvider } from "@/src/lib/context/order-context";
import { ServicesProvider } from "@/src/lib/context/services-context";
import { VendorProvider } from "@/src/lib/context/vendor-context";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout() {
  const { isLoggedIn, isLoading } = useAuth();

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
      <OrderProvider>
        <ServicesProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ServicesProvider>
      </OrderProvider>
    </VendorProvider>
  );
}
