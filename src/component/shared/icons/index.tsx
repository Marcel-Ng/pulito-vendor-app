import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const Icon = ({
  name,
  size = 28,
  color = "#1a1a1a",
}: {
  name: string;
  size?: number;
  color?: string;
}) => {
  const s = { width: size, height: size };
  // Simplified placeholder icons — swap with real icons as needed
  const icons: Record<string, React.ReactNode> = {
    orders: (
      <View
        style={[
          s,
          {
            borderWidth: 2,
            borderColor: color,
            borderRadius: 6,
            padding: 3,
            justifyContent: "space-between",
          },
        ]}
      >
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              height: 2,
              backgroundColor: color,
              borderRadius: 1,
              width: i === 2 ? "60%" : "100%",
            }}
          />
        ))}
      </View>
    ),
    pickup: (
      <View
        style={[
          s,
          {
            borderWidth: 2,
            borderColor: color,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <View
          style={{
            width: size * 0.5,
            height: size * 0.35,
            borderWidth: 2,
            borderColor: color,
            borderRadius: 3,
          }}
        />
      </View>
    ),
    ongoing: (
      <View
        style={[
          s,
          {
            borderWidth: 2,
            borderColor: color,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: 4,
          },
        ]}
      >
        <View
          style={{
            width: size * 0.55,
            height: 3,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      </View>
    ),
    ready: (
      <View
        style={[
          s,
          {
            borderWidth: 2,
            borderColor: color,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <View
          style={{
            width: size * 0.45,
            height: size * 0.45,
            borderWidth: 2,
            borderColor: color,
            borderRadius: 2,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#22c55e",
          }}
        />
      </View>
    ),
    delivery: (
      <View
        style={[
          s,
          {
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 2,
          },
        ]}
      >
        <View
          style={{
            width: size * 0.55,
            height: size * 0.45,
            borderWidth: 2,
            borderColor: color,
            borderRadius: 4,
          }}
        />
        <View style={{ flexDirection: "row", gap: 4, marginBottom: 1 }}>
          {[0, 1].map((i) => (
            <View
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                borderWidth: 2,
                borderColor: color,
              }}
            />
          ))}
        </View>
      </View>
    ),
    completed: (
      <View style={[s, { alignItems: "center", justifyContent: "center" }]}>
        <View
          style={{
            width: size * 0.85,
            height: size * 0.85,
            borderWidth: 2,
            borderColor: color,
            borderRadius: size * 0.15,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: size * 0.35,
            height: 2,
            backgroundColor: color,
            transform: [
              { rotate: "-45deg" },
              { translateX: -3 },
              { translateY: 3 },
            ],
          }}
        />
        <View
          style={{
            position: "absolute",
            width: size * 0.55,
            height: 2,
            backgroundColor: color,
            transform: [{ rotate: "45deg" }, { translateX: 5 }],
          }}
        />
      </View>
    ),
    rejected: (
      <View
        style={[
          s,
          {
            borderWidth: 2,
            borderColor: color,
            borderRadius: size / 2,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text
          style={{
            fontSize: size * 0.5,
            color,
            fontWeight: "700",
            lineHeight: size * 0.6,
          }}
        >
          !
        </Text>
      </View>
    ),
    eye: <MaterialCommunityIcons name="eye" size={size} color={color} />,
    eyeClose: (
      <MaterialCommunityIcons name="eye-off" size={size} color={color} />
    ),
  };
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icons[name]}
    </View>
  );
};
