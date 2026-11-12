import React, { useState } from "react";
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

const MIN_DAYS = 1;
const MAX_DAYS = 30;
const MONTHS = ["янв", "фев", "март", "апр", "май", "июн", "июл", "авг", "сен", "окт", "нояб", "дек"];
const PICKUP_DAY = 12;
const PICKUP_MONTH = 8;

function formatDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} · 10:00`;
}

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

  const [days, setDays] = useState(MIN_DAYS);

  function decrease() {
    setDays((prev) => Math.max(MIN_DAYS, prev - 1));
  }

  function increase() {
    setDays((prev) => Math.min(MAX_DAYS, prev + 1));
  }

  const total = car.pricePerDay * days;
  const pickupDate = new Date(2026, PICKUP_MONTH, PICKUP_DAY);
  const returnDate = new Date(2026, PICKUP_MONTH, PICKUP_DAY + days);

  const tariff = [
    { label: "Цена за сутки", value: `${car.pricePerDay} BYN`},
    { label: "Включенный пробег", value: car.mileage },
    { label: "Срок аренды", value: `${days} сут.`},
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

        <PeriodRow title="Получение" date= {formatDate(pickupDate)} />
        <PeriodRow title="Возврат" date= {formatDate(returnDate)} />

        <View style={styles.periodBlock}>
          <Text style={styles.sectionLabel}>Срок аренды</Text>
          <View style={styles.counterRow}>
            <Pressable
            onPress={decrease}
            disabled={days === MIN_DAYS}
            style={[styles.counterButton, days === MIN_DAYS && styles.counterButtonDisable]}
            >
              <Ionicons name="remove" size={20} color={colors.textMain} />
            </Pressable>
            <Text style={styles.counterValue}>{days} сут.</Text>
            <Pressable
              onPress={increase}
              disabled={days === MAX_DAYS}
              style={[styles.counterButton, days === MAX_DAYS && styles.counterButtonDisable]}
              >
                <Ionicons name="add" size={20} color={colors.textMain} />
              </Pressable>
          </View>
          {days === MAX_DAYS && (
            <Text style={styles.hint}>Достигнут максимальный срок аренды</Text>
          )}
        </View>

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
            <View style={[styles.tariffRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Итого</Text>
              <Text style={styles.totalValue}>{total} BYN</Text>
            </View>
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
  counterRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.default,
    justifyContent: "center",
    alignItems: "center"
  },
  counterButtonDisable: { backgroundColor: colors.disable},
  counterValue: {
    minWidth: 64,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: colors.textMain,
  },
  hint: { fontSize: 12, color: colors.textSecondary },
  totalRow: { marginTop: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { fontSize: 14, fontWeight: "700", color: colors.textMain},
  totalValue: { fontSize: 14, fontWeight: "700", color: colors.pressed},
});
