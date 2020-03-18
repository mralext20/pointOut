import express from "express";
import BaseController from "../utils/BaseController";
import auth0Provider from "@bcwdev/auth0provider";
import { profilesService } from "../services/ProfilesService";
import { visitsService } from "../services/VisitsService"
import { favoritesService } from "../services/FavoritesService";
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
      .get("/visits", this.getMyVisits)
      .get("/favorites", this.getMyFavorites)
      .put("/", this.edit);
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
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async getMyGroups(req, res, next) {
    try {
      let data = await groupService.findMyGroups(req.userInfo.email);
      return res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async getMyVisits(req, res, next) {
    try {
      let data = await visitsService.findByUserEmail(req.userInfo.email);
      return res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async getMyFavorites(req, res, next) {
    try {
      let data = await favoritesService.findByUserEmail(req.userInfo.email);
      return res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async edit(req, res, next) {
    try {
      req.body.email = req.userInfo.email;
      let data = await profilesService.updateProfile(req.userInfo, req.body);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
}
