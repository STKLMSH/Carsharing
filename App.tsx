import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RegistrationScreen } from "./screens/RegistrationScreen";
import { MapCarsScreen } from "./screens/MapCarsScreen";
import { CarOverlayScreen } from "./screens/CarOverlay";
import { BookingScreen } from "./screens/BookingScreen";
import { BookingsScreen } from "./screens/BookingsScreen";
import { AuthProvider } from "./contexts/AuthContext";
import type { RootStackParamList } from "./types";

// Стек экранов
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  return (
    // Пользователь из контекста доступен на любом экране
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Registration"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="MapCars" component={MapCarsScreen} />
          {/* Прозрачная модалка */}
          <Stack.Screen
            name="CarOverlay"
            component={CarOverlayScreen}
            options={{
              presentation: "transparentModal",
              animation: "fade",
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen name="Bookings" component={BookingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
