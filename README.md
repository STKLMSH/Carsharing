# Carsharing
Мобильное приложения на React Native + Expo

# Исходные данные

| Тема приложения | Обязательные экраны | Дополнительные требования |
| :--- | :--- | :--- |
| Каршеринг | Регистрация; карта с автомобилями; карточка автомобиля и бронирование | Всплывающая панель (Overlay) поверх экрана карты |

# Структура проекта

```
carsharing-app/
├── App.tsx                      – корневой компонент, навигатор
├── types.ts                     – типы параметров маршрутов
├── theme.ts                     – цвета из таблицы стилей
├── data/
│   └── cars.ts                  – массив автомобилей
├── components/
│   ├── CarCard.tsx              – карточка автомобиля
│   ├── PrimaryButton.tsx        – целевая кнопка
│   └── BackButton.tsx           – кнопка «Назад»
├── screens/
│   ├── RegistrationScreen.tsx   – 01 Регистрация
│   ├── MapCarsScreen.tsx        – 02 Карта с автомобилями
│   ├── CarOverlay.tsx           – всплывающая панель
│   └── BookingScreen.tsx        – 03 Карточка и бронирование
└── assets/images/
    ├── map.png                  – карта
    └── car1.png … car4.png      – изображения автомобилей
```
## Установка

    git clone https://github.com/STKLMSH/Carsharing.git
    cd Carsharing
    npm install

## Запуск

    npx expo start

В терминале появится QR-код:

- **Телефон** — отсканируйте QR-код камерой или из Expo Go. Телефон и компьютер должны быть в одной Wi-Fi сети
- **Браузер** — нажмите `w` в терминале или запустите `npm run web`
- **Эмулятор Android** — нажмите `a` 

