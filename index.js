import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv';

import {registerValidation} from './validations/auth.js';
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";

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

app.post('/auth/login', UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.listen(3000, (err) => {
    if (err)
        return console.log(err);
    console.log('Example app listening on port 3000!');
})