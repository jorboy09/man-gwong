import express from 'express';

//  Middleware 
//checks if user is logged in

export const isLoggedIn = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session && req.session['user']) {
        next();
    }
    else{
        res.json({result:false})
    }
}

export const isAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.session["admin"])
    if (req.session && req.session['admin'] == true) {
        next();
    }
    else{
        res.json({result:false})
    }
}
