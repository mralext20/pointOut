import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class VisitsService {

  async getVisitsByPointId(pointId) {
    const data = await dbContext.Visit.find({ pointId })
    return data.length
  }
  async findByUserEmail(creatorEmail) {
    const data = await dbContext.Visit.find({ creatorEmail }).populate("point")
    return data
  }

  async createVisit(rawData) {

    const data = await dbContext.Visit.create(rawData)
    return data
  }
  async removeVisit(creatorEmail, pointId) {
    const data = await dbContext.Visit.findOneAndDelete({ creatorEmail, pointId })
    if (!data) {
      throw new BadRequest("You haven't visited that point")
    }
  }


}

export const visitsService = new VisitsService();
