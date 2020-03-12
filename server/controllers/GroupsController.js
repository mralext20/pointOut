import express from "express";
import BaseController from "../utils/BaseController";
import { groupService } from "../services/GroupService";
import { visitsService } from "../services/VisitsService";
import { votesService } from "../services/VotesService"
import auth0Provider from "@bcwdev/auth0provider";

export class GroupsController extends BaseController {
  constructor() {
    super("api/groups");
    this.router
      .get("", this.getAllPublicGroups)

      // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
      .use(auth0Provider.getAuthorizedUserInfo)
      .get("/:id/members", this.getMembersByGroupId)
      .post("/:id/members", this.addMember)
      .get("/:id", this.getById)
      .post("", this.create)
      .put("/:id", this.edit)

  }
  async getAllPublicGroups(req, res, next) {
    try {
      let data = await groupService.findAllPublicGroups()
      return res.send(data)
    } catch (error) {
      next(error);
    }
  }
  async getMembersByGroupId(req, res, next) {
    try {
      let data = await groupService.getMembers(req.params.id, req.userInfo.email)
      return res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async getById(req, res, next) {
    try {
      let data = await groupService.findById(req.params.id, req.userInfo.email)
      return res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async create(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      req.body.creatorEmail = req.userInfo.email;
      const created = await groupService.create(req.body, req.userInfo.email)
      res.send(created);
    } catch (error) {
      next(error);
    }
  }

  async addMember(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      let data = await groupService.addMember(req.params.id, req.body.memberEmail, req.userInfo.email);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async edit(req, res, next) {
    try {
      const data = await groupService.edit(req.params.id, req.userInfo.email, req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
}
