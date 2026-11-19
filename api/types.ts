// Типы ответов сервера
export type CarClass = "business" | "premium" | "electric";

export type Car = {
    id: number;
    brand: string;
    year: number;
    carClass: CarClass;
    pricePerDay: number;
    mileage: number;
    image: string; 
    row: number;
    align: "flex-start" | "center" | "flex-end";
    offset: number;
    busy: boolean; 
};

export type Booking = {
    id: number;
    carId: number;
    carBrand: string;
    days: number;
    total: number;
    name: string;
    phone: string;
    createdAt: string;
};

export type NewBooking = {
    carId: number;
    days: number;
    name: string;
    phone: string;
};