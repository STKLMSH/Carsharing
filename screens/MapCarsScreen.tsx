import React, { useState } from "react";
import { View, Text, Image, Pressable, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { BackButton } from "../components/BackButton";
import { CarListProps } from "../components/CarList";
import { cars, mapImage } from "../data/cars";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "MapCars">;

type Tab = "all" | "fav";

const ROWS = [1, 2, 3, 4];

// Экран «02 Карта с автомобилями»
export function MapCarsScreen({ navigation }: Props) {
  const [favIds, setFavIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  function toggleFav(id: string) {
    setFavIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }

  function openCar(id: string) {
    navigation.navigate("CarOverlay", { carId: id });
    }

  const visibleCars =
    activeTab === "all" ? cars : cars.filter((car) => favIds.includes(car.id));

  return (
    <View style={styles.container}>
      {/* Карта */}
      <Image source={mapImage} style={StyleSheet.absoluteFill} resizeMode="cover" />

      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        {/* Маркеры */}
        <View style={styles.markersLayer}>
          {ROWS.map((row) => (
            <View key={row} style={styles.markerRow}>
              {visibleCars
                .filter((car) => car.row === row)
                .map((car) => (
                  <Pressable
                    key={car.id}
                    onPress={() => openCar(car.id)}
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

        {/* Нижняя панель */}
        <View style={styles.panel}>
          <View style={styles.tabs}>
            <Pressable
              onPress={() => setActiveTab("all")}
              style={activeTab === "all" ? styles.tabActive : styles.tab}
              >
                <Text style={activeTab === "all" ? styles.tabTextActive : styles.tabText}>
                  Все
                </Text>
            </Pressable>
              <Pressable
              onPress={() => setActiveTab("fav")}
              style={activeTab === "fav" ? styles.tabActive : styles.tab}
              >
                <Text style={activeTab === "fav" ? styles.tabTextActive : styles.tabText}>
                  Избранное
                </Text>
                {favIds.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{favIds.length}</Text>
                  </View>
                )}
              </Pressable>
            </View>

                <FlatList
                  data={visibleCars}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator = {false}
                  contentContainerStyle={styles.listContent}
                  renderItem={({ item }) => (
                    <CarListProps
                      brand = {item.brand}
                      year={item.year}
                      pricePerDay={item.pricePerDay}
                      image={item.image}
                      isFav={favIds.includes(item.id)}
                      onToggleFav={() => toggleFav(item.id)}
                      onPress={() => openCar(item.id)}
                      />
                  )}
                  ListEmptyComponent={
                  <View style={styles.empty}>
                    <Text style={styles.emptyText}>
                      Нет избранных
                      </Text>
                    </View>
                  }
                />
          </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, alignItems: "flex-start" },
  markersLayer: { flex: 1, paddingBottom: 40 },
  markerRow: { flex: 1, justifyContent: "center" },
  marker: { width: 56, height: 56 },
  markerPressed: { transform: [{ scale: 1.1 }] },
  panel: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
    tabs: { flexDirection: "row", gap: 8, paddingHorizontal: 16 },
    tab: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 16,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.disable,
  },
    tabActive: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 16,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.default,
  },
    tabText: { fontSize: 14, fontWeight: "600", color: colors.textSecondary },
    tabTextActive: { fontSize: 14, fontWeight: "600", color: colors.textMain },
    badge: {
      minWidth: 20,
      height: 20,
      paddingHorizontal: 6,
      borderRadius: 10,
      backgroundColor: colors.details2,
      justifyContent: "center",
      alignItems: "center",
  },
    badgeText: { fontSize: 12, fontWeight: "700", color: colors.textSecondary },
    listContent: { paddingHorizontal: 16 },
    empty: { width: 280, height: 120, justifyContent: "center" },
    emptyText: { fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  });
