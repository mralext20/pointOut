import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Vote = new Schema(
  {
    creatorEmail: { type: String, required: true, unique: false },
    pointId: { type: ObjectId, ref: "Point", required: true, unique: false },
    vote: { type: Number, required: true, min: 1, max: 5 }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

Vote.index({ creatorEmail: 1, pointId: 1 }, { unique: true })
// https://stackoverflow.com/a/49420511/3236881 unique many columms

Vote.virtual("point", {
  ref: "Point",
  localField: "pointId",
  foreignField: "_id",
  justOne: true
})

export default Vote;
