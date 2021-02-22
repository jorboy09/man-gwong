import knex from 'knex';

export class PostService {
    constructor(private knex: knex) {

    }

    public getComment = async (post_id: number, offset: number, comment_id: number) => {


        let join = () => this.knex.select(
            "comments.id", "comments.content",
            "comments.created_at as comment_created_at", "comments.refer_id", "users.id as user_id", "users.username",    //referID!!
            "users.userIcon", "users.created_at as user_created_at")
            .from("comments")
            .where("comments.post_id", post_id)
            .join("users", "comments.user_id", "=", "users.id")
            .orderBy('comments.id')


        let results;

        if (comment_id == null) {
            results = await join()
        } else {
            results = await join().where("comments.id", comment_id)
        }

        for (const result of results) {
            let no_of_likes = (await this.knex.count("*").from("user_liked_comment").where("liked_comment_id", result.id))[0].count as string
            result.no_of_likes = parseInt(no_of_likes)
            let number = (await this.knex.count("*").from("comments").where("refer_id", result.id))[0].count as string
            result.no_of_comments = parseInt(number)
            let userPostRecord = (await this.knex.count("*").from("posts").where("posts.user_id", "=", result.user_id))[0].count as string
            result.userPostRecord = parseInt(userPostRecord)
            result.original_comment = (await this.knex.select("users.username", "comments.created_at", "comments.content", "comments.id").from("comments").join("users", "comments.user_id", "=", "users.id").where("comments.id", result.refer_id))[0]
        }
        return results

    }


    public addComment = async (comment: {}, refer_id: number | null, user_id: number, post_id: number) => {
        let result = await this.knex.insert({ post_id: post_id, user_id: user_id, content: comment, refer_id: refer_id }).into("comments").returning("*")
        return result.length
    }

    public getCommentPost = async (post_id: number) => {
        let res = await this.knex.select("users.id as user_id", "users.username", "users.created_at as user_createdAt", "users.userIcon", "posts.title", "posts.content", "posts.no_of_dislikes", "posts.no_of_bookmarked", "posts.created_at as post_createdAt")
            .from("posts")
            .where("posts.id", "=", post_id)
            .leftJoin("users", "posts.user_id", "=", "users.id")
        let content = res[0]
        let no_of_like = (await this.knex.count("*").from("users_liked").where("liked_post_id", post_id))[0].count as string
        content.no_of_likes = parseInt(no_of_like)
        let no_of_dislikes = (await this.knex.count("*").from("users_unliked").where("unliked_post_id ", post_id))[0].count as string
        content.no_of_dislikes = parseInt(no_of_dislikes)
        let userPostRecord = (await this.knex.count("*").from("posts").where("posts.user_id", "=", content.user_id))[0].count as string
        content.userPostRecord = parseInt(userPostRecord)
        let no_of_comments = (await this.knex.count("*").from("comments").where("post_id", post_id))[0].count as string
        content.no_of_comments = parseInt(no_of_comments)
        let photo = await this.knex.select("filepath").from("post_photopaths").where("post_id", "=", post_id).orderBy("id")
        content.filepaths = photo

        return content
    }

    public likeComment = async (comment_id: number, user_id: number) => {
        let res = await this.knex.count("*").from("user_liked_comment").where("liked_comment_id", comment_id).andWhere("user_id", user_id)
        if (res[0].count > 0) {
            await this.knex("user_liked_comment").where("liked_comment_id", comment_id).andWhere("user_id", user_id).del();
            return 0
        } else {
            return (await this.knex.insert({ liked_comment_id: comment_id, user_id: user_id }).into("user_liked_comment").returning("id")).length
        }

    }

    public checkLikedComment = async (comment_id: number, user_id: number) => {
        let res = await this.knex.count("*").from("user_liked_comment").where("liked_comment_id", comment_id).andWhere("user_id", user_id)
        if (res[0].count > 0) {
            return { result: true }

        } else {
            return { result: false }
        }

    }

    public checkPostLike = async (post_id: number, user_id: number) => {

        let res = await this.knex.count("*").from("users_liked").where("liked_post_id", post_id).andWhere("user_id", user_id)

        if (res[0].count > 0) {
            return { result: true }
        } else {
            return { result: false }
        }

    }

    public likePost = async (post_id: number, user_id: number) => {
        let res = await this.knex.count("*").from("users_liked").where("liked_post_id", post_id).andWhere("user_id", user_id)

        if (res[0].count > 0) {
            await this.knex("users_liked").where("liked_post_id", post_id).andWhere("user_id", user_id).del();
            return 0
        } else {
            return (await this.knex.insert({ liked_post_id: post_id, user_id: user_id }).into("users_liked").returning("id")).length
        }
    }

    public checkPostDislike = async (post_id: number, user_id: number) => {
        let res = await this.knex.count("*").from("users_unliked").where("unliked_post_id", post_id).andWhere("user_id", user_id)

        if (res[0].count > 0) {
            return { result: true }
        } else {
            return { result: false }
        }

    }

    public disLikePost = async (post_id: number, user_id: number) => {
        let res = await this.knex.count("*").from("users_unliked").where("unliked_post_id", post_id).andWhere("user_id", user_id)

        if (res[0].count > 0) {
            await this.knex("users_unliked").where("unliked_post_id", post_id).andWhere("user_id", user_id).del();
            return 0
        } else {
            return (await this.knex.insert({ unliked_post_id: post_id, user_id: user_id }).into("users_unliked").returning("id")).length
        }
    }
}