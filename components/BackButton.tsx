import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

type Props = { onPress: () => void };

// кнопка «Назад»
export function BackButton({ onPress }: Props) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name="arrow-back" size={20} color={colors.textMain} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F2F3",
    justifyContent: "center",
    alignItems: "center",
  },
});
