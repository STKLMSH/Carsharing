import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

type ButtonVariant = "primary" | "link";
    
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
                const hovered = (state as { hovered?: boolean }).hovered; 
                return [
                    styles.base,
                    isPrimary ? styles.primary : styles.link,
                    hovered && (isPrimary ? styles.primaryHovered : styles.linkActive),
                    state.pressed && (isPrimary ? styles.primaryPressed : styles.linkActive),
                    disabled && styles.disabled,
                ];
            }}
        >
            <Text style={[isPrimary ? styles.text : styles.linkText, disabled && styles.textDisabled]}>{children}</Text>
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
        shadowColor: colors.shadow2,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
    },
    primaryHovered: { backgroundColor: colors.hover },
    primaryPressed: { backgroundColor: colors.pressed },
    disabled: {
        backgroundColor: colors.disable,
        borderColor: colors.disable,
        shadowOpacity: 0,
        elevation: 0,
    },
    link: {
        height: 40,
    },
    linkActive: { 
        opacity: 0.6 
    }, 
    linkText: { 
        fontSize: 16, 
        fontWeight: "600", 
        color: colors.default,
    },
    text: { fontSize: 18, fontWeight: "500", color: colors.textMain },
    textDisabled: { color: colors.textSecondary },
});