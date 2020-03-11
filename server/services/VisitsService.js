import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class VisitService {
  async findByPointId(pointId) {
    const data = await dbContext.visit.find({ pointId })
    return data.length
  }
  async findByUserEmail(creatorEmail) {
    const data = await dbContext.visit.find({ creatorEmail })
    return data
  }

  async createVisit(creatorEmail, pointId) {
    const data = await dbContext.visit.create({ creatorEmail, pointId })
    return data
  }
  async removeVisit(creatorEmail, pointId) {
    const data = await dbContext.visit.findOneAndDelete({ creatorEmail, pointId })
    if (!data) {
      throw new BadRequest("You haven't visited that point")
    }
  }
}

export const visitService = new VisitService();
