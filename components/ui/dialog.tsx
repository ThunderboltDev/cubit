import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColors } from "@/hooks/use-colors";

interface DialogProps extends ComponentProps<typeof Modal> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: ReactNode;
	onClose?: () => void;
}

export function Dialog({
	open,
	onOpenChange,
	children,
	onClose,
	...props
}: DialogProps) {
	const colors = useColors();

	const handleClose = () => {
		onClose?.();
		onOpenChange(false);
	};

	return (
		<Modal
			visible={open}
			transparent
			animationType="fade"
			onRequestClose={handleClose}
			{...props}
		>
			<Pressable style={styles.overlay} onPress={handleClose}>
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

interface DialogHeaderProps extends ComponentProps<typeof View> {}

export function DialogHeader({ children, ...props }: DialogHeaderProps) {
	return (
		<View style={styles.header} {...props}>
			{children}
		</View>
	);
}

interface DialogTitleProps extends ComponentProps<typeof Text> {}

export function DialogTitle({ children, ...props }: DialogTitleProps) {
	return (
		<Text size={16} weight="bold" {...props}>
			{children}
		</Text>
	);
}

interface DialogDescriptionProps extends ComponentProps<typeof Text> {}

export function DialogDescription({
	children,
	...props
}: DialogDescriptionProps) {
	return (
		<Text theme="muted" size={14} {...props}>
			{children}
		</Text>
	);
}

export function DialogBody({
	children,
	...props
}: PropsWithChildren<ComponentProps<typeof View>>) {
	return (
		<View style={styles.body} {...props}>
			{children}
		</View>
	);
}

interface DialogFooterProps extends ComponentProps<typeof View> {
	onClose?: () => void;
}

export function DialogFooter({
	children,
	onClose,
	...props
}: DialogFooterProps) {
	return (
		<View style={styles.footer} {...props}>
			{children}
		</View>
	);
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
	body: {
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
