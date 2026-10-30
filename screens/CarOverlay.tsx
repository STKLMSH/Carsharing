import React, { useEffect, useRef } from "react";
import { View, Pressable, StyleSheet, Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { CarCard } from "../components/CarCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { getCar } from "../data/cars";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "CarOverlay">;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export function CarOverlayScreen({ route, navigation }: Props) {
  const car = getCar(route.params.carId);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0.4,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT, 
        duration: 250,
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
          <CarCard brand={car.brand} year={car.year} image={car.image} imageHeight={120} />
          <View style={styles.buttonWrap}>
            <PrimaryButton
              title="Забронировать"
              onPress={() => navigation.replace("Booking", { carId: car.id })}
            />
          </View>
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
    backgroundColor: "black", 
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
});
