import Knex from 'knex';
import dotenv from 'dotenv';
import bcrypt, { hash } from 'bcryptjs';
dotenv.config();
const knexfile = require('../knexfile');
import {PostService} from './postService';


describe('PostService', () => {
    let postservice: PostService;
    let knex: Knex
    beforeAll(async()=>{
        knex = Knex(knexfile['test'])
        postservice= new PostService(knex)
    })
    beforeEach(async () => {
        await knex('user_liked_comment').del()
        await knex('users_liked').del()
        await knex('users_unliked').del()
        await knex('post_photopaths').del()
        await knex('fav_post').del()
        await knex('comments').del()
        await knex('posts').del()
        await knex('categories').del()
        await knex('users').del()
        let userid = await knex.insert({
            username: '肥絲大隻',
            password: await bcrypt.hash('123', 10),
            email: 'fatgirl.google.com',
            userIcon: 'none'
        }).into('users').returning('id')
        let category_id = await knex.insert([{
            category: '新聞'
        }, {
            category: '科技'
        }, {
            category: '生活'
        }, {
            category: '興趣'
        }]).into('categories').returning('id')
        let postid = await knex.insert({
            user_id: userid[0],
            category_id: category_id[2],
            title: '天真得只有你 疫情爆第三波要怪誰',
            no_of_likes: 0,
            no_of_dislikes: 0,
            no_of_bookmarked: 500,
            content: '天真得只有你 疫情爆第三波要怪誰以為留在家裡不去外遊 限聚竟得不到讚許那次得你冒險跳盡探戈'
        }).into('posts').returning('id')
        let commentid = await knex.insert({
            post_id: postid[0],
            user_id: userid[0],
            content: {content: '之前d疫苗係咪全部唔岩用'},
        }).into('comments').returning('id')
        await knex.insert({
            post_id: postid[0],
            user_id: userid[0],
            content: {content:'收皮啦'},
            refer_id: commentid[0]
        }).into('comments')
        await knex.insert({
            user_id: userid[0],
            post_id: postid[0]
        }).into('fav_post')
    })

    afterAll(async()=>{
        await knex('user_liked_comment').del()
        await knex('users_liked').del()
        await knex('users_unliked').del()
        await knex('post_photopaths').del()
        await knex('fav_post').del()
        await knex('comments').del()
        await knex('posts').del()
        await knex('categories').del()
        await knex('users').del()
        await knex.destroy()
    })

    it('should be able to get content of post', async () => {
        const userid = (await knex.select('id').from('users'))[0].id
        const postid = (await knex.select('id').from('posts'))[0].id
        const result = await postservice.getCommentPost(postid)
        expect(result.user_id).toBe(userid)
        expect(result.username).toBe('肥絲大隻')
        expect(result.userIcon).toBe('none')
        expect(result.title).toBe('天真得只有你 疫情爆第三波要怪誰')
        expect(result.content).toBe('天真得只有你 疫情爆第三波要怪誰以為留在家裡不去外遊 限聚竟得不到讚許那次得你冒險跳盡探戈')
        expect(result.no_of_likes).toBe(0)
        expect(result.no_of_dislikes).toBe(0)
        expect(result.no_of_bookmarked).toBe(500)
        expect(result.userPostRecord).toBe(1)
        expect(result.no_of_comments).toBe(2)
    })

    it('should return comment', async()=>{
        const userid = (await knex.select('id').from('users'))[0].id
        const postid = (await knex.select('id').from('posts'))[0].id
        const commentid = (await knex.select('id').from('comments'))[0].id
        const result = (await postservice.getComment(postid, 0, commentid))
        expect(result[0].content.content).toBe('之前d疫苗係咪全部唔岩用')
        expect(result[0].refer_id).toBeNull()
        expect(result[0].user_id).toBe(userid)
        expect(result[0].username).toBe('肥絲大隻')
        expect(result[0].userIcon).toBe('none')
        expect(result[0].no_of_likes).toBe(0)
        expect(result[0].no_of_comments).toBe(1)
        expect(result[0].userPostRecord).toBe(1)
        expect(result[0].original_comment).toBeUndefined()
    })

    it('should return comment of comment', async()=>{
        const userid = (await knex.select('id').from('users'))[0].id
        const postid = (await knex.select('id').from('posts'))[0].id
        const commentid = (await knex.select('id').from('comments'))
        const result = (await postservice.getComment(postid, 0, commentid[1].id))
        expect(result[0].content.content).toBe('收皮啦')
        expect(result[0].refer_id).toBe(commentid[0].id)
        expect(result[0].user_id).toBe(userid)
        expect(result[0].username).toBe('肥絲大隻')
        expect(result[0].userIcon).toBe('none')
        expect(result[0].no_of_likes).toBe(0)
        expect(result[0].no_of_comments).toBe(0)
        expect(result[0].userPostRecord).toBe(1)
        expect(result[0].original_comment).toBeDefined()
    })

    it('should return 1 for adding comment', async()=>{
        const comment = {content: 'hi'}
        const refer_id = null
        const userid = (await knex.select('id').from('users'))[0].id
        const postid = (await knex.select('id').from('posts'))[0].id
        const result = await postservice.addComment(comment, refer_id, userid, postid)
        expect(result).toBe(1)
    })

    it('should return 1 for adding comment of comment', async()=>{
        const comment = {content: 'hi'}
        const refer_id = (await knex.select('id').from('comments'))[0].id
        const userid = (await knex.select('id').from('users'))[0].id
        const postid = (await knex.select('id').from('posts'))[0].id
        const result = await postservice.addComment(comment, refer_id, userid, postid)
        expect(result).toBe(1)
    })

    it('should return 0 from removing like comment', async()=>{
        const userid = (await knex.select('id').from('users'))[0].id
        const commentid = (await knex.select('id').from('comments'))[0].id
        await knex.insert({user_id: userid, liked_comment_id: commentid}).into('user_liked_comment')
        const result = await postservice.likeComment(commentid, userid)
        expect(result).toBe(0)
    })

    it('should return 1 from liking comment', async()=>{
        const userid = (await knex.select('id').from('users'))[0].id
        const commentid = (await knex.select('id').from('comments'))[0].id
        const result = await postservice.likeComment(commentid, userid)
        expect(result).toBe(1)
    })

    it('should retrun result true for liked comment', async()=>{
        const userid = (await knex.select('id').from('users'))[0].id
        const commentid = (await knex.select('id').from('comments'))[0].id
        await knex.insert({user_id: userid, liked_comment_id: commentid}).into('user_liked_comment')
        const result = await postservice.checkLikedComment(commentid, userid)
        expect(result.result).toBe(true)
    })

    it('should retrun result false for not liked comment', async()=>{
        const userid = (await knex.select('id').from('users'))[0].id
        const commentid = (await knex.select('id').from('comments'))[0].id
        const result = await postservice.checkLikedComment(commentid, userid)
        expect(result.result).toBe(false)
    })

    it('should return true for liked Post', async()=>{
        const postid = (await knex.select('id').from('posts'))[0].id
        const userid = (await knex.select('id').from('users'))[0].id
        await knex.insert({liked_post_id: postid, user_id: userid}).into('users_liked')
        const result = await postservice.checkPostLike(postid, userid)
        expect(result.result).toBe(true)
    })

    it('should return false for not liked Post', async()=>{
        const postid = (await knex.select('id').from('posts'))[0].id
        const userid = (await knex.select('id').from('users'))[0].id
        const result = await postservice.checkPostLike(postid, userid)
        expect(result.result).toBe(false)
    })

    it('should return 0 from removing like post', async()=>{
        const userid = (await knex.select('id').from('users'))[0].id
        const postid = (await knex.select('id').from('posts'))[0].id
        await knex.insert({user_id: userid, liked_post_id: postid}).into('users_liked')
        const result = await postservice.likePost(postid, userid)
        expect(result).toBe(0)
    })

    it('should return 1 from liking post', async()=>{
        const userid = (await knex.select('id').from('users'))[0].id
        const postid = (await knex.select('id').from('posts'))[0].id
        const result = await postservice.likePost(postid, userid)
        expect(result).toBe(1)
    })

    it('should return true for disliked Post',async()=>{
        const postid = (await knex.select('id').from('posts'))[0].id
        const userid = (await knex.select('id').from('users'))[0].id
        await knex.insert({unliked_post_id: postid, user_id: userid}).into('users_unliked')
        const result = await postservice.checkPostDislike(postid, userid)
        expect(result.result).toBe(true)
    })

    it('should return false for disliked Post',async()=>{
        const postid = (await knex.select('id').from('posts'))[0].id
        const userid = (await knex.select('id').from('users'))[0].id
        const result = await postservice.checkPostDislike(postid, userid)
        expect(result.result).toBe(false)
    })

    it('should return 0 from removing like post', async()=>{
        const userid = (await knex.select('id').from('users'))[0].id
        const postid = (await knex.select('id').from('posts'))[0].id
        await knex.insert({user_id: userid, unliked_post_id: postid}).into('users_unliked')
        const result = await postservice.disLikePost(postid, userid)
        expect(result).toBe(0)
    })

    it('should return 1 from liking post', async()=>{
        const userid = (await knex.select('id').from('users'))[0].id
        const postid = (await knex.select('id').from('posts'))[0].id
        const result = await postservice.disLikePost(postid, userid)
        expect(result).toBe(1)
    })
})