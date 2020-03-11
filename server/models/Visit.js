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

export default Visit;
