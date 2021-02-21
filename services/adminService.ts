import Knex from 'knex'
import { ReportedComment, ReportedPost, User } from './models';



export class AdminService{
    // small letter
    constructor(private Knex:Knex){}


    // get the post reported in different cat
    public async getReportedContent() {
      let joinfile_post = this.Knex.select("users.id" ,"users.username","posts.content", "posts.created_at")
      .from('post_report')
      .leftJoin("posts","posts.id",'post_report.post_id')
      .leftJoin("users","posts.user_id","users.id") 
      
      // Should be one SQL
      // joinfile_post.whereIn('post_type_id',[1,2,3,4]);

      // select report_type, json_agg(post_report) from post_report inner join report_cats on post_report.post_type_id = report_cats.id group by report_type;
      
      let violencePost = await joinfile_post.where("post_type_id",1)
      let terroristPost = await joinfile_post.where("post_type_id",2)
      let misleadingPost = await joinfile_post.where("post_type_id",3)
      let hatredPost = await joinfile_post.where("post_type_id",4)

      let joinfile_comment = ()=>this.Knex.select("users.id", "users.username", "comments.content", "comments.created_at")
      .from('comment_report')
      .leftJoin("comments","comments.id",'comment_report.comment_id')
      .leftJoin("users","comments.user_id","users.id") 
      
    
      
      let violenceCom = await joinfile_comment().where("comment_type_id",1)
      let terroristCom = await joinfile_comment().where("comment_type_id",2)
      let misleadingCom = await joinfile_comment().where("comment_type_id",3)
      let hatredCom = await joinfile_comment().where("comment_type_id",4)

      let result = {}
      result["violence"] = violencePost.concat(violenceCom)
      result["terrorist"] = terroristPost.concat(terroristCom)
      result["misleading"] = misleadingPost.concat(misleadingCom)
      result["hatred"] = hatredPost.concat(hatredCom)

      return result
    }


      public async getReportedComments(catId:number):Promise<ReportedComment[]> {
        return await this.Knex
        .select('content')
        .count('comment_type_id')
        .from('comment_report')
        .innerJoin('comments','comment_report.comment_id','comments.id')
        .where('comment_type_id',catId)
        .groupBy('content')
      }


    // add the reported type to the post/comment
    public async addReportedPost(post_id:number, post_type_id:number){
      
      
        let result = await this.Knex('post_report').insert({
             post_id,
             post_type_id
        }).returning('*')
        return result.length
   
    }

    public async addReportedComment(comment_id:number, comment_type_id:number){
 
    let result = await this.Knex('comment_report').insert({
          comment_id,
          comment_type_id
     }).returning('*')
     return result.length

 }

      //get the number of reported post/comment in different cat
    public async countReportedPostCat1(catId:number) {
        return await this.Knex.count('*').from('post_report').where('post_type_id','=',catId)

    }



    //destroy /disactivate the user

    public async disactivateUser(id:number){
      return await this.Knex('users').where('id',id).del()
    }
    //get the list of disactivated users


}


