import { AdminService } from '../services/adminService';
import SocketIO from 'socket.io'
import express from 'express';


export class AdminController{
    constructor(private adminService:AdminService,  private io: SocketIO.Server){}

    public getReportedContent = async (req:express.Request, res:express.Response)=>{
        let result = await this.adminService.getReportedContent();
        res.json(result)
    }



    public goReport = async (req:express.Request, res:express.Response)=>{
        let result; 
        if(!req.body.comment_id){
            result = await this.adminService.addReportedPost(parseInt(req.body.post_id), parseInt(req.body.CatId))
            return res.json({result:true})
        }else{
            result = await this.adminService.addReportedComment(req.body.comment_id, req.body.CatId)
            return res.json({result:false})
        }
    }


}

