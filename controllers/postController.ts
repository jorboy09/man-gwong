import { PostService } from '../services/postService'
import { Request, Response } from 'express';
import SocketIO from 'socket.io'

export class PostController {

    constructor(private postService: PostService, private io: SocketIO.Server) {

    }

    public getComment = async(req,res)=>{
    
        let offset = req.body.offset
        let post_id = req.body.post_id
        let comment_id = req.body.comment_id
        let result = await this.postService.getComment(post_id,offset,comment_id)
        res.json(result) 
    }


    public checkPostLike = async(req: Request, res: Response)=>{
        let user_id = req.session["user"]
        let post_id = req.body.post_id
   
        if(req.session["user"]){
            let result = await this.postService.checkPostLike(post_id,user_id)
            res.json({result:result.result})
        }else{
            res.json({result:false})
        }
       
    }
    public likePost = async(req: Request, res: Response)=>{
        let post_id = req.body.post_id
        let user_id = req.session["user"]
        if(req.session["user"]){
            let result = await this.postService.likePost(post_id,user_id)
            res.json(result)
        }else{
            res.json({result:false})
        }      
    }

    public checkPostDislike = async(req: Request, res: Response)=>{
        let user_id = req.session["user"]
        let post_id = req.body.post_id
   
        if(req.session["user"]){
            let result = await this.postService.checkPostDislike(post_id,user_id)
            res.json({result:result.result})
        }else{
            res.json({result:false})
        }
    }

    public disLikePost = async(req: Request, res: Response)=>{
        let post_id = req.body.post_id
        let user_id = req.session["user"]
        if(req.session["user"]){
            let result = await this.postService.disLikePost(post_id,user_id)
            res.json(result)
        }else{
            res.json({result:false})
        }      
    }

    public addComment = async(req: Request, res: Response)=>{
        let comment = req.body.comment
        let refer_id = req.body.refer_id
        let post_id = req.body.post_id;
        let user_id = req.session["user"]
        const result = await this.postService.addComment(comment,refer_id,user_id,post_id)
        this.io.emit('comment-update')
        if(result==1){
            res.json({result:true})
        }else{
            res.json({result:false})
        }
    }

    public getCommentPost = async(req:Request, res:Response)=>{
        let post_id = req.body.post_id
        const result = await this.postService.getCommentPost(post_id)
        res.json(result)
    }

    public likeComment = async(req:Request, res:Response)=>{
        let comment_id = req.body.comment_id
        let user_id = req.session["user"]
        let result = await this.postService.likeComment(comment_id,user_id)
        res.json(result)
    }

    public checkLikedComment = async(req:Request, res:Response)=>{
        if(req.session["user"]){
            let result = await this.postService.checkLikedComment(req.body.comment_id, req.session["user"])
            res.json(result)
        }else{
            res.json({result:false})
        }
    }

}