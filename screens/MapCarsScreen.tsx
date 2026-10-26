import React from "react";
import { View, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { BackButton } from "../components/BackButton";
import { cars, mapImage } from "../data/cars";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "MapCars">;

const ROWS = [1, 2, 3, 4];

// Экран «02 Карта с автомобилями»
export function MapCarsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      {/* Карта */}
      <Image source={mapImage} style={StyleSheet.absoluteFill} resizeMode="cover" />

      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        <View style={styles.markersLayer}>
          {ROWS.map((row) => (
            <View key={row} style={styles.markerRow}>
              {cars
                .filter((car) => car.row === row)
                .map((car) => (
                  <Pressable
                    key={car.id}
                    onPress={() => navigation.navigate("CarOverlay", { carId: car.id })}
                    style={({ pressed }) => [
                      styles.marker,
                      { alignSelf: car.align, marginHorizontal: car.offset },
                      pressed && styles.markerPressed,
                    ]}
                  >
                    {({ pressed }) => (
                      <Ionicons
                        name="location-sharp"
                        size={56}
                        color={pressed ? colors.pressed : colors.default}
                      />
                    )}
                  </Pressable>
                ))}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8EEE9" },
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, alignItems: "flex-start" },
  markersLayer: { flex: 1, paddingBottom: 40 },
  markerRow: { flex: 1, justifyContent: "center" },
  marker: { width: 56, height: 56 },
  markerPressed: { transform: [{ scale: 1.1 }] },
});
