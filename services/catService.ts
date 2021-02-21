import knex from 'knex';
export class CatService {
    constructor(private knex: knex) {

    }

    public getPost = async (page: number, category: number) => {
        let totalPosts;
        let offset = 10 * (page - 1);
        let limit = 10;
        let current_page_content;

        let joinfile = () => this.knex.select("users.username", "users.userIcon", "categories.category", "posts.id", "posts.title", "posts.content", "posts.no_of_likes",
            "posts.no_of_dislikes", "posts.no_of_bookmarked", "posts.created_at","posts.category_id")
            .from("posts")
            .join('categories', 'posts.category_id', "=", "categories.id")
            .join("users", "posts.user_id", "=", "users.id")
            .orderBy('posts.id', 'desc')   
            .offset(offset)
            .limit(limit)

        if (category == 0) {
            totalPosts = (await this.knex.count('*').from("posts"))[0].count
            current_page_content = await joinfile()
            for (let current of current_page_content) {
                current['no_of_comment'] = (await this.knex
                    .count({ no_of_comments: 'comments.post_id' })
                    .from('posts')
                    .leftOuterJoin('comments', 'comments.post_id', 'posts.id')
                    .where('posts.id', '=', current.id)
                    .groupBy('posts.id'))[0].no_of_comments
            }
        }
        else {
            current_page_content = await joinfile().where('categories.id', `${category}`)
            for (let current of current_page_content) { // Don't put in for-loop
                current['no_of_comment'] = (await this.knex
                    .count({ no_of_comments: 'comments.post_id' })
                    .from('posts')
                    .leftOuterJoin('comments', 'comments.post_id', 'posts.id')
                    .where('posts.id', '=', current.id)
                    .groupBy('posts.id'))[0].no_of_comments
            }

            totalPosts = (await this.knex.count('*').from("posts").where("category_id", `${category}`))[0].count
        }
        let no_of_page = Math.ceil(totalPosts / 10);
        return ({ no_of_page, current_page_content })
    }

    public getPostUser = async (page: number, category: number, userid: number) => {

        let totalPosts;
        let offset = 10 * (page - 1);
        let limit = 10;
        let current_page_content;

        let joinfile = () => this.knex.select("users.username", "users.userIcon", 
            "categories.category", "posts.id", 
            "posts.title", "posts.content", 
            "posts.no_of_likes","posts.category_id",
            "posts.no_of_dislikes", "posts.no_of_bookmarked",
            "posts.created_at")
            .from("posts")
            .join('categories', 'posts.category_id', "=", "categories.id")
            .join("users", "posts.user_id", "=", "users.id")
            .orderBy('posts.id', 'desc')    
            .offset(offset)
            .limit(limit)

        if (category == 0) {
            totalPosts = (await this.knex.count('*').from("posts"))[0].count
            current_page_content = await joinfile()
            for (let current of current_page_content) {
                current['no_of_comment'] = (await this.knex
                    .count({ no_of_comments: 'comments.post_id' })
                    .from('posts')
                    .leftOuterJoin('comments', 'comments.post_id', 'posts.id')
                    .where('posts.id', '=', current.id)
                    .groupBy('posts.id'))[0].no_of_comments

                current['liked'] = (await this.knex.select('*').from('users_liked')
                    .where({ 'liked_post_id': current.id, 'user_id': userid })).length

                current['disliked'] = (await this.knex.select('*').from('users_unliked')
                    .where({ 'unliked_post_id': current.id, 'user_id': userid })).length
            }
        }
        else {
            current_page_content = await joinfile().where('categories.id', `${category}`)
            for (let current of current_page_content) {
                current['no_of_comment'] = (await this.knex
                    .count({ no_of_comments: 'comments.post_id' })
                    .from('posts')
                    .leftOuterJoin('comments', 'comments.post_id', 'posts.id')
                    .where('posts.id', '=', current.id)
                    .groupBy('posts.id'))[0].no_of_comments

                current['liked'] = (await this.knex.select('*').from('users_liked')
                    .where({ 'liked_post_id': current.id, 'user_id': userid })).length

                current['disliked'] = (await this.knex.select('*').from('users_unliked')
                    .where({ 'unliked_post_id': current.id, 'user_id': userid })).length
            }

            totalPosts = (await this.knex.count('*').from("posts").where("category_id", `${category}`))[0].count
        }
        let no_of_page = Math.ceil(totalPosts / 10);
        return ({ no_of_page, current_page_content })
    }

