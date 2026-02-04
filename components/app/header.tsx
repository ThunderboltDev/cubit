import {
  Delete02Icon,
  FloppyDiskIcon,
  PencilEdit01Icon,
  Settings02Icon,
  UserAdd01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PuzzleSelector } from "@/components/app/puzzle-selector";
import { PuzzleIcon } from "@/components/icons/puzzle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Text, useColors } from "@/components/ui/themed";
import { useSessions } from "@/hooks/use-sessions";
import { useGlobalSettings } from "@/hooks/use-settings";

export function Header() {
  const router = useRouter();
  const colors = useColors();

  const [puzzleModalVisible, setPuzzleModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [upsertModalVisible, setUpsertModalVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);

  const [sessionName, setSessionName] = useState("");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const { settings, updateSettings } = useGlobalSettings();

  const {
    sessions,
    selectedSession,
    switchSession,
    createSession,
    deleteSession,
    renameSession,
  } = useSessions();

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleUpsertSession = () => {
    if (!sessionName.trim()) return;

    if (editingSessionId) {
      renameSession(editingSessionId, sessionName);
    } else {
      createSession(sessionName);
    }

    setSessionName("");
    setEditingSessionId(null);
    setUpsertModalVisible(false);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete);
      setSessionToDelete(null);
      setDeleteAlertVisible(false);
    }
  };

  return (
    <>
      <SafeAreaView
        edges={["top"]}
        style={[styles.safeArea, { backgroundColor: colors.secondary }]}
      >
        <View style={[styles.header, { backgroundColor: colors.secondary }]}>
          <IconButton
            icon={UserIcon}
            variant="transparent"
            onPress={() => setSessionModalVisible(true)}
          />

          <Button
            variant="transparent"
            onPress={() => setPuzzleModalVisible(true)}
            style={styles.puzzleButton}
            textWrapper={false}
          >
            <View style={styles.puzzleHeader}>
              <PuzzleIcon
                size={24}
                puzzle={settings?.selectedPuzzle}
                color={colors.foreground}
              />
              <Text style={styles.puzzleText}>{settings?.selectedPuzzle}</Text>
            </View>
            <Text variant="muted" style={{ fontSize: 10 }}>
              {selectedSession?.name}
            </Text>
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
        <DialogContent>
          <DialogHeader title="Sessions" />
          <View style={styles.sessionList}>
            {sessions.map((session) => {
              const isSelected = selectedSession?.id === session.id;

              return (
                <View
                  key={session.id}
                  style={[
                    styles.sessionRow,
                    {
                      backgroundColor:
                        colors.accent + (isSelected ? "20" : "00"),
                    },
                  ]}
                >
                  <Button
                    variant="transparent"
                    theme="default"
                    onPress={() => {
                      switchSession(session);
                      setSessionModalVisible(false);
                    }}
                    style={styles.sessionButton}
                  >
                    {session.name}
                  </Button>

                  <IconButton
                    icon={PencilEdit01Icon}
                    variant="transparent"
                    onPress={() => {
                      setEditingSessionId(session.id);
                      setSessionName(session.name);
                      setSessionModalVisible(false);
                      setUpsertModalVisible(true);
                    }}
                  />

                  {!isSelected && sessions.length > 1 && (
                    <IconButton
                      theme="danger"
                      variant="transparent"
                      icon={Delete02Icon}
                      onPress={() => {
                        setSessionToDelete(session.id);
                        setDeleteAlertVisible(true);
                      }}
                    />
                  )}
                </View>
              );
            })}

            <Button
              theme="accent"
              icon={UserAdd01Icon}
              onPress={() => {
                setEditingSessionId(null);
                setSessionName("");
                setSessionModalVisible(false);
                setUpsertModalVisible(true);
              }}
            >
              New Session
            </Button>
          </View>
        </DialogContent>
      </Dialog>

      <AlertDialog
        visible={upsertModalVisible}
        onClose={() => {
          setUpsertModalVisible(false);
          setEditingSessionId(null);
          setSessionName("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader
            title={editingSessionId ? "Rename Session" : "New Session"}
          />
          <Input
            placeholder="Session Name"
            value={sessionName}
            onChangeText={setSessionName}
            maxLength={20}
            autoFocus
          />
          <Text variant="muted" style={styles.charCount}>
            {sessionName.length}/20
          </Text>
          <AlertDialogFooter
            onCancel={() => {
              setUpsertModalVisible(false);
              setEditingSessionId(null);
              setSessionName("");
            }}
          >
            <AlertDialogAction
              theme="accent"
              onPress={handleUpsertSession}
              disabled={!sessionName.trim()}
              icon={editingSessionId ? FloppyDiskIcon : UserAdd01Icon}
            >
              {editingSessionId ? "Save" : "Create"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        visible={deleteAlertVisible}
        onClose={() => setDeleteAlertVisible(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader
            title="Delete Session?"
            description="This will permanently delete this session and all its recorded times."
          />
          <AlertDialogFooter onCancel={() => setDeleteAlertVisible(false)}>
            <AlertDialogAction onPress={confirmDelete} icon={Delete02Icon}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
    flexDirection: "column",
    alignItems: "center",
    gap: 1,
  },
  puzzleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  puzzleText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  sessionList: {
    gap: 8,
    paddingBottom: 16,
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    gap: 4,
  },
  sessionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  charCount: {
    fontSize: 10,
    textAlign: "right",
    paddingRight: 4,
    marginTop: -12,
  },
});
