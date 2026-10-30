import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { BackButton } from "../components/BackButton";
import { CarCard } from "../components/CarCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { getCar } from "../data/cars";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Booking">;

type PeriodRowProps = { title: string; date: string };

// Блок «Получение» / «Возврат»
function PeriodRow({ title, date }: PeriodRowProps) {
  return (
    <View style={styles.periodBlock}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.selectorsRow}>
        <Pressable style={[styles.selector, styles.dateSelector]}>
          <Ionicons name="calendar-outline" size={20} color={colors.textMain} />
          <Text style={styles.dateText}>{date}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textMain} />
        </Pressable>
        <Pressable style={[styles.selector, styles.placeSelector]}>
          <Ionicons name="location-outline" size={20} color={colors.textMain} />
          <Ionicons name="chevron-down" size={16} color={colors.textMain} />
        </Pressable>
      </View>
    </View>
  );
}

// Экран «03 Карточка автомобиля и бронирование»
export function BookingScreen({ route, navigation }: Props) {
  const car = getCar(route.params.carId);

  const tariff = [
    { label: "Цена за сутки", value: car.pricePerDay },
    { label: "Включенный пробег", value: car.mileage },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        <CarCard brand={car.brand} year={car.year} image={car.image} imageHeight={150} />

        <PeriodRow title="Получение" date="12 сент · 10:00" />
        <PeriodRow title="Возврат" date="13 сент · 10:00" />

        <View style={styles.buttonWrap}>
          <PrimaryButton title="Забронировать" />
        </View>

        <View style={styles.tariff}>
          <Text style={styles.sectionLabel}>Тариф</Text>
          {tariff.map((row) => (
            <View key={row.label} style={styles.tariffRow}>
              <Text style={styles.tariffLabel}>{row.label}</Text>
              <Text style={styles.tariffValue}>{row.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingBottom: 32, gap: 8 },
  header: { paddingTop: 8, alignItems: "flex-start" },
  periodBlock: { gap: 8, marginTop: 8 },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: colors.textMain },
  selectorsRow: { flexDirection: "row", gap: 12 },
  selector: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  dateSelector: { flex: 1 },
  placeSelector: { flex: 1 },
  dateText: { flex: 1, fontSize: 12, color: colors.textSecondary },
  buttonWrap: { marginTop: 12 },
  tariff: { marginTop: 12, gap: 8 },
  tariffRow: { flexDirection: "row", justifyContent: "space-between" },
  tariffLabel: { fontSize: 12, fontWeight: "600", color: colors.textMain },
  tariffValue: { fontSize: 12, fontWeight: "700", color: colors.textMain },
});
