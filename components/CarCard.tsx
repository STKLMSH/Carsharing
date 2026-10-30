import React from "react";
import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { colors } from "../theme";

type CarCardProps = {
  brand: string;
  year: string;
  image: ImageSourcePropType;
  imageHeight?: number;
};

// Карточка автомобиля
export function CarCard({ brand, year, image, imageHeight = 140 }: CarCardProps) {
  return (
    <View style={styles.card}>
      <Image
        source={image}
        style={[styles.image, { height: imageHeight }]}
        resizeMode="contain"
      />
      <Text style={styles.brand}>{brand}</Text>
      <Text style={styles.year}>{year}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  image: {
    width: "70%",
  },
  brand: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "600",
    color: colors.textMain,
    textAlign: "center",
  },
  year: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});
