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

Point.virtual("visits", {
  localField: "_id",
  ref: "Visit",
  foreignField: "pointId",
  count: true
})
Point.virtual("voteCount", {
  localField: "_id",
  ref: "Vote",
  foreignField: "pointId",
  count: true
})
Point.virtual("averageVote", {
  localField: "_id",
  ref: "Vote",
  foreignField: "pointId",
})

Point.pre("find", function () {
  this.populate("visits voteCount")
})

Point.pre("findOne", function () {
  this.populate("visits voteCount")
})

export default Point;
