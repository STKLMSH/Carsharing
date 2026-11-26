import React, { useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types"
import type { Booking } from "../api/types";
import { BackButton } from "../components/BackButton";
import { ErrorView } from "../components/ErrorView";
import { useAuth } from "../contexts/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { patchJson } from "../api/client";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Bookings">;

// Экран 04 «Мои бронирования»
export function BookingsScreen({ navigation }: Props) {
    const { user } = useAuth();
    const phone = encodeURIComponent(user?.phone ?? "");
    const { data: bookings, loading, error, reload } = useFetch<Booking[]>(`/bookings?phone=${phone}`);

    function pad(value: number) {
      return String(value).padStart(2, "0");

    }

    function formatStart(iso: string) {
      const date = new Date(iso);
      const day = `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;
      const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
      return `${day} в ${time}`;
    }

    const [cancelError, setCancelError] = useState<string | null>(null);

    async function cancelBooking(id: number) {
      if (!user) return;
      setCancelError(null);
      try {
        await patchJson<Booking>(`/bookings/${id}`, { status: "cancelled", phone: user.phone });
        reload();
      } catch (e) {
        setCancelError(e instanceof Error ? e.message : "Не удалось отменить бронь");
      }
    }

  function renderContent() {
    if (!user) {
        return <Text style={styles.hint}>Войдите, чтобы увидеть свои бронирования</Text>
    }
    if (loading && !bookings) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.default} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.center}>
          <ErrorView message={error} onRetry={reload} />
        </View>
      );
    }
    return (
      <FlatList
        data={bookings ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          cancelError ? <Text style={styles.cancelError}>{cancelError}</Text> : undefined
        }
        renderItem={({ item }) => {
          const cancelled = item.status === "cancelled";
          const started = new Date(item.startsAt) <= new Date();
          return (
            <View style={[styles.row, cancelled && styles.rowCancelled]}>
              <View style={styles.rowInfo}>
                <Text style={styles.brand}>
                  № {item.id} · {item.carBrand}
                </Text>
                <Text style={styles.meta}>
                  {item.days} сут.
                </Text>
                <Text style={styles.meta}>
                  с {formatStart(item.startsAt)}
                </Text>
              </View>
              <View style={styles.rowSide}>
                <Text style={[styles.total, cancelled && styles.totalCancelled]}>
                  {item.total} BYN
                </Text>
                {cancelled ? (
                  <Text style={styles.status}>Отменено</Text>
                   ) : started ? (
                  <Text style={styles.status}>Аренда идёт</Text>
                ) : (
                  <Pressable onPress={() => cancelBooking(item.id)} hitSlop={8}>
                    <Text style={styles.cancel}>Отменить</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.hint}>Вы ещё ничего не бронировали</Text>}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Мои бронирования</Text>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: colors.background },
header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingTop: 8 },
title: { fontSize: 20, fontWeight: "700", color: colors.textMain },
center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
list: { padding: 16, gap: 8 },
row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
},
rowInfo: { flex: 1, gap: 2 },
brand: { fontSize: 15, fontWeight: "600", color: colors.textMain },
meta: { fontSize: 12, color: colors.textSecondary },
total: { fontSize: 15, fontWeight: "700", color: colors.pressed },
hint: { paddingTop: 32, fontSize: 14, color: colors.textSecondary, textAlign: "center" },
rowCancelled: { backgroundColor: colors.disableSecondary },
rowSide: { alignItems: "flex-end", gap: 4 },
totalCancelled: { color: colors.textSecondary, textDecorationLine: "line-through" },
status: { fontSize: 12, color: colors.textSecondary },
cancel: { fontSize: 13, fontWeight: "600", color: colors.error },
cancelError: { paddingBottom: 8, fontSize: 14, fontWeight: "600", color: colors.error, textAlign: "center" },
});