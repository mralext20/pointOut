import express from "express";
import BaseController from "../utils/BaseController";
import { favoritesService } from "../services/FavoritesService";
import auth0Provider from "@bcwdev/auth0provider";

export class FavoritesController extends BaseController {
  constructor() {
    super("api/favorites");
    this.router

      // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
      .use(auth0Provider.getAuthorizedUserInfo)
      .get("", this.getAllFavorites)
      .post("", this.create)
      .delete("/:id", this.delete)

  }
  async getAllFavorites(req, res, next) {
    try {
      let data = await favoritesService.findByUserEmail(req.userInfo.email)
      return res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      req.body.creatorEmail = req.userInfo.email;
      const data = await favoritesService.createFavorite(req.body)
      res.send(data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await favoritesService.removeFavorite(req.userInfo.email, req.params.id)
      return res.send("deleted")
    }
    catch (error) {
      next(error)
    }
  }
}
