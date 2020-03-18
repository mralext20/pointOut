import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Favorite = new Schema(
  {
    creatorEmail: { type: String, required: true, unique: false },
    pointId: { type: ObjectId, ref: "Point", required: true, unique: false }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

Favorite.index({ creatorEmail: 1, pointId: 1 }, { unique: true })
// https://stackoverflow.com/a/49420511/3236881 unique many columms

Favorite.virtual("point", {
  ref: "Point",
  localField: "pointId",
  foreignField: "_id",
  justOne: true
})

export default Favorite;
