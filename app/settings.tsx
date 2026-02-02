import { StyleSheet } from "react-native";
import { Text, View } from "@/components/ui/themed";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Rubik-SemiBold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
