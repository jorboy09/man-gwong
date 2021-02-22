import express from 'express';
import expressSession from 'express-session';



import http from 'http';
import { Server as SocketIO } from 'socket.io';
import grant from 'grant-express'
import multer from 'multer'

//  Controllers and Services
import { LoginController } from './controllers/loginController'
import { CatController } from './controllers/catController'
import {PostController} from './controllers/postController'
import { CatService } from './services/catService'
import { LoginService } from './services/loginService'
import {PostService}  from './services/postService'
import {AdminController}from './controllers/adminController'
import {AdminService} from './services/adminService'


import dotenv from 'dotenv';
import path from 'path';
import Knex from 'knex';

const knexConfig = require('./knexfile');
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"])
dotenv.config({ path: path.resolve(__dirname, '.env') });


const userIcon = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/public/userIcon`);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
    }
})

const postImg = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/public/postImg`);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
    }
})


export const postUpload = multer({storage: postImg})
export const iconUpload = multer({storage: userIcon})
const PORT = 8080;
const app = express();


const server = new http.Server(app);
export const io = new SocketIO(server);

const loginservice = new LoginService(knex)
const catservice = new CatService(knex)
const postservice = new PostService(knex)
const adminservice = new AdminService(knex)

export const loginController = new LoginController(loginservice, io)
export const catController = new CatController(catservice, io)
export const postController = new PostController(postservice, io)
export const adminController = new AdminController(adminservice, io)




//declare before page
app.use(express.json({limit:"2100000kb"}))
app.use(express.urlencoded({ extended: false }))

//  Session middleware and socket init logic
const sessionMiddleware = expressSession({
    secret: 'Open your account today!',
    resave: true,
    saveUninitialized: true
});

app.use(sessionMiddleware);

//  Passing all socket requests through session middleware immediately
io.use((socket, next)=>{
    const request = socket.request as express.Request;
    sessionMiddleware(request, request.res as express.Response, next as express.NextFunction);
});



//  Routers must import after controller is declare 
import { Routes, routes } from './routes';
import { isAdmin } from './guards';

Routes.Initialize()



//  Distributing public static files
app.use(express.static('./public'));
app.use('/admin',isAdmin,express.static('./admin'));

app.use('/', routes)

app.use(grant({
    "defaults": {
        "origin": "http://localhost:8080",
        "transport": "session",
        "state": true,
    },
    "google": {
        "key": process.env.GOOGLE_CLIENT_ID || "",
        "secret": process.env.GOOGLE_CLIENT_SECRET || "",
        "scope": ["profile", "email"],
        "callback": "/login/google"
    }
}) as express.RequestHandler);

app.use((req, res) => {
    res.status(404).send("Error 404 not Found!")
})

server.listen(PORT, () => {
    console.log('Listening to port ', PORT)
})
