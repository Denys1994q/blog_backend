import { body } from "express-validator";

export const loginValidation = [
    body("email", "Неправильний формат пошти").isEmail(),
    body("password", "Неправильна довжина").isLength({ min: 5 }),
];

export const registerValidation = [
    body("email", "Неправильний формат пошти").isEmail(),
    body("password", "Недостатньо символів").isLength({ min: 10 }),
    body("fullName", "Недостатньо символів").isLength({ min: 3 }),
    body("avatarUrl", "Неправильна ссилка").optional().isString(),
];

export const postCreateValidation = [
    body("title", "Введіть заголовок статті").isLength({ min: 10 }).isString(),
    body("text", "Введіть текст статті").isLength({ min: 3 }).isString(),
    body("ingredients", "Неправильний формат даних").optional(),
    body("cookTime", "Неправильний формат даних").optional(),
    body("tags", "Неправильний формат тегів (вкажіть масив)").optional().isString(),
    body("imageUrl", "Неправильне посилання на зображення").optional().isString(),
];
