import express from "express";
import cors from "cors";
import { cars } from "./data/cars.js";

const app = express();
const PORT = 3000;

const bookings = [];
let nextBookingId = 1;

function isBusy(carId) {
    return bookings.some((booking) => booking.carId === carId);
}

function withStatus(car) {
    return { ...car, busy: isBusy(car.id) };
}

function onlyDigits(value) {
    return typeof value === "string" ? value.replace(/\D/g, "") : "";
}

//                  Middleware
app.use(logger);
app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

function logger(req, res, next) {
    const time = new Date().toLocaleTimeString("ru-RU");
    console.log(`[${time}] ${req.method} ${req.url}`)
    next();
}


app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});


//                  маршруты машин
app.get("/api/cars", (req, res) => {
    const carClass = String(req.query.class ?? "").trim();
    const result = carClass ? cars.filter((car) => car.carClass === carClass) : cars;
    res.json(result.map(withStatus));
});

app.get("/api/cars/:id", (req, res) => {
    const id = Number(req.params.id); 
    const car = cars.find((item) => item.id === id);
    if (!car) {
        return res.status(404).json({ error: "Автомобиль не найден" });
    }
    res.json(withStatus(car));
});


//                  маршруты бронирования
app.get("/api/bookings", (req, res) => {
    const phone = onlyDigits(req.query.phone);
    if (!phone) {
        return res.status(400).json({ error: "Укажите телефон" })
    }
    res.json(bookings.filter((booking) => onlyDigits(booking.phone) === phone));
});

app.post("/api/bookings", (req, res) => {
    const error = validateBooking(req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    const { carId, days, name, phone } = req.body;
    const car = cars.find((item) => item.id === carId);

    if (isBusy(carId)) {
        return res.status(409).json({ error: `${car.brand} уже забронирован`}); 
    }

    const booking = {
        id: nextBookingId++,
        carId,
        carBrand: car.brand,
        days,
        total: car.pricePerDay * days,
        name: name.trim(),
        phone,
        createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    res.status(201).json(booking);
});


//                  обработка ошибок
app.use((req, res) => {
    res.status(404).json({ error: `Маршрут ${req.method} ${req.url} не найден`})
});

app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Тело запроса - некорректный JSON "});
    }
    console.error(err);
    res.status(500).json({ error: "Внутренняя ошибка сервера"});
});


app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});


function validateBooking(body) {
    if (!body) {
        return "Тело запроса должно быть в формате JSON";
    }
    if (!Number.isInteger(body.carId)) {
        return "Поле carId обязательно и должно быть целым числом";
    }
    if (!cars.some((car) => car.id === body.carId)) {
        return `Автомобиля с id ${body.carId} не существует`;
    }
    if (!Number.isInteger(body.days) || body.days < 1 || body.days > 30) {
        return "Срок аренды должен быть целым числом от 1 до 30 суток";
    }
    if (typeof body.name !== "string" || body.name.trim().length < 2) {
        return "Имя водителя не должно быть короче 2 символов";
    }
    const digits = onlyDigits(body.phone);
    if (digits.length !== 12 || !digits.startsWith("375")) {
        return "Телефон должен быть в формате +375 XX XXX-XX-XX";
    }
    return null;
}
