import express from "express";
import BaseController from "../utils/BaseController";
import auth0Provider from "@bcwdev/auth0provider";
import { profilesService } from "../services/ProfilesService";
import { pointService } from "../services/PointsService";
import { groupService } from "../services/GroupService";

export class ProfilesController extends BaseController {
  constructor() {
    super("api/profile");
    this.router
      .use(auth0Provider.getAuthorizedUserInfo)
      .get("", this.getUserProfile)
      .get("/points", this.getPointsByOwner)
      .get("/groups", this.getMyGroups)

      .put("/:id", this.edit);
  }
  async getUserProfile(req, res, next) {
    try {
      let profile = await profilesService.getProfile(req.userInfo);
      res.send(profile);
    } catch (error) {
      next(error);
    }
  }
  async getPointsByOwner(req, res, next) {
    try {
      let data = await pointService.findByOwnerEmail(req.userInfo.email);
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async getMyGroups(req, res, next) {
    try {
      let data = await groupService.findMyGroups(req.userInfo.email)
      return res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async edit(req, res, next) {
    try {
      req.body.creatorId = req.user.sub;
      res.send(req.body);
    } catch (error) {
      next(error);
    }
  }
}
