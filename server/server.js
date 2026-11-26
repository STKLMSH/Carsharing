import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();
const PORT = 3000;

const MIN_DAYS = 1;
const MAX_DAYS = 30;
const MIN_NAME_LENGTH = 2;
const PHONE_LENGTH = 12;
const PHONE_PREFIX = "375";
const PICKUP_HOUR = 10;

function defaultStart() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(PICKUP_HOUR, 0, 0, 0);
    return date.toISOString();
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

const CAR_FIELDS = `
    c.id, c.brand, c.year, c.car_class AS carClass, c.price_per_day AS pricePerDay,
    c.mileage, c.image, c.map_row AS row, c.map_align AS align, c.map_offSet AS offset,
    EXISTS (
        SELECT 1 FROM bookings b WHERE b.car_id = c.id AND b.status = 'active'
    ) AS busy`;

function toCar(row) {
    return { ...row, busy: row.busy === 1 };
}

//                  маршруты машин
app.get("/api/cars", (req, res) => {
    const carClass = String(req.query.class ?? "").trim();
    const cars = db.prepare(`
        SELECT ${CAR_FIELDS}
        FROM cars c
        WHERE ? = '' OR c.car_class = ?
        ORDER BY c.id
    `).all(carClass, carClass);
    res.json(cars.map(toCar));
});

app.get("/api/cars/:id", (req, res) => {
    const car = db
        .prepare(`SELECT ${CAR_FIELDS} FROM cars c WHERE c.id = ?`)
        .get(Number(req.params.id));
    if (!car) {
        return res.status(404).json({ error: "Автомобиль не найден" });
    }
    res.json(toCar(car));
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
    if (!Number.isInteger(body.days) || body.days < MIN_DAYS || body.days > MAX_DAYS) {
        return `Срок аренды должен быть целым числом от ${MIN_DAYS} до ${MAX_DAYS} суток`;
    }
    if (typeof body.name !== "string" || body.name.trim().length < MIN_NAME_LENGTH) {
        return `Имя водителя не должно быть короче ${MIN_NAME_LENGTH} символов`;
    }
    const digits = onlyDigits(body.phone);
    if (digits.length !== PHONE_LENGTH || !digits.startsWith(PHONE_PREFIX)) {
        return `Телефон должен быть в формате +${PHONE_PREFIX} XX XXX-XX-XX`;
    }
    return null;
}
