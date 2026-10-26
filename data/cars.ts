import { ImageSourcePropType } from "react-native";

export type Car = {
  id: string;
  brand: string;
  year: string;
  pricePerDay: string;
  mileage: string;
  image: ImageSourcePropType;
  row: number;
  align: "flex-start" | "center" | "flex-end";
  offset: number;
};

export const mapImage = require("../assets/images/map.png");

export const cars: Car[] = [
  {
    id: "1",
    brand: "Mercedes-Maybach",
    year: "2024",
    pricePerDay: "1500 BYN",
    mileage: "250 км",
    image: require("../assets/images/car1.png"),
    row: 1,
    align: "flex-end",
    offset: 90,
  },
  {
    id: "2",
    brand: "BMW M5 Competition",
    year: "2023",
    pricePerDay: "950 BYN",
    mileage: "250 км",
    image: require("../assets/images/car2.png"),
    row: 2,
    align: "flex-start",
    offset: 40,
  },
  {
    id: "3",
    brand: "Porsche Taycan",
    year: "2024",
    pricePerDay: "1200 BYN",
    mileage: "300 км",
    image: require("../assets/images/car3.png"),
    row: 3,
    align: "flex-end",
    offset: 50,
  },
  {
    id: "4",
    brand: "Audi RS e-tron GT",
    year: "2024",
    pricePerDay: "1100 BYN",
    mileage: "300 км",
    image: require("../assets/images/car4.png"),
    row: 4,
    align: "center",
    offset: 0,
  },
];

export function getCar(id: string): Car {
  return cars.find((c) => c.id === id) ?? cars[0];
}
