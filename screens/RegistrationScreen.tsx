import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Registration">;

// Экран «01 Регистрация»
export function RegistrationScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.topArc} />

      <SafeAreaView edges={["top"]} style={styles.titleBlock}>
        <Text style={styles.title}>Добро{"\n"}пожаловать</Text>
        <Text style={styles.subtitle}>забронируйте авто{"\n"}уже сегодня</Text>
      </SafeAreaView>

      <View style={styles.form}>
        <Text style={styles.label}>Номер телефона</Text>
        <TextInput
          style={styles.input}
          placeholder="+375 (29) 00-000-00"
          placeholderTextColor="#9AA3AB"
          keyboardType="phone-pad"
        />
        <View style={styles.buttonWrap}>
          <PrimaryButton
            title="Зарегистрироваться"
            onPress={() => navigation.navigate("MapCars")}
          />
        </View>
      </View>
      <View style={styles.bottomArc} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: "hidden",
  },
  topArc: {
    position: "absolute",
    top: -100,
    left: "-25%",
    width: "150%",
    height: 380, 
    backgroundColor: colors.details,
    borderBottomLeftRadius: 320,
    borderBottomRightRadius: 320,
    transform: [{ rotate: "-5deg" }],
  },
  titleBlock: {
    paddingTop: 60,
    paddingHorizontal: 24,
    height: 260, 
  },
  title: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "700",
    color: colors.textMain,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600",
    color: colors.textSecondary,
    opacity: 0.8,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 54, 
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMain,
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: colors.field,
    borderRadius: 16,
    fontSize: 16,
    color: colors.textMain,
    shadowColor: "#959595",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonWrap: {
    marginTop: 12,
  },
  bottomArc: {
    position: "absolute",
    bottom: -230, 
    alignSelf: "center",
    backgroundColor: colors.details2,
    width: 380, 
    height: 380, 
    borderRadius: 190, 
  },
});
