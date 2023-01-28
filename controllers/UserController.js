// бібліотека для створення ключів авторизації. Токени потрібні для того, щоб тільки окремі юзери мали доступ до посилань
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// db
import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        // 3 шифруємо пароль
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // 2. створюємо користувача
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            // 3 (але просто в базу даних пароль передати не можна, треба його захешувати)
            passwordHash: hash,
        });
        // записуємо користувача в базу даних через команду save
        const user = await doc.save();

        // 4. якщо все ок, створюємо новий токен (передаємо в нього id юзера, секретний ключ і скільки діє токен). Суть в тому, що клієнт звертається до сервера, якщо авторизація успішна і вдалося залогінитися, сервер генерує токен (те, що ми робимо нижче) і повертає цей токен назад клієнту користувачу. Тепер на наступні запити цей токен браузер автоматично підв'язує під дані юзера і клієнт перевіряє чи все ок.
        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );
        // вертаємо дані просто без пароля і не весь юзер, а тільки doc
        const { passwordHash, ...userData } = user._doc;

        // повертаємо інформацію про юзера
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалося зареєструватися",
        });
    }
};

export const login = async (req, res) => {
    try {
        // перевіряємо чи є такий користувач у базі даних
        const user = await UserModel.findOne({ email: req.body.email });
        // якщо немає, відразу даємо помилку
        if (!user) {
            return res.status(404).json({
                message: "Користувача не знайдено",
            });
        }
        // якщо користувач знайдений, перевіряємо чи правильний пароль (bcrypt для порівняння звичайного паролю і захешованого з бази даних)
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: "Неправильний логін чи пароль",
            });
        }
        // якщо все ок, створюємо новий токен. Ми тут його теж маємо передати на клієнт
        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );
        // вертаємо дані просто без пароля
        const { passwordHash, ...userData } = user._doc;

        // повертаємо інформацію про юзера
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалося авторизуватися",
        });
    }
};

export const getMe = async (req, res) => {
    try {
        // витягаємо юзера з бази даних по його userId, який отримали з його токена, який розшифрували в мідлвер checkAuth
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "Користувача не знайдено",
            });
        }

        // вертаємо дані просто без пароля
        const { passwordHash, ...userData } = user._doc;

        // повертаємо інформацію про юзера
        res.json(userData);
    } catch (err) {}
};
