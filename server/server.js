import express from "express";
import cors from "cors";
import { cars } from "./data/cars.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/cars", (req, res) => {
    const carClass = String(req.query.class ?? "").trim();
    const result = carClass ? cars.filter((car) => car.carClass === carClass) : cars;
    res.json(result);
});

app.get("/api/cars/:id", (req, res) => {
    const id = Number(req.params.id); 
    const car = cars.find((item) => item.id === id);
    if (!car) {
        return res.status(404).json({ error: "Автомобиль не найден" });
    }
    res.json(car);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});