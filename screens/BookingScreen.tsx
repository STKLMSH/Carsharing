import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types"
import type { Booking, Car, NewBooking } from "../api/types";
import { BackButton } from "../components/BackButton";
import { CarCard } from "../components/CarCard";
import { Button } from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { ErrorView } from "../components/ErrorView";
import { useFetch } from "../hooks/useFetch";
import { imageUrl, postJson } from "../api/client";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Booking">;

const MIN_DAYS = 1;
const MAX_DAYS = 30;
const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "нояб", "дек"];
const PICKUP_YEAR = 2026;
const PICKUP_MONTH = 8;
const PICKUP_DAY = 12;
const PICKUP_TIME = "10:00";

function formatDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} · ${PICKUP_TIME}`;
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
  const { carId } = route.params;
  const { data: car, loading, error, reload } = useFetch<Car>(`/cars/${carId}`);

  const [days, setDays] = useState(MIN_DAYS);
  const { user } = useAuth();

  // Состояние отправки брони
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  function decrease() {
    setDays((prev) => Math.max(MIN_DAYS, prev - 1));
  }

  function increase() {
    setDays((prev) => Math.min(MAX_DAYS, prev + 1));
  }

  async function handleBooking() {
    if (!user) return;
    setSubmitting(true);
    setBookingError(null);
    try {
      const newBooking: NewBooking = { carId, days, name: user.name, phone: user.phone };
      const created = await postJson<Booking>("/bookings", newBooking);
      setBooking(created);
    } catch (e) {
      setBookingError(e instanceof Error ? e.message : "Не удалось забронировать");
    } finally {
      setSubmitting(false);
      reload();
    }
  }
  if (loading && !car) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.default} />
      </SafeAreaView>
    );
  }
  if (error || !car) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ErrorView message={error ?? "Автомобиль не найден"} onRetry={reload} />
      </SafeAreaView>
    );
  }

  const total = car.pricePerDay * days;
  const pickupDate = new Date(PICKUP_YEAR, PICKUP_MONTH, PICKUP_DAY);
  const returnDate = new Date(PICKUP_YEAR, PICKUP_MONTH, PICKUP_DAY + days);

  const tariff = [
    { label: "Цена за сутки", value: `${car.pricePerDay} BYN`},
    { label: "Включенный пробег", value: `${car.mileage} км` },
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

        <CarCard 
                brand={car.brand} 
                year={car.year} 
                image={{ uri: imageUrl(car.image) }} 
                imageHeight={120} 
              />

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

        <View style={styles.periodBlock}>
          <Text style={styles.sectionLabel}>Водитель</Text>
          {user ? (
            <Text style={styles.driverText}>
              {user.name} · {user.phone}
            </Text>
          ) : (
            <Text style={styles.hint}>Зарегистрируйтесь, чтобы забронировать автомобиль</Text>
          )}
        </View>

        <View style={styles.buttonWrap}>
          <Button onPress={handleBooking} disabled={!user || submitting || booking !== null || car.busy}>
            {submitting
              ? "Отправляется..."
              : booking
                ? "Забронировано"
                : car.busy
                  ? "Автомобиль занят"
                  : "Забронировать"}
          </Button>
          {booking ? (
            <Text style={styles.success}>
              Бронь № {booking.id} принята, к оплате {booking.total} BYN
            </Text>
          ) : null}
          {bookingError ? <Text style={styles.bookingError}>{bookingError}</Text> : null}
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
  buttonWrap: { marginTop: 12, gap: 8 },
  center: { justifyContent: "center", alignItems: "center", padding: 16 },
  success: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.correct,
    textAlign: "center",
  },
  bookingError: { fontSize: 14, fontWeight: "600", color: colors.error, textAlign: "center" },
  tariff: { marginTop: 8, gap: 4 },
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
  driverText: { fontSize: 14, fontWeight: "600", color: colors.textMain },
  totalRow: { marginTop: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { fontSize: 14, fontWeight: "700", color: colors.textMain},
  totalValue: { fontSize: 14, fontWeight: "700", color: colors.pressed},
});
