import { Cancel01Icon } from "@hugeicons/core-free-icons";
import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text, useColors } from "@/components/ui/themed";

interface AlertDialogProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function AlertDialog({ visible, onClose, children }: AlertDialogProps) {
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

interface AlertDialogHeaderProps
  extends PropsWithChildren, ComponentProps<typeof View> {
  title?: string;
  description?: string;
}

export function AlertDialogHeader({
  children,
  title,
  description,
  ...props
}: AlertDialogHeaderProps) {
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

export function AlertDialogContent({
  children,
  ...props
}: PropsWithChildren<ComponentProps<typeof View>>) {
  return (
    <View style={styles.content} {...props}>
      {children}
    </View>
  );
}

interface AlertDialogFooterProps
  extends PropsWithChildren, ComponentProps<typeof View> {
  cancelLabel?: string;
  onCancel?: () => void;
  showCancel?: boolean;
  action?: ReactNode;
}

export function AlertDialogFooter({
  children,
  cancelLabel = "Cancel",
  onCancel,
  showCancel = true,
  action,
  ...props
}: AlertDialogFooterProps) {
  return (
    <View style={styles.footer} {...props}>
      {showCancel && (
        <Button theme="secondary" onPress={onCancel} icon={Cancel01Icon}>
          {cancelLabel}
        </Button>
      )}
      {children || action}
    </View>
  );
}

export function AlertDialogAction(props: ComponentProps<typeof Button>) {
  return <Button {...props} />;
}

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
    marginVertical: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
});
