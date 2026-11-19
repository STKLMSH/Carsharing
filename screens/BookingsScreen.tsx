import React from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types"
import type { Booking } from "../api/types";
import { BackButton } from "../components/BackButton";
import { ErrorView } from "../components/ErrorView";
import { useAuth } from "../contexts/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Bookings">;

// Экран 04 «Мои бронирования»
export function BookingsScreen({ navigation }: Props) {
    const { user } = useAuth();
    const phone = encodeURIComponent(user?.phone ?? "");
    const { data: bookings, loading, error, reload } = useFetch<Booking[]>(`/bookings?phone=${phone}`);

  function renderContent() {
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
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.brand}>
                № {item.id} · {item.carBrand}
              </Text>
              <Text style={styles.meta}>{item.days} сут.</Text>
            </View>
            <Text style={styles.total}>{item.total} BYN</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.hint}>Бронирований пока нет</Text>}
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
});