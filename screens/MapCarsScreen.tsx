import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types"
import type { Car, CarClass } from "../api/types";
import { BackButton } from "../components/BackButton";
import { CarList } from "../components/CarList";
import { useAuth } from "../contexts/AuthContext";
import { ErrorView } from "../components/ErrorView";
import { useFetch } from "../hooks/useFetch";
import { imageUrl } from "../api/client";
import { colors } from "../theme";

const mapImage = require("../assets/images/map.png");

type Props = NativeStackScreenProps<RootStackParamList, "MapCars">;

type Tab = "all" | "fav";

const ROWS = [1, 2, 3, 4, 5, 6];

const CLASSES: { value: CarClass | ""; label: string }[] = [
  { value: "", label: "Все" },
  { value: "business", label: "Бизнес" },
  { value: "premium", label: "Премиум" },
  { value: "electric", label: "Электро" },
];

// Экран «02 Карта с автомобилями»
export function MapCarsScreen({ navigation }: Props) {
  const [favIds, setFavIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [carClass, setCarClass] = useState<CarClass | "">("");
  const { user, logout } = useAuth();

  const query = carClass ? `?class=${carClass}` : "";
  const { data: cars, loading, error, reload } = useFetch<Car[]>(`/cars${query}`);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", reload);
    return unsubscribe;
  }, [navigation]);

  function handleLogout() {
    logout();
    navigation.popTo("Registration");
  }

  function toggleFav(id: number) {
    setFavIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }

  function openCar(id: number) {
    navigation.navigate("CarOverlay", { carId: id });
  }

  const allCars = cars ?? [];
  const visibleCars =
    activeTab === "all" ? allCars : allCars.filter((car) => favIds.includes(car.id));

  {/* Загрузка */}
  function renderList() {
    if (loading && !cars) {
      return (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={colors.default} />
        </View>
      );
    }
    if (error) {
      return <ErrorView message={error} onRetry={reload} />;
    }
    return (
      <FlatList
        data={visibleCars}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CarList
            brand={item.brand}
            year={String(item.year)}
            pricePerDay={item.pricePerDay}
            image={{ uri: imageUrl(item.image) }}
            isFav={favIds.includes(item.id)}
            onToggleFav={() => toggleFav(item.id)}
            onPress={() => openCar(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {activeTab === "fav" ? "Нет избранных" : "Нет избранных машин этого класса"}
            </Text>
          </View>
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Карта */}
      <Image source={mapImage} style={styles.map} resizeMode="cover" />

      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />

          {/* История бронирования */}
          {user ? (
            <Pressable
              style={styles.historyButton}
              onPress={() => navigation.navigate("Bookings")}
              accessibilityLabel="Мои бронирования"
            >
              <Ionicons name="time-outline" size={20} color={colors.textMain} />
            </Pressable>
          ) : null}

          {/* Плашка с именем */}
          <View style={styles.userChip}>
            <Ionicons name="person-circle-outline" size={20} color={colors.textMain} />
            <Text style={styles.userName}>{user ? user.name : "Гость"}</Text>
            <Pressable
              onPress={user ? handleLogout : () => navigation.popTo("Registration")}
              hitSlop={8}
            >
              <Text style={styles.userAction}>{user ? "Выйти" : "Войти"}</Text>
            </Pressable>
          </View>
        </View>

        {/* Фильтр по классу */}
        <View style={styles.classes}>
          {CLASSES.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => setCarClass(item.value)}
              style={carClass === item.value ? styles.classChipActive : styles.classChip}
            >
              <Text style={styles.classText}>{item.label}</Text>
            </Pressable>
          ))}
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
                        size={44}
                        color={car.busy ? colors.textSecondary : pressed ? colors.pressed : colors.default}
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

          {renderList()}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { position: "absolute", top: 0, left: 0,  width: "100%", height: "100%" },
  container: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  header: { 
    paddingHorizontal: 16, 
    paddingTop: 8, 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.background,
    shadowColor: colors.shadowSecondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textMain,
  },
  userAction: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.default,
  },
  historyButton: {
    marginLeft: "auto",
    marginRight: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadowSecondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  classes: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  classChip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  classChipActive: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    justifyContent: "center",
    backgroundColor: colors.detailsSecondary,
  },
  classText: { fontSize: 13, fontWeight: "600", color: colors.textMain },
  markersLayer: { flex: 1, paddingBottom: 16 },
  markerRow: { flex: 1, justifyContent: "center" },
  marker: { width: 44, height: 44 },
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
      backgroundColor: colors.disableSecondary,
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
      backgroundColor: colors.detailsSecondary,
      justifyContent: "center",
      alignItems: "center",
  },
    badgeText: { fontSize: 12, fontWeight: "700", color: colors.textSecondary },
    listContent: { flexGrow: 1, paddingHorizontal: 16 },
    empty: { flex: 1, height: 120, justifyContent: "center", alignItems: "center" },
    emptyText: { fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  });
