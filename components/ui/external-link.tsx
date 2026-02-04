import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import type { ComponentProps } from "react";
import { Platform } from "react-native";
import { useColors } from "@/components/ui/themed";

export function ExternalLink(
	props: Omit<ComponentProps<typeof Link>, "href"> & { href: string }
) {
	const colors = useColors();

	return (
		<Link
			target="_blank"
			style={{
				color: colors.accent,
			}}
			{...props}
			// @ts-expect-error: External URLs are not typed.
			href={props.href}
			onPress={(e) => {
				if (Platform.OS !== "web") {
					e.preventDefault();
					WebBrowser.openBrowserAsync(props.href as string);
				}
			}}
		/>
	);
}
