import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function useColors() {
	const theme = useColorScheme();

	return colors[theme];
}
