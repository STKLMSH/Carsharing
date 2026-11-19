# Carsharing
Мобильное приложение на React Native + Expo

# Исходные данные

| Тема приложения | Обязательные экраны | Дополнительные требования |
| :--- | :--- | :--- |
| Каршеринг | Регистрация; карта с автомобилями; карточка автомобиля и бронирование | Всплывающая панель (Overlay) поверх экрана карты |

# Структура проекта

```
Carsharing/
├── App.tsx                      – корневой компонент
├── types.ts                     – экраны навигатора и их параметры
├── theme.ts                     – цвета из таблицы стилей
├── api/
│   ├── client.ts                – адрес сервера и все запросы 
│   └── types.ts                 – типы ответов сервера: Car, Booking, NewBooking
├── components/
│   ├── Button.tsx               – кнопка с вариантами primary / link
│   ├── FormField.tsx            – обёртка поля формы с текстом ошибки
│   ├── ErrorView.tsx            – ошибка загрузки с кнопкой «Повторить»
│   ├── CarCard.tsx              – крупная карточка автомобиля
│   ├── CarList.tsx              – карточка автомобиля в списке на карте
│   └── BackButton.tsx           – кнопка «Назад»
├── hooks/
│   ├── useFetch.ts              – загрузка с сервера: данные, загрузка, ошибка, повтор
│   └── useForm.ts               – значения полей, ошибки, отправка формы
├── contexts/
│   └── AuthContext.tsx          – вошедший пользователь (login / logout)
├── screens/
│   ├── RegistrationScreen.tsx   – 01 Регистрация
│   ├── MapCarsScreen.tsx        – 02 Карта с автомобилями, фильтр по классу, избранное
│   ├── CarOverlay.tsx           – всплывающая панель автомобиля
│   ├── BookingScreen.tsx        – 03 Карточка автомобиля и бронирование
│   └── BookingsScreen.tsx       – 04 Мои бронирования
├── assets/images/
│   └── map.png                  – карта
└── server/                      – сервер Express
    ├── server.js                – маршруты API, проверка данных, обработка ошибок
    ├── data/cars.js             – каталог автомобилей
    ├── images/car1…car6.png     – изображения автомобилей
    ├── requests.http            – проверочные запросы для REST Client
    └── package.json             – express, cors; скрипты dev / start

```

## Установка

    git clone https://github.com/STKLMSH/Carsharing.git
    cd Carsharing
    npm install
    cd server
    npm install

## Запуск

Нужны два терминала.

**1. Сервер** (

    cd server
    npm run dev

**2. Приложение** 

    npx expo start

В терминале появится QR-код:

- **Телефон** — отсканируйте QR-код камерой или из Expo Go *
- **Браузер** — нажмите `w` в терминале или запустите `npm run web`
- **Эмулятор Android** — нажмите `a` 

> Телефон и компьютер должны быть в одной Wi-Fi сети