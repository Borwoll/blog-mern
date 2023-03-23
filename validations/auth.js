import { body } from "express-validator";

export const registerValidation = [
    body("fullName").isLength({ min: 3 }).withMessage("Имя должно состоять минимум из 3 символов"),
    body("email").isEmail().withMessage("Некорректный email"),
    body("password").isLength({ min: 6 }).withMessage("Пароль должен состоять минимум из 6 символов"),
    body("avatar").optional().isURL().withMessage("Некорректный url аватара"),
]