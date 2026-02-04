import { Layers01Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PuzzleSelector } from "@/components/app/puzzle-selector";
import { PuzzleIcon } from "@/components/icons/puzzle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Text, useColors, View } from "@/components/ui/themed";
import { useSessions } from "@/hooks/use-sessions";
import { useGlobalSettings } from "@/hooks/use-settings";

export function Header() {
  const router = useRouter();
  const colors = useColors();

  const [puzzleModalVisible, setPuzzleModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);

  const { settings, updateSettings } = useGlobalSettings();
  const { sessions, selectedSession, switchSession } = useSessions();

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <>
      <SafeAreaView
        edges={["top"]}
        style={[styles.safeArea, { backgroundColor: colors.secondary }]}
      >
        <View style={[styles.header, { backgroundColor: colors.secondary }]}>
          <IconButton
            icon={Layers01Icon}
            variant="transparent"
            onPress={() => setSessionModalVisible(true)}
          />

          <Button
            variant="transparent"
            onPress={() => setPuzzleModalVisible(true)}
            style={styles.puzzleButton}
            textWrapper={false}
          >
            <PuzzleIcon
              size={24}
              puzzle={settings?.selectedPuzzle}
              color={colors.foreground}
            />
            <Text>{settings?.selectedPuzzle}</Text>
          </Button>

          <IconButton
            icon={Settings02Icon}
            variant="transparent"
            onPress={handleSettings}
          />
        </View>
      </SafeAreaView>

      <PuzzleSelector
        visible={puzzleModalVisible}
        onClose={() => setPuzzleModalVisible(false)}
        selectedPuzzle={settings?.selectedPuzzle}
        onSelect={(puzzle) => {
          updateSettings({ selectedPuzzle: puzzle });
          setPuzzleModalVisible(false);
        }}
      />

      <Dialog
        visible={sessionModalVisible}
        onClose={() => setSessionModalVisible(false)}
      >
        <DialogHeader title="Select Session" />
        <DialogContent>
          <View style={styles.sessionList}>
            {sessions.map((session) => (
              <Button
                key={session.id}
                variant="transparent"
                theme={
                  selectedSession?.id === session.id ? "default" : "accent"
                }
                onPress={() => {
                  switchSession(session);
                  setSessionModalVisible(false);
                }}
                style={styles.sessionButton}
              >
                {session.name}
              </Button>
            ))}
          </View>
        </DialogContent>
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  puzzleButton: {
    flex: 1,
    maxWidth: "100%",
  },
  sessionList: {
    gap: 8,
  },
  sessionButton: {
    justifyContent: "flex-start",
  },
});
