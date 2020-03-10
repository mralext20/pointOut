import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class PointService {
  async findAll(query = {}) {
    let values = await dbContext.Values.find(query).populate(
      "creator",
      "name picture"
    );
    return values;
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
    let value = await dbContext.Values.findById(id);
    if (!value) {
      throw new BadRequest("Invalid Id");
    }
    return value;
  }
  async create(object) {
    const document = await dbContext.Point.create(object)
    return document
  }
  async edit(id, creatorId, update) {
    const data = await dbContext.Point.update({ _id: id, creatorId }, update, { new: true })

    if (!data) {
      throw new BadRequest("Invalid ID or you do not own that point")
    }
    return data
  }
  async delete(id, creatorId) {
    const oldDoc = await dbContext.Point.deleteOne({ _id: id, creatorId })
    if (!oldDoc) {
      throw new BadRequest("you DO not OWN that POINT or it does not exist.")
    }
  }
}

export const pointService = new PointService();
