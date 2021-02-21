import Knex from 'knex';
import dotenv from 'dotenv';
import bcrypt, { hash } from 'bcryptjs';
dotenv.config();
const knexfile = require('../knexfile');
import { CatService } from './catService';

describe('CatService', () => {
    let catservice: CatService
    let knex: Knex;

    beforeAll(async()=>{
        knex = Knex(knexfile["test"]);
        catservice = new CatService(knex)
    })
    beforeEach(async () => {
        await knex('users_liked').del()
        await knex('users_unliked').del()
        await knex('post_photopaths').del()
        await knex('posts').del()
        await knex('categories').del()
        await knex('users').del()
        let category_id = await knex.insert([{
            category: '新聞'
        }, {
            category: '科技'
        }, {
            category: '生活'
        }, {
            category: '興趣'
        }]).into('categories').returning('id')
        console.log(category_id)
        let userid = await knex.insert({
            username: '肥絲大隻',
            email: 'fatgirl.google.com',
            password: await bcrypt.hash('123', 10),
            admin: 0,
            userIcon: 'none'
        }).into('users').returning('id')
        let postid = await knex.insert({
            user_id: userid[0],
            category_id: category_id[2],
            title: '天真得只有你 疫情爆第三波要怪誰',
            no_of_likes: 999,
            no_of_dislikes: 2,
            no_of_bookmarked: 500,
            content: '天真得只有你 疫情爆第三波要怪誰以為留在家裡不去外遊 限聚竟得不到讚許那次得你冒險跳盡探戈',
            report_cat_id: null
        }).into('posts').returning('id')
        await knex.insert({
            liked_post_id: postid[0],
            user_id: userid[0]
        }).into('users_liked')
    })
    afterAll(async()=>{
        await knex('users_liked').del()
        await knex('users_unliked').del()
        await knex('post_photopaths').del()
        await knex('posts').del()
        await knex('categories').del()
        await knex('users').del()
        await knex.destroy()
    })

    it("should return page number and page_content(category 0)(Havn't login)", async () => {
        const posts = await catservice.getPost(1, 0);
        expect(posts.no_of_page).toBe(1);
        expect(posts.current_page_content[0].username).toBe('肥絲大隻')
        expect(posts.current_page_content[0].userIcon).toBe('none')
        expect(posts.current_page_content[0].category).toBe('生活')
        expect(posts.current_page_content[0].title).toBe('天真得只有你 疫情爆第三波要怪誰')
        expect(posts.current_page_content[0].content).toBe('天真得只有你 疫情爆第三波要怪誰以為留在家裡不去外遊 限聚竟得不到讚許那次得你冒險跳盡探戈')
        expect(posts.current_page_content[0].no_of_likes).toBe(999)
        expect(posts.current_page_content[0].no_of_dislikes).toBe(2)
        expect(posts.current_page_content[0].no_of_bookmarked).toBe(500)
        expect(posts.current_page_content[0].no_of_comment).toBe('0')
        expect(posts.current_page_content[0].liked).toBe(undefined)
        expect(posts.current_page_content[0].disliked).toBe(undefined)
    })

    it("should return page number and page_content(category 2)(Havn't login)", async () => {
        const category_id = (await knex.select('id').from('categories').where('category', '生活'))[0].id
        const posts = await catservice.getPost(1, category_id);
        expect(posts.no_of_page).toBe(1);
        expect(posts.current_page_content[0].username).toBe('肥絲大隻')
        expect(posts.current_page_content[0].userIcon).toBe('none')
        expect(posts.current_page_content[0].category).toBe('生活')
        expect(posts.current_page_content[0].title).toBe('天真得只有你 疫情爆第三波要怪誰')
        expect(posts.current_page_content[0].content).toBe('天真得只有你 疫情爆第三波要怪誰以為留在家裡不去外遊 限聚竟得不到讚許那次得你冒險跳盡探戈')
        expect(posts.current_page_content[0].no_of_likes).toBe(999)
        expect(posts.current_page_content[0].no_of_dislikes).toBe(2)
        expect(posts.current_page_content[0].no_of_bookmarked).toBe(500)
        expect(posts.current_page_content[0].no_of_comment).toBe('0')
        expect(posts.current_page_content[0].liked).toBe(undefined)
        expect(posts.current_page_content[0].disliked).toBe(undefined)
    })

    it('should return page number and page_content(category 1)', async () => {
        const category_id = (await knex.select('id').from('categories').where('category', '新聞'))[0].id
        const posts = await catservice.getPost(1, category_id);
        expect(posts.no_of_page).toBe(0);
        expect(posts.current_page_content.length).toBe(0)
    })

    it('should be able to add post', async () => {
        const category_id = (await knex.select('id').from('categories').where('category', '生活'))[0].id
        const body = {
            title: '第一屆連登創意填色比賽',
            content: '大家成日催我搞第二個比賽，終於俾大家等到喇今次比賽除咗靠正負皮分勝負仲會有特別獎，分别係：最離題大獎最多負皮鞭屍（獎？）',
            category: category_id
        }
        const files = [{filename: 'ownefasdnzx.jpeg'}]
        const session = (await knex.select().from('users'))[0].id
        await catservice.addPosts(body, files, session)
        const newpost = await knex.select('*').from('posts').where('title', '第一屆連登創意填色比賽')
        expect(newpost.length).toBe(1)
    })

    it("should be able to search post(Havn't login)", async()=>{
        const posts = await catservice.searchPost('天真得只有你', 1);
        expect(posts.no_of_page).toBe(1);
        expect(posts.current_page_content[0].username).toBe('肥絲大隻')
        expect(posts.current_page_content[0].userIcon).toBe('none')
        expect(posts.current_page_content[0].category).toBe('生活')
        expect(posts.current_page_content[0].title).toBe('天真得只有你 疫情爆第三波要怪誰')
        expect(posts.current_page_content[0].content).toBe('天真得只有你 疫情爆第三波要怪誰以為留在家裡不去外遊 限聚竟得不到讚許那次得你冒險跳盡探戈')
        expect(posts.current_page_content[0].no_of_likes).toBe(999)
        expect(posts.current_page_content[0].no_of_dislikes).toBe(2)
        expect(posts.current_page_content[0].no_of_bookmarked).toBe(500)
        expect(posts.current_page_content[0].no_of_comment).toBe('0')
        expect(posts.current_page_content[0].liked).toBe(undefined)
        expect(posts.current_page_content[0].disliked).toBe(undefined)
    })

    it("should return page number and page_content(category 0)(logined)", async () => {
        let userid = (await knex.select('id').from('users').where('username', '肥絲大隻'))[0].id
        const posts = await catservice.getPostUser(1, 0, userid);
        expect(posts.no_of_page).toBe(1);
        expect(posts.current_page_content[0].username).toBe('肥絲大隻')
        expect(posts.current_page_content[0].userIcon).toBe('none')
        expect(posts.current_page_content[0].category).toBe('生活')
        expect(posts.current_page_content[0].title).toBe('天真得只有你 疫情爆第三波要怪誰')
        expect(posts.current_page_content[0].content).toBe('天真得只有你 疫情爆第三波要怪誰以為留在家裡不去外遊 限聚竟得不到讚許那次得你冒險跳盡探戈')
        expect(posts.current_page_content[0].no_of_likes).toBe(999)
        expect(posts.current_page_content[0].no_of_dislikes).toBe(2)
        expect(posts.current_page_content[0].no_of_bookmarked).toBe(500)
        expect(posts.current_page_content[0].no_of_comment).toBe('0')
        expect(posts.current_page_content[0].liked).toBe(1)
        expect(posts.current_page_content[0].disliked).toBe(0)
    })

    it("should return page number and page_content(category 2)(logined)", async () => {
        let userid = (await knex.select('id').from('users').where('username', '肥絲大隻'))[0].id
        const posts = await catservice.getPostUser(1, 0, userid);
        expect(posts.no_of_page).toBe(1);
        expect(posts.current_page_content[0].username).toBe('肥絲大隻')
        expect(posts.current_page_content[0].userIcon).toBe('none')
        expect(posts.current_page_content[0].category).toBe('生活')
        expect(posts.current_page_content[0].title).toBe('天真得只有你 疫情爆第三波要怪誰')
        expect(posts.current_page_content[0].content).toBe('天真得只有你 疫情爆第三波要怪誰以為留在家裡不去外遊 限聚竟得不到讚許那次得你冒險跳盡探戈')
        expect(posts.current_page_content[0].no_of_likes).toBe(999)
        expect(posts.current_page_content[0].no_of_dislikes).toBe(2)
        expect(posts.current_page_content[0].no_of_bookmarked).toBe(500)
        expect(posts.current_page_content[0].no_of_comment).toBe('0')
        expect(posts.current_page_content[0].liked).toBe(1)
        expect(posts.current_page_content[0].disliked).toBe(0)
    })

    it("should be able to search post(logined)", async()=>{
        let userid = (await knex.select('id').from('users').where('username', '肥絲大隻'))[0].id
        const posts = await catservice.searchPostUser('天真得只有你', 1, userid);
        expect(posts.no_of_page).toBe(1);
        expect(posts.current_page_content[0].username).toBe('肥絲大隻')
        expect(posts.current_page_content[0].userIcon).toBe('none')
        expect(posts.current_page_content[0].category).toBe('生活')
        expect(posts.current_page_content[0].title).toBe('天真得只有你 疫情爆第三波要怪誰')
        expect(posts.current_page_content[0].content).toBe('天真得只有你 疫情爆第三波要怪誰以為留在家裡不去外遊 限聚竟得不到讚許那次得你冒險跳盡探戈')
        expect(posts.current_page_content[0].no_of_likes).toBe(999)
        expect(posts.current_page_content[0].no_of_dislikes).toBe(2)
        expect(posts.current_page_content[0].no_of_bookmarked).toBe(500)
        expect(posts.current_page_content[0].no_of_comment).toBe('0')
        expect(posts.current_page_content[0].liked).toBe(1)
        expect(posts.current_page_content[0].disliked).toBe(0)
    })
})