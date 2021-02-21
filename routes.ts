import express from 'express';
import {adminController, catController, loginController, postController} from './server'
import {iconUpload} from './server'
import {postUpload} from './server'
import {isLoggedIn} from './guards'
import {isAdmin} from './guards'

export const routes = express.Router();
export class Routes {
    public static Initialize(){
        //postController
        routes.post('/getComment', postController.getComment )
        routes.post('/addComment', isLoggedIn,postController.addComment )
        routes.post('/checkPostLike',postController.checkPostLike)
        routes.post('/likePost',postController.likePost)
        routes.post('/checkPostDislike',postController.checkPostDislike)
        routes.post('/disLikePost',postController.disLikePost)
   
        routes.post('/getCommentPost', postController.getCommentPost)
        routes.post('/likeComment',isLoggedIn,postController.likeComment)
        routes.post('/checkLikedComment',isLoggedIn,postController.checkLikedComment)
        
        //loginController
        routes.post('/changePhoto',  iconUpload.single("photo"), loginController.changePhoto)
        routes.post('/changeUsername',loginController.changeUsername)
        routes.post('/changeEmail',loginController.changeEmail)
        routes.post('/changePassword',loginController.changePassword)
        routes.get("/getUserInfo",loginController.getUserInfo)
        routes.post('/register',loginController.addUser)
        routes.get('/login/google',loginController.googleLoginIn)
        routes.post('/login', loginController.login)
        routes.get('/logout', loginController.logout)
        routes.get('/checkLogin',loginController.checkLogin)

        //catController
        routes.post("/getPost",catController.getPost)
        routes.post('/addPosts', postUpload.array('photo'), catController.addPosts)
        routes.post('/searchPost', catController.searchPost)
        routes.post('/getCategory', catController.getCategory)
  
        //adminController
        routes.get('/getReportedContent', isAdmin, adminController.getReportedContent)
        routes.post('/report',isLoggedIn,adminController.goReport)
        routes.post('/reportComment',isLoggedIn, adminController.goReport)  
    }
}
