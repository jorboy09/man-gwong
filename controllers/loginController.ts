import { LoginService } from "../services/loginService";
import fetch from 'node-fetch';
import SocketIO from 'socket.io';
import * as Knex from 'knex';
import express from 'express';
import { Console } from "console";

import expressSession from 'express-session';
export class LoginController {

    constructor(private loginService: LoginService,
        private io: SocketIO.Server) { }

    googleLoginIn = async (req, res) => {
        const accessToken = req.session?.['grant'].response.access_token;

        const json = await this.loginService.fetchGoogle(accessToken);

        if (json.verified_email) {
            let users = (await this.loginService.getGoogleUsers(json.email))
            if (users.length < 1) {
                await this.loginService.addGoogleUser(json.name, json.email)
                users = (await this.loginService.getGoogleUsers(json.email))
            }
            const user = users[0];
            if (req.session) {
                req.session['user'] = user.id
            }
        }
        res.redirect('/')
    }



    public addUser = async (req: express.Request, res: express.Response) => {

        // Validation

        if (req.body.username == null || req.body.username.trim() == '') {
            res.status(400).json({ error: 'username is incorrect' })

        }
        else if (req.body.password == null || req.body.password.trim() == '') {
            res.status(400).json({ error: 'password is incorrect' })

        }
        else if (req.body.email == null || req.body.email.trim() == '') {
            res.status(400).json({ error: 'email is incorrect' })

        } else {



            const user = (await this.loginService.addUser(req.body.username, req.body.password, req.body.email, req.body.userIcon))[0]

            req.session["user"] = user



            res.json({ result: true })
        }


    }



    public login = async (req: express.Request, res: express.Response) => {


        const user = (await this.loginService.getUsers(req.body.email))[0]


        const match = await this.loginService.checkPassword(req.body.password, user.password+"");

        if (match) {

            req.session['user'] = user.id
            req.session['admin'] = user.admin

            return res.json({ result: true, token: user.password }); // To the protected page.
        } else {
            return res.status(401).redirect('/index.html?error=Incorrect+Password')
        }


    }


    logout = async (req: express.Request, res: express.Response) => {
        req.session?.destroy(() => {
            res.redirect('/')
        });
    }

    public getUserInfo = async (req, res) => {
        let result = (await this.loginService.getUserInfo(req.session["user"]))[0]    //2 is mocking req.session["user"] means id

        return res.json(
            {
                id: result.id,
                username: result.username,
                email: result.email,
                userIcon: result.userIcon,
                admin: result.admin
            }
        )
    }

    public changePhoto = async (req, res) => {
        await this.loginService.changePhoto(req.file.filename, req.session["user"]) //req.session["user"]
        res.json("ok")
    }

    public changeUsername = async (req, res) => {

        await this.loginService.changeUsername(req.body.newUsername, req.session["user"]) //req.session["user"]
        res.json("ok")
    }

    public changeEmail = async (req, res) => {
        await this.loginService.changeEmail(req.body.newEmail, req.session["user"]) //2 = req.session["user"]
        res.json("ok")
    }

    public changePassword = async (req, res) => {

        let result = (await this.loginService.changePassword(req.body.oldPassword, req.body.newPassword, req.session["user"])) //2 = req.session["user"]

        if (result == "wrongOldPW") {
            res.json("wrongOldPW")
        } else {
            res.json("ok")
        }
    }

    public checkLogin = async (req, res) => {
        if (req.session["user"]) {
            res.json({ result: true })
        } else {
            res.json({ result: false })
        }
    }


}
