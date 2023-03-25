import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            avatar: req.body.avatar,
            passwordHash: hash
        })

        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id
        }, 'secret', {expiresIn: '7d'});

        const { passwordHash, ... userData } = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Не удалось создать пользователя'});
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if (!user)
            return res.status(400).json({message: 'Неверное имя пользователя или пароль'});
        const isPasswordValid = await bcrypt.compare(req.body.password, user.passwordHash);
        if (!isPasswordValid)
            return res.status(400).json({message: 'Неверное имя пользователя или пароль'});
        const token = jwt.sign({
            _id: user._id
        }, 'secret', {expiresIn: '7d'});
        const { passwordHash, ... userData } = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Не удалось авторизоваться'});
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        const { passwordHash, ... userData } = user._doc;
        res.json({
            ...userData
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Не удалось получить данные пользователя'});
    }
};