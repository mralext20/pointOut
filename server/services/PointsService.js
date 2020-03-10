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
  async findById(id) {
    let value = await dbContext.Values.findById(id);
    if (!value) {
      throw new BadRequest("Invalid Id");
    }
    return value;
  }

}

export const pointService = new PointService();
