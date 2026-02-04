import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useColors } from "@/components/ui/themed";

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ visible, onClose, children }: DialogProps) {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.container,
            {
              backgroundColor: colors.secondary,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface DialogHeaderProps
  extends PropsWithChildren, ComponentProps<typeof View> {
  title?: string;
  description?: string;
}

export function DialogHeader({
  children,
  title,
  description,
  ...props
}: DialogHeaderProps) {
  if (children)
    return (
      <View style={styles.header} {...props}>
        {children}
      </View>
    );

  return (
    <View style={styles.header} {...props}>
      {title && <Text variant="h3">{title}</Text>}
      {description && <Text variant="muted">{description}</Text>}
    </View>
  );
}

export function DialogContent({
  children,
  ...props
}: PropsWithChildren<ComponentProps<typeof View>>) {
  return (
    <View style={styles.content} {...props}>
      {children}
    </View>
  );
}

export function DialogFooter({
  children,
  ...props
}: PropsWithChildren<ComponentProps<typeof View>>) {
  return (
    <View style={styles.footer} {...props}>
      {children}
    </View>
  );
}

import { Text } from "@/components/ui/themed";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 16,
  },
  header: {
    gap: 8,
    marginBottom: 4,
  },
  content: {
    gap: 16,
    marginVertical: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
});
