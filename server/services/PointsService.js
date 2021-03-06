import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import uploadToGCSFrombase64 from "../utils/uploadToGCS";

class PointService {
  async findAll(query = { public: true }) {
    let data = await dbContext.Point.find(query).populate(
      "creator",
      "name picture"
    ).populate("averageVote");
    return data;
  }

  async findByOwnerEmail(creatorEmail) {
    let rawData = await dbContext.Point.find({ creatorEmail }).populate("averageVote")
    let data = rawData.map(point => {
      point = point.toJSON()
      let average = 0
      point.averageVote.forEach(vote => {
        average += vote.vote
      })
      point.averageVote = average / point.voteCount
      return point
    })
    return data
  }

  async findWithinRegion(x1, y1, x2, y2) {
    const region = {
      type: "Polygon",
      coordinates: [[
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2],
        [x1, y1]
      ]]
    }
    const data = await dbContext.Point.find({
      location: {
        $geoWithin: {
          $geometry: region
        }
      }
    }).populate("averageVote")
    return data
  }

  async findWithinRadius(longitude, latitude, distanceInMiles) {
    const data = await dbContext.Point.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [longitude, latitude],
            distanceInMiles / 3963.2] // mines to radians
        }
      }
    }).populate("averageVote")
    return data
  }

  async findById(id) {
    let data = await dbContext.Point.findById(id).populate("averageVote").populate("creator", "name picture");
    if (!data) {
      throw new BadRequest("Invalid Id");
    }
    data = data.toJSON()
    let average = 0;
    data.averageVote.forEach(vote => {
      average += vote.vote
    })
    data.averageVote = average / data.voteCount
    return data;
  }
  async create(object) {
    if (object.imageData) {
      object.image = await uploadToGCSFrombase64(object.imageData)
    }

    const document = await dbContext.Point.create(object)
    await document.populate("group", "title").execPopulate()
    return document
  }
  async reportPoint(id) {
    let point = await dbContext.Point.findById(id);
    point.reported = true;
    return point
  }
  async edit(id, creatorEmail, update) {
    const data = await dbContext.Point.findOneAndUpdate(
      { _id: id, creatorEmail },
      update,
      { new: true }
    )

    if (!data) {
      throw new BadRequest("Invalid ID or you do not own that point")
    }
    return data
  }
  async delete(id, creatorEmail) {
    const oldDoc = await dbContext.Point.deleteOne({ _id: id, creatorEmail })
    if (!oldDoc) {
      throw new BadRequest("you DO not OWN that POINT or it does not exist.")
    }
    await dbContext.Visit.remove({ pointId: id })
    await dbContext.Vote.remove({ pointId: id })
    await dbContext.Favorite.remove({ pointId: id })

  }
}

export const pointService = new PointService();
