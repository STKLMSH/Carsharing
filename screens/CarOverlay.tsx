import React, { useEffect, useRef } from "react";
import { View, Pressable, StyleSheet, Animated, Dimensions, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types"
import type { Car } from "../api/types";
import { CarCard } from "../components/CarCard";
import { Button } from "../components/Button";
import { ErrorView } from "../components/ErrorView";
import { useFetch } from "../hooks/useFetch";
import { imageUrl } from "../api/client";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "CarOverlay">;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const BACKDROP_OPACITY = 0.4;
const FADE_IN = 250;
const SLIDE_IN = 300;
const FADE_OUT = 200;
const SLIDE_OUT = 250;

export function CarOverlayScreen({ route, navigation }: Props) {
  const { carId } = route.params;
  const { data: car, loading, error, reload } = useFetch<Car>(`/cars/${carId}`);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: BACKDROP_OPACITY,
        duration: FADE_IN,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, 
        duration: SLIDE_IN,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: FADE_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT, 
        duration: SLIDE_OUT,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.goBack();
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={styles.pressableArea} onPress={handleClose} />
      </Animated.View>
      <Animated.View style={{ transform: [{ translateY: slideAnim }], width: "100%" }}>
        <SafeAreaView edges={["bottom"]} style={styles.sheet}>
          {loading && !car ? (
            <ActivityIndicator size="large" color={colors.default} style={styles.loader} />
          ) : error || !car ? (
            <ErrorView message={error ?? "Автомобиль не найден"} onRetry={reload} />
          ) : (
            <>
              <CarCard
                brand={car.brand}
                year={car.year}
                image={{ uri: imageUrl(car.image) }}
                imageHeight={120}
              />
              <View style={styles.buttonWrap}>
                <Button onPress={() => navigation.replace("Booking", { carId: car.id })}>
                  Забронировать
                </Button>
              </View>
            </>
          )}
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end" },
  backdrop: { 
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.shadow, 
  },
  pressableArea: { flex: 1 }, 
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 8,
  },
  buttonWrap: { marginTop: 8, alignSelf: "stretch" },
  loader: { height: 200 },
});