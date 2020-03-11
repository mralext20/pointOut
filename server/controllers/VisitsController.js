import express from "express";
import BaseController from "../utils/BaseController";
import { visitsService } from "../services/VisitsService";
import auth0Provider from "@bcwdev/auth0provider";

export class VisitsController extends BaseController {
  constructor() {
    super("api/visits");
    this.router

      // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
      .use(auth0Provider.getAuthorizedUserInfo)
      .get("", this.getAllVisits)
      .post("", this.create)
      .delete("/:id", this.delete)

  }
  async getAllVisits(req, res, next) {
    try {
      let data = await visitsService.findByUserEmail(req.userInfo.email)
      return res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      req.body.creatorEmail = req.userInfo.email;
      visitsService.createVisit(req.body)
      res.send(req.body);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await visitsService.removeVisit(req.userInfo.email, req.params.id)
      return res.send("deleted")
    }
    catch (error) {
      next(error)
    }
  }
}