    public addPosts = async (body: { title: string, content: string, category: number }, files: any, id: number) => {
        await this.knex.transaction(async (trx) => {

            let [post_id] = await trx.insert({
                user_id: id,
                category_id: body.category,
                title: body.title,
                content: body.content,
                no_of_likes: 0,
                no_of_dislikes: 0,
                no_of_bookmarked: 0

            }).into('posts').returning('id')

            for (let file of files) {
                await trx.insert({
                    post_id: post_id,
                    filepath: file.filename
                }).into('post_photopaths').returning("id")
            }
        })
    }

    public searchPost = async (searchtext: String, page: number) => {

        let totalPosts;
        let offset = 10 * (page - 1);
        let limit = 10;
        let current_page_content;
        let string1 = searchtext.toLowerCase() + "%"
        let string2 = "%" + searchtext.toLowerCase() + "%"

        // const searchedResult:{id:number}[] = [];
        // const string1Result = (await this.knex.raw(`select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
        // posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
        // join categories on posts.category_id = categories.id join users on posts.user_id = users.id
        // where posts.title like :string1`,{string1}));
        // searchedResult.push(string1Result.map(row=>row.id));

        current_page_content = (await this.knex.raw(`select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1 union all 
         select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string2 and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1) union all 
         select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.content like :string1 and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1) and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string2) union all 
         select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.content like :string2 and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1) and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string2) and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.content like :string1)
         order By id desc offset :offset limit :limit;`, { string1: string1, string2: string2, offset: offset, limit: limit })).rows

         for (let current of current_page_content) {
            current['no_of_comment'] = (await this.knex
                .count({ no_of_comments: 'comments.post_id' })
                .from('posts')
                .leftOuterJoin('comments', 'comments.post_id', 'posts.id')
                .where('posts.id', '=', current.id)
                .groupBy('posts.id'))[0].no_of_comments
        }

        totalPosts = (await this.knex.raw(`select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1 union all 
         select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string2 and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1) union all 
         select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.content like :string1 and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1) and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string2) union all 
         select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.content like :string2 and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1) and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string2) and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.content like :string1)
         order By id desc;`, { string1: `${searchtext.toLowerCase()}%`, string2: `%${searchtext.toLowerCase()}%` })).rows.length
        let no_of_page = Math.ceil(totalPosts / 10);
        return ({ no_of_page, current_page_content })
    }

    public searchPostUser = async (searchtext: String, page: number, userid: number) => {
        let totalPosts;
        let offset = 10 * (page - 1);
        let limit = 10;
        let current_page_content;
        let string1 = searchtext.toLowerCase() + "%"
        let string2 = "%" + searchtext.toLowerCase() + "%"

        current_page_content = (await this.knex.raw(`select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1 union all 
         select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string2 and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1) union all 
         select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.content like :string1 and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1) and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string2) union all 
         select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.content like :string2 and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1) and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string2) and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.content like :string1)
         order By id desc offset :offset limit :limit;`, { string1: string1, string2: string2, offset: offset, limit: limit })).rows

        for (let current of current_page_content) {
            current['no_of_comment'] = (await this.knex
                .count({ no_of_comments: 'comments.post_id' })
                .from('posts')
                .leftOuterJoin('comments', 'comments.post_id', 'posts.id')
                .where('posts.id', '=', current.id)
                .groupBy('posts.id'))[0].no_of_comments

            current['liked'] = (await this.knex.select('*').from('users_liked')
                .where({ 'liked_post_id': current.id, 'user_id': userid })).length

            current['disliked'] = (await this.knex.select('*').from('users_unliked')
                .where({ 'unliked_post_id': current.id, 'user_id': userid })).length
        }

        totalPosts = (await this.knex.raw(`select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1 union all 
         select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string2 and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1) union all 
         select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.content like :string1 and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1) and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string2) union all 
         select users.username, users."userIcon", categories.category, posts.id, posts.title, posts.content, posts.no_of_likes, 
         posts.no_of_dislikes, posts.no_of_bookmarked, posts.created_at from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.content like :string2 and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string1) and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.title like :string2) and posts.id not in (select posts.id from posts
         join categories on posts.category_id = categories.id join users on posts.user_id = users.id
         where posts.content like :string1)
         order By id desc;`, { string1: `${searchtext.toLowerCase()}%`, string2: `%${searchtext.toLowerCase()}%` })).rows.length
        let no_of_page = Math.ceil(totalPosts / 10);
        return ({ no_of_page, current_page_content })
    }


    public async handleSocketIOData(data: any) {
        return true;
    }



}


