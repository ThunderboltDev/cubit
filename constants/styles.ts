import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  dialogOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0008",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialogContainer: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  h1: {
    fontFamily: "Rubik-Bold",
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: "Rubik-SemiBold",
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: "Rubik-SemiBold",
    fontSize: 20,
    lineHeight: 28,
  },
});
