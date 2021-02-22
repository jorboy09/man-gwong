import { CatService } from '../services/catService'
import { Request, Response } from 'express';
import SocketIO from 'socket.io'
import fetch from 'node-fetch';
import * as checklabel from '../checklabel';

export class CatController {

    constructor(private catService: CatService, private io: SocketIO.Server) {

    }

    public getPost = async (req: Request, res: Response) => {
        let category = req.body.category;
        let page = req.body.page;
        // check parseInt
        if (req.session['user'] == null) {
            let result = await this.catService.getPost(page, category);
            res.json(result)
        } else {
            let user_id = parseInt(req.session['user'])
            let result = await this.catService.getPostUser(page, category, user_id)
            res.json(result)
        }
    }

    public addPosts = async (req: Request, res: Response) => {
        try {
            await this.catService.addPosts(req.body, req.files, req.session['user']);
            this.io.emit('post-update')
            res.json({ result: true })
        } catch (error) {
            res.json({ result: false, message: error.message })
        }
    }

    public searchPost = async (req: Request, res: Response) => {
        let searchtext = req.body.search
        let page = req.body.page
        if (req.session['user'] == null) {
            const result = await this.catService.searchPost(searchtext, page)
            res.json(result)
        } else {
            let user_id = parseInt(req.session['user'])
            const result = await this.catService.searchPostUser(searchtext, page, user_id)
            res.json(result)
        }

    }

    public getCategory = async (req: Request, res: Response) => {
        let content = req.body.content;
        try {
            const fetchRes = await fetch('https://lennonwall.stephenjor.xyz', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=utf-8',
                    'User-Agent': '*',
                },
                body: JSON.stringify({
                    content: content
                })
            })
            const json = await fetchRes.text()
            const results = checklabel.default.checkLabelFinal(json)
      
            res.json({ result: results })

        } catch (error) {
            res.json({ result: false, message: error.message })
        }
    }
}
