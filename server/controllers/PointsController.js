import express from "express";
import BaseController from "../utils/BaseController";
import { pointService } from "../services/PointsService";
import { visitsService } from "../services/VisitsService";
import { votesService } from "../services/VotesService"
import auth0Provider from "@bcwdev/auth0provider";

export class PointsController extends BaseController {
  constructor() {
    super("api/points");
    this.router
      .get("", this.getAll)
      .get("/:id/visits", this.getVisitsByPointId)
      .get("/:id/votes", this.getVoteAverageByPointId)
      .get("/:id", this.getById)

      // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
      .use(auth0Provider.getAuthorizedUserInfo)
      .post("", this.create)
      .put("/:id", this.edit)
      .delete("/:id", this.delete)

  }
  async getAll(req, res, next) {
    try {
      let rawData;
      switch (req.query.type) {
        case "region":
          rawData = await pointService.findWithinRegion(req.query.x1, req.query.y1, req.query.x2, req.query.y2)
          break;
        case "radius":
          rawData = await pointService.findWithinRadius(
            parseFloat(req.query.longitude),
            parseFloat(req.query.latitude),
            parseFloat(req.query.radius));
          break;
        default:
          rawData = await pointService.findAll()
          break;
      }
      let data = rawData.map(point => {
        point = point.toJSON()
        let average = 0
        point.averageVote.forEach(vote => {
          average += vote.vote
        })
        point.averageVote = average / point.voteCount
        return point
      })

      res.send(data)
    } catch (error) {
      next(error);
    }
  }
  async getVisitsByPointId(req, res, next) {
    try {

      let data = await visitsService.getVisitsByPointId(req.params.id)
      return res.send({ visits: data })
    }
    catch (error) {
      next(error);
    }
  }

  async getVoteAverageByPointId(req, res, next) {
    try {
      let data = await votesService.getVoteAverageByPointId(req.params.id)
      return res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async getById(req, res, next) {
    try {
      let data = await pointService.findById(req.params.id)

      return res.send(data)
    } catch (error) {
      next(error)
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
  async edit(req, res, next) {
    try {
      const data = await pointService.edit(req.params.id, req.userInfo.email, req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      await pointService.delete(req.params.id, req.userInfo.email)
      res.send("Visit sucessfully deleted.")
    } catch (error) {
      next(error)
    }
  }
}
