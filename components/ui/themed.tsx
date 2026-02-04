import {
  Text as DefaultText,
  View as DefaultView,
  type TextStyle,
} from "react-native";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export function useColors() {
  const theme = useColorScheme();

  return colors[theme];
}

type TextVariant =
  | "default"
  | "h1"
  | "h2"
  | "h3"
  | "strong"
  | "muted"
  | "paragraph"
  | "accent"
  | "danger"
  | "success"
  | "gold";

export type TextProps = ThemeProps &
  DefaultText["props"] & {
    variant?: TextVariant;
  };

export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, variant = "default", ...otherProps } = props;

  const colors = useColors();

  const getColor = (): string => {
    switch (variant) {
      case "h1":
      case "h2":
      case "h3":
        return colors.foreground;
      case "default":
      case "strong":
        return colors.secondaryForeground;
      case "muted":
      case "paragraph":
        return colors.mutedForeground;
      case "accent":
        return colors.accent;
      case "danger":
        return colors.danger;
      case "success":
        return colors.success;
      case "gold":
        return colors.gold;
      default:
        return colors.foreground;
    }
  };

  const getFontSize = (): number => {
    switch (variant) {
      case "h1":
        return 24;
      case "h2":
        return 20;
      case "h3":
        return 16;
      case "muted":
        return 12;
      default:
        return 16;
    }
  };

  const getFontFamily = (): string => {
    switch (variant) {
      case "h1":
      case "h2":
      case "h3":
        return "Rubik-Bold";
      case "strong":
        return "Rubik-SemiBold";
      default:
        return "Rubik-Regular";
    }
  };

  const getLineHeight = (): number => {
    const fontSize = getFontSize();

    if (variant === "h1") return fontSize * 1.2;
    if (variant === "h2") return fontSize * 1.2;
    if (variant === "h3") return fontSize * 1.2;
    if (variant === "paragraph") return fontSize * 1.5;

    return fontSize * 1.4;
  };

  const textStyle: TextStyle = {
    color: getColor(),
    fontSize: getFontSize(),
    fontFamily: getFontFamily(),
    lineHeight: getLineHeight(),
  };

  return <DefaultText style={[textStyle, style]} {...otherProps} />;
}

export function View({ style, ...props }: ViewProps) {
  const colors = useColors();

  return (
    <DefaultView
      style={[{ backgroundColor: colors.background }, style]}
      {...props}
    />
  );
}
