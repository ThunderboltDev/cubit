import type { ComponentProps, ReactNode } from "react";
import {
	type StyleProp,
	StyleSheet,
	TextInput,
	type ViewStyle,
} from "react-native";
import { View } from "@/components/ui/view";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface InputProps extends ComponentProps<typeof TextInput> {
	placeholder?: string;
	value?: string;
	onChangeText?: (text: string) => void;
	secureTextEntry?: boolean;
	keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	editable?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
	placeholder,
	value,
	onChangeText,
	secureTextEntry,
	keyboardType,
	autoCapitalize,
	editable = true,
	containerStyle,
	style,
	leftIcon,
	rightIcon,
	...props
}: InputProps) {
	const colorScheme = useColorScheme();
	const color = colors[colorScheme];

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: color.input,
					borderColor: color.border,
					opacity: editable ? 1 : 0.5,
				},
				containerStyle,
			]}
		>
			{leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
			<TextInput
				placeholder={placeholder}
				placeholderTextColor={color.mutedForeground}
				value={value}
				onChangeText={onChangeText}
				secureTextEntry={secureTextEntry}
				keyboardType={keyboardType}
				autoCapitalize={autoCapitalize}
				editable={editable}
				style={[
					styles.input,
					{
						color: color.foreground,
						paddingLeft: leftIcon ? 8 : 12,
						paddingRight: rightIcon ? 8 : 12,
					},
				]}
				{...props}
			/>
			{rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 8,
		borderWidth: 1,
		height: 40,
		minWidth: 0,
	},
	input: {
		flex: 1,
		height: 40,
		fontFamily: "Rubik-Regular",
		fontSize: 14,
		paddingVertical: 0,
	},
	leftIcon: {
		paddingLeft: 12,
	},
	rightIcon: {
		paddingRight: 12,
	},
});
