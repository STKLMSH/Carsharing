// Экраны навигатора и параметры, которые каждый получает через route.params
export type RootStackParamList = {
    Registration: undefined;
    MapCars: undefined;
    CarOverlay: { carId: number }; 
    Booking: { carId: number };
    Bookings: undefined; 
};