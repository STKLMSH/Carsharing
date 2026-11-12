import React from "react";
import { View, Text, Image, Pressable, StyleSheet, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

type CarListProps = {
    brand: string;
    year: string;
    pricePerDay: number;
    image: ImageSourcePropType;
    isFav: boolean;
    onToggleFav: () => void;
    onPress: () => void;
};

export function CarList({
    brand,
    year,
    pricePerDay,
    image,
    isFav,
    onToggleFav,
    onPress,
}: CarListProps) {
    return (
        <Pressable
        onPress={onPress}
        style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
        >
            <Image source={image} style={styles.image} resizeMode="contain" />
            <View style={styles.info}>
                <Text style={styles.brand} numberOfLines={1}>
                    {brand}
                </Text>
            </View>
            <Pressable
            onPress={onToggleFav}
            hitSlop={8}
            style={styles.heart}
            accessibilityLabel={isFav ? "Убрать из избранного" : "Добавить в избранное"}
            >
                <Ionicons
                    name={isFav ? "heart" : "heart-outline"}
                    size={24}
                    color={isFav ? colors.details2 : colors.textSecondary}
                />
            </Pressable>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 224,
        height: 120,
        padding: 8,
        marginRight: 8,
        borderRadius: 16,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardPressed: { borderColor: colors.default },
    image: { width: "100%", height: 72},
    info: { marginTop: 8, paddingRight: 24 },
    brand: { fontSize: 15, fontWeight: "600", color: colors.textMain },
    meta: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
    heart: { position: "absolute", top: 8, right: 8}
})