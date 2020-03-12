import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class PointService {
  async findAll(query = { public: true }) {
    let data = await dbContext.Point.find(query).populate(
      "creator",
      "name picture"
    );
    return data;
  }

  async findByOwnerEmail(creatorEmail) {
    return await dbContext.Point.find({ creatorEmail })
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
    })
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
    })
    return data
  }

  async findById(id) {
    let data = await dbContext.Point.findById(id);
    if (!data) {
      throw new BadRequest("Invalid Id");
    }
    return data;
  }
  async create(object) {
    const document = await dbContext.Point.create(object)
    return document
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
  }
}

export const pointService = new PointService();
