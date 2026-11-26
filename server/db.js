import { DatabaseSync } from "node:sqlite";
import { cars } from "./data/cars.js";

export const db = new DatabaseSync("carsharing.db");

db.exec("PRAGMA foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS cars (
        id             INTEGER PRIMARY KEY,       
        brand          TEXT    NOT NULL UNIQUE,
        year           INTEGER NOT NULL,
        car_class      TEXT    NOT NULL CHECK (car_class IN ('business', 'premium', 'electric')),
        price_per_day  INTEGER NOT NULL CHECK (price_per_day > 0),
        mileage        INTEGER NOT NULL CHECK (mileage > 0),
        image          TEXT    NOT NULL,
        map_row        INTEGER NOT NULL CHECK (map_row BETWEEN 1 AND 6),
        map_align      TEXT    NOT NULL CHECK (map_align IN ('flex-start', 'center', 'flex-end')),
        map_offset     INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS bookings (
        id         INTEGER PRIMARY KEY,
        car_id     INTEGER NOT NULL REFERENCES cars (id), 
        days       INTEGER NOT NULL CHECK (days BETWEEN 1 AND 30),
        total      INTEGER NOT NULL CHECK (total > 0),
        name       TEXT    NOT NULL,
        phone      TEXT    NOT NULL,
        status     TEXT    NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
        starts_at  TEXT    NOT NULL,   
        created_at TEXT    NOT NULL 
        );

    -- У машины может быть только одна активная бронь
    CREATE UNIQUE INDEX IF NOT EXISTS one_active_booking_per_car
        ON bookings (car_id) WHERE status = 'active';
`);

// Выполнить fn целиком или не выполнить ничего
export function transaction(fn) {
    db.exec("BEGIN");
    try {
        const result = fn();
        db.exec("COMMIT");
        return result;
    } catch (err) {
        db.exec("ROLLBACK");
        throw err;
    }
}

// Начальные данные
const { count } = db.prepare("SELECT COUNT(*) AS count FROM cars").get();
if (count === 0) {
    const insert = db.prepare(`
        INSERT INTO cars (id, brand, year, car_class, price_per_day, mileage, image,
            map_row, map_align, map_offset)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    transaction(() => {
        for (const c of cars) {
            insert.run(c.id, c.brand, c.year, c.carClass, c.pricePerDay, c.mileage, c.image,
                c.row, c.align, c.offset);
        }
    });
    console.log(`База заполнена: ${cars.length} автомобилей`);
}