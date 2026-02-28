import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function BottomTabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(explore)"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "order",
          headerShown: false,
          tabBarLabel: "Orders",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-minus-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "order",
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
