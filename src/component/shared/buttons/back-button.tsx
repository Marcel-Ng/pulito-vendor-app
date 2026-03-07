import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

type BackButtonProps = {
  onPress?: () => void;
};

export function BackButton({ ...props }: BackButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (props.onPress) {
          props.onPress();
          return;
        }
        router.back();
      }}
    >
      <Ionicons name="arrow-back" size={28} color="#000" />
    </TouchableOpacity>
  );
}
