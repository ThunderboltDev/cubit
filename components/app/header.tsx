import {
  CubeIcon,
  Layers01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

const PUZZLES = [
  "2x2",
  "3x3",
  "4x4",
  "5x5",
  "6x6",
  "7x7",
  "Pyraminx",
  "Megaminx",
  "Skewb",
  "Square-1",
  "Clock",
];

const SESSIONS = ["Default", "Blindfolded", "One-Handed", "Multi-Blind"];

export function Header() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [puzzleModalVisible, setPuzzleModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [selectedPuzzle, setSelectedPuzzle] = useState("3x3");
  const [selectedSession, setSelectedSession] = useState("Default");

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <>
      <View
        style={[
          styles.header,
          { backgroundColor: colors[colorScheme].background },
        ]}
      >
        <TouchableOpacity
          onPress={() => setSessionModalVisible(true)}
          style={styles.sideButton}
          activeOpacity={0.7}
        >
          <HugeiconsIcon
            icon={Layers01Icon}
            size={22}
            color={colors[colorScheme].foreground}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setPuzzleModalVisible(true)}
          style={[
            styles.puzzleButton,
            { backgroundColor: colors[colorScheme].secondary },
          ]}
          activeOpacity={0.7}
        >
          <HugeiconsIcon
            icon={CubeIcon}
            size={20}
            color={colors[colorScheme].accent}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSettings}
          style={styles.sideButton}
          activeOpacity={0.7}
        >
          <HugeiconsIcon
            icon={Settings02Icon}
            size={22}
            color={colors[colorScheme].foreground}
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={puzzleModalVisible}
        onRequestClose={() => setPuzzleModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setPuzzleModalVisible(false)}
        >
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: colors[colorScheme].secondary,
                borderColor: colors[colorScheme].border,
              },
            ]}
          >
            {PUZZLES.map((puzzle) => (
              <TouchableOpacity
                key={puzzle}
                style={[
                  styles.dropdownItem,
                  selectedPuzzle === puzzle && {
                    backgroundColor: `${colors[colorScheme].accent}20`,
                  },
                ]}
                onPress={() => {
                  setSelectedPuzzle(puzzle);
                  setPuzzleModalVisible(false);
                }}
              >
                <HugeiconsIcon
                  icon={CubeIcon}
                  size={16}
                  color={
                    selectedPuzzle === puzzle ?
                      colors[colorScheme].accent
                    : colors[colorScheme].foreground
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={sessionModalVisible}
        onRequestClose={() => setSessionModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSessionModalVisible(false)}
        >
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: colors[colorScheme].secondary,
                borderColor: colors[colorScheme].border,
              },
            ]}
          >
            {SESSIONS.map((session) => (
              <TouchableOpacity
                key={session}
                style={[
                  styles.dropdownItem,
                  selectedSession === session && {
                    backgroundColor: `${colors[colorScheme].accent}20`,
                  },
                ]}
                onPress={() => {
                  setSelectedSession(session);
                  setSessionModalVisible(false);
                }}
              >
                <HugeiconsIcon
                  icon={Layers01Icon}
                  size={16}
                  color={
                    selectedSession === session ?
                      colors[colorScheme].accent
                    : colors[colorScheme].foreground
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    height: 60,
  },
  sideButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  puzzleButton: {
    flex: 1,
    maxWidth: 200,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    width: 200,
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 12,
  },
});
