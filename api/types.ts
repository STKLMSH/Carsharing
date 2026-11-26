// Контракт API
export type CarClass = "business" | "premium" | "electric";
export type BookingStatus = "active" | "cancelled";


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
    status: BookingStatus;
    startsAt: string;
    createdAt: string;
};

export type NewBooking = {
    carId: number;
    days: number;
    name: string;
    phone: string;
    startsAt: string;
};

// Число активных броней в каждом классе
export type ClassStat = {
    carClass: CarClass;
    bookingsCount: number;
}

export const CAR_CLASS: Record<CarClass, string> = {
    business: "бизнес",
    premium: "премиум",
    electric: "электро",
};