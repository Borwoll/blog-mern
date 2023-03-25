import { body } from "express-validator";

export const loginValidation = [
    body('email').isEmail().withMessage('Неверный формат email'),
    body('password').isLength({min: 6}).withMessage('Пароль должен быть больше 6 символов')
]

export const registerValidation = [
    body("fullName").isLength({ min: 3 }).withMessage("Имя должно состоять минимум из 3 символов"),
    body("email").isEmail().withMessage("Некорректный email"),
    body("password").isLength({ min: 6 }).withMessage("Пароль должен состоять минимум из 6 символов"),
    body("avatar").optional().isURL().withMessage("Некорректный url аватара"),
]

export const postCreateValidation = [
    body('title').isLength({min: 5}).isString().withMessage('Минимум 5 символов'),
    body('content').isLength({min: 5}).isString().withMessage('Минимум 5 символов'),
    body('tags').optional().isArray().withMessage('Тег должен быть массивом'),
    body('image').optional().isURL().withMessage('Некорректный url изображения'),
]