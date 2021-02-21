import Knex from 'knex';
import dotenv from 'dotenv';
import bcrypt, { hash } from 'bcryptjs';
dotenv.config();
const knexfile = require('../knexfile');
import {LoginService} from './loginService';

describe('loginservice', () => {
    let loginservice: LoginService
    let knex: Knex;

    beforeAll(async()=>{
        knex = Knex(knexfile["test"]);
        loginservice = new LoginService(knex)
    })
    
    beforeEach(async () => {
        await knex('users').del()
        await knex.insert([{
            username: '肥絲大隻',
            email: 'fatgirl.google.com',
            password: await bcrypt.hash('123', 10),
            admin: 0,
            userIcon: 'none'
        }, {
            username: '慘過返印度',
            email: 'indian@yahoo.com.hk',
            password: await bcrypt.hash('456', 10),
            admin: 0,
            userIcon: './userIcon/123.jpeg'
        }]).into('users')
    })
    afterAll(async()=>{
        await knex.destroy()
    })

    it('should get Users info from users email', async()=>{
        const result = await loginservice.getUsers('indian@yahoo.com.hk')
        expect(result[0].username).toBe('慘過返印度')
        expect(result[0].email).toBe('indian@yahoo.com.hk')
        expect(await (bcrypt.compare('456',result[0].password))).toBe(true)
        expect(result[0].admin).toBeFalsy()
        expect(result[0].userIcon).toBe('./userIcon/123.jpeg')
    })

    it('should register successfully(not google)', async () => {
        jest.spyOn(loginservice, 'hashPassword').mockResolvedValue(await bcrypt.hash('789', 10))
        const username= '港仔一名'
        const password = '789'
        const email= 'hongkongboy.hotmail.com'
        const admin= 0 
        const userIcon= './userIcon/456.jpeg'
        const result = await loginservice.addUser(username, password, email, userIcon)
        const userid = (await knex.select('id').from('users').where('username', '港仔一名'))[0].id
        expect(loginservice.hashPassword).toBeCalledTimes(1)
        expect(result[0]).toBe(userid);
    })

    it('should register successfully(google)', async()=>{
        const username = '蓋世寶吊老母'
        const email = 'hangingmother.gmail.com'
        const result = await loginservice.addGoogleUser(username, email)
        expect(result[0].username).toBe('蓋世寶吊老母')
        expect(result[0].email).toBe('hangingmother.gmail.com')
        expect(result[0].userIcon).toBe('none')
    })

    it('should be returning userInfo by email', async()=>{
        const req = {
            body: {
                'email': 'fatgirl.google.com'
            }
        }
        const result = await loginservice.checkEmail(req)
        expect(result[0].username).toBe('肥絲大隻')
        expect(result[0].email).toBe('fatgirl.google.com')
        expect(await bcrypt.compare('123', result[0].password)).toBe(true)
        expect(result[0].admin).toBeFalsy()
        expect(result[0].userIcon).toBe('none')
    })

    it('should return true of checking password', async()=>{
        const plainPassword='123'
        const hashPassword = await bcrypt.hash(plainPassword,10)
        const result = await loginservice.checkPassword(plainPassword, hashPassword)
        expect(result).toBeTruthy()
    })

    it('should return false of checking password', async()=>{
        const plainPassword='456'
        const hashPassword = await bcrypt.hash('123',10)
        const result = await loginservice.checkPassword(plainPassword, hashPassword)
        expect(result).toBe(false)
    })

    it('should return 1 for changing photo', async()=>{
        const userid = (await knex.select('id').from('users').where('username', '肥絲大隻'))[0].id
        const filename = './userIcon/890.jpeg'
        const result = await loginservice.changePhoto(filename, userid)
        expect(result).toBe(1)
    })

    it('should return 0 for changing photo', async()=>{
        const userid = parseInt((await knex.select('id').from('users').where('username', '肥絲大隻'))[0].id) +1000
        const filename = './userIcon/890.jpeg'
        const result = await loginservice.changePhoto(filename, userid)
        expect(result).toBe(0)
    })

    it('should return 1 for changing username', async()=>{
        const userid = (await knex.select('id').from('users').where('username', '肥絲大隻'))[0].id
        const newname = '肥絲細隻'
        const result = await loginservice.changePhoto(newname, userid)
        expect(result).toBe(1)
    })

    it('should return 0 for changing username', async()=>{
        const userid = parseInt((await knex.select('id').from('users').where('username', '肥絲大隻'))[0].id) + 1000
        const newname = '肥絲細隻'
        const result = await loginservice.changePhoto(newname, userid)
        expect(result).toBe(0)
    })

    it('should return 1 for changing email', async()=>{
        const userid = (await knex.select('id').from('users').where('username', '肥絲大隻'))[0].id
        const newemail = 'thingirl@google.com'
        const result = await loginservice.changeEmail(newemail, userid)
        expect(result).toBe(1)
    })

    it('should return 0 for changing username', async()=>{
        const userid = parseInt((await knex.select('id').from('users').where('username', '肥絲大隻'))[0].id) + 1000
        const newemail = 'thingirl.google.com'
        const result = await loginservice.changeEmail(newemail, userid)
        expect(result).toBe(0)
    })

    it('should return 1 for changing password', async()=>{
        const userid = (await knex.select('id').from('users').where('username', '肥絲大隻'))[0].id
        const oldPassword = '123'
        const newPassword = '456'
        const result = await loginservice.changePassword(oldPassword, newPassword, userid)
        expect(result).toBe(1)
    })

    it('should return wrongOldPW for changing password', async()=>{
        const userid = (await knex.select('id').from('users').where('username', '肥絲大隻'))[0].id
        const oldPassword = '456'
        const newPassword = '123'
        const result = await loginservice.changePassword(oldPassword, newPassword, userid)
        expect(result).toBe('wrongOldPW')
    })

    it('should return id, username, email, userIcon as userInfo', async()=>{
        const userid = (await knex.select('id').from('users').where('username', '肥絲大隻'))[0].id
        const result = await loginservice.getUserInfo(userid)
        expect(result[0].id).toBe(userid)
        expect(result[0].username).toBe('肥絲大隻')
        expect(result[0].email).toBe('fatgirl.google.com')
        expect(result[0].userIcon).toBe('none')
    })
})