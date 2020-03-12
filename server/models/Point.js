import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId


const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: "Point",
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const Point = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true, default: "no description given" },
    creatorEmail: { type: String, required: true },
    image: { type: String },
    groupId: { type: ObjectId, ref: "group" },
    public: { type: Boolean, default: true, required: true },
    location: {
      type: pointSchema,
      required: true
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

Point.virtual("creator", {
  localField: "creatorEmail",
  ref: "Profile",
  foreignField: "email",
  justOne: true
});


export default Point;
