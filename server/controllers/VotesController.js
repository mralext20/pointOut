import express from "express";
import BaseController from "../utils/BaseController";
import { votesService } from "../services/VotesService";
import auth0Provider from "@bcwdev/auth0provider";

export class VotesController extends BaseController {
    constructor() {
        super("api/votes");
        this.router

            // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
            .use(auth0Provider.getAuthorizedUserInfo)
            .get("", this.findByUserEmail)
            .post("", this.create)
            .put("/:id", this.edit)
            .delete("/:id", this.delete)

    }

    async findByUserEmail(req, res, next) {

        try {

            let data = await votesService.findByUserEmail(req.userInfo.email)
            return res.send(data);

        }
        catch (error) {

            next(error);

        }

    }

    async create(req, res, next) {
        try {
            // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
            req.body.creatorEmail = req.userInfo.email;
            const data = await votesService.createVote(req.body)
            res.send(data);
        } catch (error) {
            next(error);
        }
    }

    async edit(req, res, next) {
        try {

            const data = await votesService.editVote(req.userInfo.email, req.params.id, req.body.vote)
            res.send(data)
        } catch (error) {

            next(error);
        }
    }



    async delete(req, res, next) {
        try {
            const data = await votesService.removeVote(req.userInfo.email, req.params.id)
            return res.send("Your vote has been deleted.")
        }
        catch (error) {
            next(error)
        }
    }
}
