import React from "react";
import type { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

type FormFieldProps = {
    label?: string; 
    error?: string; 
    children: ReactNode; 
};

export function FormField({ label, error, children }: FormFieldProps) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            {children}
            {label ? <Text style={styles.label}>{label}</Text> : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    field: { gap: 4 },
    label: { fontSize: 13, fontWeight: "600", color: colors.textMain },
    error: { fontSize: 12, color: colors.error },
});