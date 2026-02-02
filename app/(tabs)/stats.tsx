import { StyleSheet } from "react-native";
import { Text, View } from "@/components/app/themed";

export default function Statistics() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics</Text>
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
