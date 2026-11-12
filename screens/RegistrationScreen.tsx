import React, {useState} from "react";
import { View, Text, TextInput, StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Registration">;

type RegistrationValues = { name: string; phone: string };

function validate(values: RegistrationValues) {
  const errors: Record<string, string> = {};

  if (!values.name.trim()) {
    errors.name = "Введите имя";
  } else if (values.name.trim().length < 2) {
    errors.name = "Имя должно быть не короче 2 букв";
  }

  const digits = values.phone.replace(/\D/g, "");
  if (!digits) {
    errors.phone = "Введите номер телефона";
  } else if (digits.length !== 12 || !digits.startsWith("375")) {
    errors.phone = "Номер телефона набран некорректно";
  }

  return errors;
}

// Экран «01 Регистрация»
export function RegistrationScreen({ navigation }: Props) {
    const { width } = useWindowDimensions();
    const front = width * 1.25; 
    const back = width * 0.75; 
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    function onSubmit() {
      const nextErrors = validate({ name, phone });
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length === 0) {
        navigation.navigate("MapCars");
      }
    }

  return (
    <View style={styles.container}>
      {/* Детали фона */}
      <View style={styles.topArc} />
        <View
          style={[
            styles.circle,
            styles.circleBack,
            {
              width: back,
              height: back,
              borderRadius: back / 2,
              right: -back * 0.3,
              bottom: -back * 0.4,
            },
          ]}
        />
        <View
          style={[
            styles.circle,
            styles.circleFront,
            {
              width: front,
              height: front,
              borderRadius: front / 2,
              left: -front * 0.3,
              bottom: -front * 0.55,
            },
          ]}
        />

      {/* Заголовок */}
      <SafeAreaView edges={["top"]} style={styles.titleBlock}>
        <Text style={styles.title}>Добро{"\n"}пожаловать</Text>
        <Text style={styles.subtitle}>забронируйте авто{"\n"}уже сегодня</Text>
      </SafeAreaView>

      {/* Форма */}
      <View style={styles.form}>
        <FormField error={errors.name}>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            value={name}
            onChangeText={setName}
            placeholder="Имя"
            placeholderTextColor={colors.placeholderText}
          />
        </FormField>

        <FormField error={errors.phone}>
          <TextInput
            style={[styles.input, errors.phone ? styles.inputError : null]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Телефон"
            placeholderTextColor={colors.placeholderText}
            keyboardType="phone-pad"
          />
        </FormField>

        <View style={styles.buttons}>
          <Button variant="primary" onPress={onSubmit}>
            Зарегистрироваться
          </Button>
          <Button variant="link" onPress={() => navigation.navigate("MapCars")}>
            Продолжить без регистрации
          </Button>
        </View>
      </View>
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
    paddingTop: 24, 
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
    shadowColor: colors.shadow2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  buttons: {
    marginTop: 16,
    gap: 4,
  },
  buttonWrap: {
    marginTop: 12,
  },
  circle: { position: "absolute" },
  circleBack: { backgroundColor: colors.details },
  circleFront: { backgroundColor: colors.details2 },
});
