import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class FavoritesService {

  async getFavoritesByPointId(pointId) {
    const data = await dbContext.Favorite.find({ pointId });
    return data.length;
  }
  async findByUserEmail(creatorEmail) {
    const data = await dbContext.Favorite.find({ creatorEmail }).populate("point");
    return data;
  }

  async createFavorite(rawData) {
    const data = await dbContext.Favorite.create(rawData)
    return data
  }
  async removeFavorite(creatorEmail, pointId) {
    const data = await dbContext.Favorite.findOneAndDelete({ creatorEmail, pointId })
    if (!data) {
      throw new BadRequest("You haven't favoriteed that point")
    }
  }
}

export const favoritesService = new FavoritesService();
