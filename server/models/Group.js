import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Group = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    creatorEmail: { type: String, required: true },
    public: { type: Boolean, required: true, default: true }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

Group.virtual("creator", {
  localField: "creatorEmail",
  ref: "Profile",
  foreignField: "email",
  justOne: true
});

export default Group;
