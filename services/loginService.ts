import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import express from 'express'
import grant from 'grant-express';

import Knex from 'knex'
import { User, GoogleUser } from './models';
import fetch from 'node-fetch';



export class LoginService {
  private static SALT_ROUNDS = 10

  // No Use

  constructor(private knex: Knex) { }

  public async fetchGoogle(accessToken) {
    const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    const json = await fetchRes.json();
    return json;
  }


  // Merge together
  public async getUsers(email: string): Promise<User[]> {
    return await this.knex.select('*').from('users').where('email', email);
  }

  public async getGoogleUsers(email: string): Promise<GoogleUser[]> {

    return await this.knex.select('*').from('users').where('email', email);
  }


  public async addUser(username: string, password: string, email: string, userIcon: string): Promise<User[]> {

    let hash = await this.hashPassword(password)
    return (await this.knex.insert({
      username,
      password: hash,
      email,
      userIcon,
      created_at: new Date(),


    }).into('users').returning('id'))
  }

  public async addGoogleUser(username: string, email: string): Promise<GoogleUser[]> {
    return (await this.knex.insert({
      username,
      email
    }).into('users').returning('*'))
  }



  public checkEmail = async (req: any) => {
    return (await this.knex.select('*').from('users').where("email", req.body.email))
  }


  public async hashPassword(plainPassword: string) {
    const hash = await bcrypt.hash(plainPassword, LoginService.SALT_ROUNDS);
    return hash;
  }
  public async checkPassword(plainPassword: string, hashPassword: string) {
    const match = await bcrypt.compare(plainPassword, hashPassword);
    return match;
  }

  public changePhoto = async (filename, id) => {
    let result = await this.knex('users')
      .where({ id: id })
      .update({ userIcon: filename }).returning("id")

    return (result.length)
  }

  public changeUsername = async (newname, id) => {
    let result = await this.knex('users')
      .where({ id: id })
      .update({ username: newname }).returning("id")

    return (result.length)
  }


  public changeEmail = async (newEmail, id) => {
    let result = await this.knex('users')
      .where({ id: id })
      .update({ email: newEmail }).returning("id")

    return (result.length)
  }

  public changePassword = async (oldPassword, newPassword, id) => {

    let results = await this.knex.select("password").from("users").where("id", id)
    let res = results[0]

    let match = await bcrypt.compare(oldPassword, res.password)
    let newPW = await bcrypt.hash(newPassword, LoginService.SALT_ROUNDS)
    if (match) {
      let result = await this.knex('users')
        .where({ id: id })
        .update({ password: newPW }).returning("id")

      return (result.length)
    } else {

      // throw new Error("Wrong Password");
      return "wrongOldPW";
    }
  }


  public getUserInfo = async (id) => {
    let result = await this.knex.select("id", "username", "email", "userIcon", "admin")
      .from("users")
      .where("id", id)

    return result
  }




}
