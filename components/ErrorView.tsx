import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "./Button";
import { colors } from "../theme";

type ErrorViewProps = {
    message: string;
    onRetry: () => void;
};

// Блок ошибки загрузки с кнопкой «Повторить»
export function ErrorView({ message, onRetry }: ErrorViewProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Не удалось загрузить данные</Text>
            <Text style={styles.message}>{message}</Text>
            <Button onPress={onRetry}>Повторить</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignSelf: "stretch", alignItems: "center", gap: 8, padding: 16 },
    title: { fontSize: 16, fontWeight: "700", color: colors.textMain, textAlign: "center" },
    message: { fontSize: 13, color: colors.textSecondary, textAlign: "center" },
});