import express from "express";
import multer from "multer";
import cors from "cors";

import mongoose from "mongoose";

import { registerValidation, loginValidation, postCreateValidation } from "./validation.js";

import { UserController, PostController } from "./controllers/index.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";

const app = express();

// middleware - це функція, яка виконується перед основним запитом. Якось обробляє і повертає дані. Наприклад, і для видалення і для зміни користувача треба знайти його по айді. Логіка по знаходженню виноситься в мідлвер і повертає req з потрібним айді.

// підключаємося до нашої бази даних
mongoose
    .connect("mongodb+srv://Denys1994:pp74tvVguAJTZZa@cluster0.l8hygki.mongodb.net/blog?retryWrites=true&w=majority")
    .then(() => console.log("DB Ok"))
    .catch(err => console.log("ERROR", err));

// дозволяє express читати json, який приходить в post запитах
app.use(express.json());
// щоб після завантаження картинка коректно відображася в браузері за вказаним роутом
app.use("/uploads", express.static("uploads"));
// cors, щоб можна було виконувати запити з одного локалхост на інший
app.use(cors());

// місце зберігання картинок
const storage = multer.diskStorage({
    // куди зберігати файл, в папку аплоадс
    destination: (__, _, cb) => {
        cb(null, "uploads");
    },
    // як називати файл
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// 2. користувач намагається залогінитися після реєстрації. Автентифікація. Якщо успішно, сервер видає юзеру токен, яким дає доступ до певних сервісів. Наприклад, користувач хоче доступ до якогось списку юзерів через гет запит, він має ввести Беарер токен в хедерс, якщо все ок - отримує доступ.
app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);

// 1. користувач реєструється: відправляємо пост запит з даними користувача, який хоче зайти на сервер
// спочатку валідація через registerValidation. Витягаємо validationResult, яка показує чи є помилки в нашій валідації, яка відбуваєтся через registerValidation
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);

// 3. перевіряємо чи можемо отримати інформацію про себе
app.get("/auth/me", checkAuth, UserController.getMe);

// роути для СТАТТЕЙ
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
// checkAuth треба спочатку. Це означає, що статтю не можна створити, поки не буде checkAuth. І видалити теж абихто не може
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.post("/uploads", checkAuth, upload.single("image"), (req, res) => {
    // повертаємо клієнту інфу щодо того за яким шляхом ми зберегли картинки
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

// запуск сервера
app.listen(4444, err => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});
