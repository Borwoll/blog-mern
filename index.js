import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import {validationResult} from "express-validator";

import {registerValidation} from './validations/auth.js';

import UserModel from './models/User.js';

dotenv.config();
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Соединение с базой данных установлено');
    })
    .catch(() => {
        console.log('Не удалось подключиться к базе данных');
    })

const app = express();

app.use(express.json());

app.post('/auth/login', async (req, res) => {
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
})

app.post('/auth/register', async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});

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
})

app.listen(3000, (err) => {
    if (err)
        return console.log(err);
    console.log('Example app listening on port 3000!');
})