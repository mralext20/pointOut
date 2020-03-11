import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class VotesService {

    async getVoteAverageByPointId(pointId) {
        const data = await dbContext.Vote.find({ pointId })
        let sum = 0;
        data.forEach(vote => {
            sum += vote.vote;
        })
        return { vote: sum / data.length, voteCount: data.length }
    }

    async findByUserEmail(creatorEmail) {
        const data = await dbContext.Vote.find({ creatorEmail })
        return data
    }

    async createVote(rawData) {

        const data = await dbContext.Vote.create(rawData)
        return data;
    }

    async editVote(creatorEmail, pointId, vote) {

        const data = await dbContext.Vote.findOneAndUpdate(
            { pointId, creatorEmail },
            { vote },
            { new: true }
        )
        return data;
    }

    async removeVote(creatorEmail, pointId) {
        const data = await dbContext.Vote.findOneAndDelete({ creatorEmail, pointId })
        if (!data) {
            throw new BadRequest("You haven't voted for that location.")
        }
    }


}

export const votesService = new VotesService();
