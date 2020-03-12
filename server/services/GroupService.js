import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import { Query } from "mongoose";

class GroupService {
  async findAllPublicGroups(query = {}) {
    query.public = true
    let values = await dbContext.Group.find(query).populate(
      "creator",
      "name picture"
    );
    return values;
  }
  async findById(id, email) {
    let group = await dbContext.Group.findById(id);
    if (!group.public) {
      await this.getMembers(id, email); // will throw if email is not in group
      return group
    }
  }
  async edit(id, creator, group) {
    let newGroup = await dbContext.Group.updateOne({ _id: id, creatorEmail: creator },
      group,
      { new: true })

    if (!newGroup) {
      throw new BadRequest("Invalid ID or you do not own that group")
    }
    return newGroup;
  }
  async create(group, email) {
    let newGroup = await dbContext.Group.create(group);
    dbContext.GroupMembers.create({ groupId: newGroup.id, memberEmail: email })
    return newGroup;
  }

  async addMember(groupId, NewMember, email) {
    let user = await dbContext.Profile.findOne({
      email: NewMember
    })
    if (!user) {
      throw new BadRequest("This user doesn't exist!")
    }
    let newMember = { memberEmail: NewMember, groupId: groupId }
    let group = await dbContext.Group.findById(groupId);
    if (!group.public) {
      if (email != group.creatorEmail) {
        throw new BadRequest("Invalid ID or you don't own that group")
      }
    }
    dbContext.GroupMembers.create(newMember)
    return newMember;
  }
  async getMembers(groupId, email) {
    let group = await dbContext.Group.findById(groupId)
    if (!group.public) {
      let user = await dbContext.GroupMembers.find({ groupId: groupId, memberEmail: email })
      if (!user) {
        throw new BadRequest("Invalid ID or you aren't part of that group")
      }
    }
    let members = await dbContext.GroupMembers.find({ groupId: groupId })
    return members;
  }
}

export const groupService = new GroupService();
