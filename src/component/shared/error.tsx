import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ErrorComponentProps = {
  refetch?: () => void;
  errorText?: string;
};

// use AI to find thee best name for this component
export default function ErrorComponent({
  refetch,
  errorText,
}: ErrorComponentProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.errorState}>
        <Text style={styles.errorText}>
          {" "}
          {errorText || "Failed to load content an error occured"}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  errorText: { color: "#999", fontSize: 15 },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#FFD700",
    borderRadius: 20,
  },
  retryText: { fontWeight: "600", color: "#000" },
});
