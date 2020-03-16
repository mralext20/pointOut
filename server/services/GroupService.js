import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class GroupService {
  async findAllPublicGroups(query = {}) {
    query.public = true
    let values = await dbContext.Group.find(query).populate(
      "creator",
      "name picture"
    );
    return values;
  }
  async findMyGroups(memberEmail) {
    let groups = await dbContext.GroupMembers.find({ memberEmail })
      .populate("group")
      .populate({ path: "group", populate: { path: "creator", select: "name picture" } })
    return groups
  }

  async findById(id, email) {
    let group = await await dbContext.Group.findById(id).populate("creator", "name picture");
    if (!group.public) {
      await this.getMembers(id, email); // will throw if email is not in group
    }
    return group
  }
  async edit(id, creator, group) {
    let newGroup = await dbContext.Group.findOneAndUpdate({ _id: id, creatorEmail: creator },
      group,
      { new: true })

    if (!newGroup) {
      throw new BadRequest("Invalid ID or you do not own that group")
    }
    await newGroup.populate("creator", "name picture email").execPopulate()
    return newGroup;
  }
  async create(group, email) {
    let newGroup = await dbContext.Group.create(group);
    await dbContext.GroupMembers.create({ groupId: newGroup.id, memberEmail: email });
    await newGroup.populate("creator", "name picture").execPopulate()
    return newGroup;
  }

  async addMember(groupId, NewMemberEmail, email) {
    let user = await dbContext.Profile.findOne({
      email: NewMemberEmail
    })
    if (!user) {
      throw new BadRequest("This user doesn't exist!")
    }
    let newMember = { memberEmail: NewMemberEmail, groupId: groupId }
    let group = await dbContext.Group.findById(groupId);
    if (!group.public) {
      if (email != group.creatorEmail) {
        throw new BadRequest("Invalid ID or you don't own that group")
      }
    }
    let data = await dbContext.GroupMembers.create(newMember)
    return data;
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
  async removeMember(groupId, TargetEmail, UserEmail) {
    if (TargetEmail == UserEmail) {
      return await dbContext.GroupMembers.findOneAndDelete({ groupId, memberEmail: TargetEmail })
    } else {
      let group = await dbContext.Group.findById(groupId)
      if (group.creatorEmail == UserEmail) {
        return await dbContext.GroupMembers.findOneAndDelete({ groupId, memberEmail: TargetEmail })
      }
      throw new BadRequest("you do not own that group or you are not that user")
    }
  }
  async deleteGroup(groupId, email) {
    let group = await dbContext.Group.findOneAndDelete({ _id: groupId, creatorEmail: email });
    await dbContext.GroupMembers.deleteMany({ groupId })
    if (!group) {
      throw new BadRequest("youp do not own that group or it does not exist")
    }
  }
}

export const groupService = new GroupService();
