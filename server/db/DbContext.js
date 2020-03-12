import mongoose from "mongoose";
import ValueSchema from "../models/Value";
import ProfileSchema from "../models/Profile";
import PointSchema from "../models/Point";
import VisitSchema from "../models/Visit";
import VoteSchema from "../models/Vote";
import GroupSchema from "../models/Group"
import GroupMemberSchema from "../models/GroupMember"

class DbContext {
  Values = mongoose.model("Value", ValueSchema);
  Profile = mongoose.model("Profile", ProfileSchema);
  Point = mongoose.model("Point", PointSchema);
  Visit = mongoose.model("Visit", VisitSchema);
  Vote = mongoose.model("Vote", VoteSchema);
  Group = mongoose.model("Group", GroupSchema);
  GroupMembers = mongoose.model("GroupMember", GroupMemberSchema);

}

export const dbContext = new DbContext();
