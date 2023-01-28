import { validationResult } from "express-validator";

export default (req, res, next) => {
    // 1. перевіряємо на помилки, якщо є помилка, повертаємо 400 код з описом помилки
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    next();
};
