import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

type ButtonVariant = "primary" | "secondary";
    
type ButtonProps = {
    children: string; 
    variant?: ButtonVariant; 
    onPress?: () => void;
    disabled?: boolean;
    };

export function Button({ children, variant = "primary", onPress, disabled = false }: ButtonProps) 
{
    const isPrimary = variant === "primary";

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={(state) => {
                const hovered = (state as { hovered?: boolean }).hovered; // наведение мышью (в браузере)
                return [
                    styles.base,
                    isPrimary ? styles.primary : styles.secondary,
                    hovered && (isPrimary ? styles.primaryHovered : styles.secondaryHovered),
                    state.pressed && (isPrimary ? styles.primaryPressed : styles.secondaryPressed),
                    disabled && styles.disabled,
                ];
            }}
        >
            <Text style={[styles.text, disabled && styles.textDisabled]}>{children}</Text>
    </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        alignSelf: "stretch",
        height: 56,
        paddingHorizontal: 24,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    primary: {
        backgroundColor: colors.default,
        shadowColor: "#959595",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
    },
    secondary: {
        backgroundColor: colors.background,
        borderWidth: 2,
        borderColor: colors.default,
    },
    primaryHovered: { backgroundColor: colors.hover },
    primaryPressed: { backgroundColor: colors.pressed },
    secondaryHovered: { borderColor: colors.hover },
    secondaryPressed: { borderColor: colors.pressed },
    disabled: {
        backgroundColor: colors.disable,
        borderColor: colors.disable,
        shadowOpacity: 0,
        elevation: 0,
    },
    text: { fontSize: 18, fontWeight: "500", color: colors.textMain },
    textDisabled: { color: colors.textSecondary },
});