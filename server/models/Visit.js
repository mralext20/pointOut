import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Visit = new Schema(
  {
    creatorEmail: { type: String, required: true },
    pointId: { type: ObjectId, ref: "Point", required: true }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

Visit.index({ creatorEmail: 1, pointId: 1 }, { unique: true })

export default Visit;
