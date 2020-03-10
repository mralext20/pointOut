import express from "express";
import BaseController from "../utils/BaseController";
import { pointService } from "../services/PointsService";
import auth0Provider from "@bcwdev/auth0provider";

export class PointsController extends BaseController {
  constructor() {
    super("api/points");
    this.router
      .get("", this.getAll)
      // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
      .use(auth0Provider.getAuthorizedUserInfo)
      .post("", this.create)
    // .edit("/:id", this.edit)
    // .delete("/:id", this.delete)

  }
  async getAll(req, res, next) {
    try {
      switch (req.query.type) {
        case "region":
          return await pointService.findWithinRegion(req.query.x1, req.query.y1, req.query.x2, req.query.y2)
        case "radius":
          return await pointService.findWithinRadius(req.query.longitude, req.query.latitude, req.query.radius)
        default:
          return await pointService.findAll()
      }
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      req.body.creatorEmail = req.userInfo.email;
      const created = await pointService.create(req.body)
      res.send(created);
    } catch (error) {
      next(error);
    }
  }
}
