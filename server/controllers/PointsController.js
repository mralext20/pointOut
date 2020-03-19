import express from "express";
import BaseController from "../utils/BaseController";
import { pointService } from "../services/PointsService";
import { visitsService } from "../services/VisitsService";
import { favoritesService } from "../services/FavoritesService";
import { votesService } from "../services/VotesService";
import auth0Provider from "@bcwdev/auth0provider";
import distance from "../utils/distance";
import Axios from "axios";

export class PointsController extends BaseController {
  constructor() {
    super("api/points");
    this.router
      .get("", this.getAll)
      .get("/:id/visits", this.getVisitsByPointId)
      .get("/:id/favorites", this.getFavoritesByPointId)
      .get("/:id/votes", this.getVoteAverageByPointId)
      .get("/:id", this.getById)

      // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
      .use(auth0Provider.getAuthorizedUserInfo)
      .post("", this.create)
      .post("/:id/report", this.reportPoint)
      .put("/:id", this.edit)
      .delete("/:id", this.delete);

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
        if (req.query.type == 'radius') {
          point.distance = distance(req.query.latitude, req.query.longitude, point.location.coordinates[1], point.location.coordinates[0])
        }
        return point
      })

      if (req.query.type == 'radius') {
        data.sort((a, b) => a.distance - b.distance)
      }
      res.send(data)
    } catch (error) {
      next(error);
    }
  }
  async getVisitsByPointId(req, res, next) {
    try {

      let data = await visitsService.getVisitsByPointId(req.params.id);
      return res.send({ visits: data });
    }
    catch (error) {
      next(error);
    }
  }
  async getFavoritesByPointId(req, res, next) {
    try {
      let data = await favoritesService.getFavoritesByPointId(req.params.id)
      return res.send({ favorites: data })
    } catch (error) {
      next(error);
    }
  }
  async getVoteAverageByPointId(req, res, next) {
    try {
      let data = await votesService.getVoteAverageByPointId(req.params.id);
      return res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async getById(req, res, next) {
    try {
      let data = await pointService.findById(req.params.id);
      return res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      req.body.creatorEmail = req.userInfo.email;
      const created = await pointService.create(req.body);
      await created.populate("creator", "name picture").populate("group", "title").execPopulate();
      // NOTE add extra feilds to created object
      let data = {
        ...created.toJSON(),
        favorites: 0,
        visits: 0,
        voteCount: 0,
        averageVote: null
      };
      res.send(data);
    } catch (error) {
      next(error);
    }
  }

  async reportPoint(req, res, next) {
    let point
    try {
      point = await pointService.reportPoint(req.params.id)
      res.send("Reported.")

    } catch (error) {
      next(error)
    }
    try {
      await Axios.post(process.env.REPORT_WEBHOOK, {
        embeds: [
          {
            title: `${point.title} got reported!`,
            description: `${req.userInfo.name} reported the point with id ${point.id}`,
            tilestamp: new Date()
          }
        ]
      })
    } catch (err) {
      console.error(err)
    }
  }
  async edit(req, res, next) {
    try {
      const data = await pointService.edit(req.params.id, req.userInfo.email, req.body);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await pointService.delete(req.params.id, req.userInfo.email);
      res.send("Visit sucessfully deleted.");
    } catch (error) {
      next(error);
    }
  }
}
