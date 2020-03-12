import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const GroupMember = new Schema(
  {
    memberEmail: { type: String, required: true, unique: false },
    groupId: { type: ObjectId, ref: "Group", required: true, unique: false }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

GroupMember.virtual("group", {
  localField: "groupId",
  ref: "Group",
  foreignField: "_id",
  justOne: true
})

GroupMember.index({ memberEmail: 1, groupId: 1 }, { unique: true })

// https://stackoverflow.com/a/49420511/3236881 unique many columms

export default GroupMember;
