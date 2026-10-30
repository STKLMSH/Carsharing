import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

type Props = {
  title: string;
  onPress?: () => void;
};

// Кнопка с состояниями 
export function PrimaryButton({ title, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={(state) => {
        const hovered = (state as { hovered?: boolean }).hovered;
        return [
          styles.button,
          hovered && { backgroundColor: colors.hover },
          state.pressed && { backgroundColor: colors.pressed },
        ];
      }}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "stretch",
    height: 56,
    paddingHorizontal: 48,
    backgroundColor: colors.default,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#959595",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.textMain,
  },
});
