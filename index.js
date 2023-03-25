import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import mongoose from "mongoose";

import * as valid from './validations.js';

import {checkAuth, handleValidationErrors} from './utils/index.js';

import {UserController, PostController} from './controllers/index.js';

dotenv.config();
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Соединение с базой данных установлено');
    })
    .catch(() => {
        console.log('Не удалось подключиться к базе данных');
    });

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({
    storage: storage
})

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('./uploads'));

app.post('/auth/login', valid.loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', valid.registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, valid.postCreateValidation, handleValidationErrors, PostController.create);
app.patch('/posts/:id', checkAuth, valid.postCreateValidation, handleValidationErrors, PostController.update);
app.delete('/posts/:id', checkAuth, PostController.deletePost);

app.listen(4444, (err) => {
    if (err)
        return console.log(err);
    console.log('Example app listening on port 4444!');
});