import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Point = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    creatorId: { type: String, required: true },
    image: { type: String },
    // GroupId: { type: ObjectId, ref: "group" },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        default: 'Point',
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

Point.virtual("creator", {
  localField: "creatorId",
  ref: "Profile",
  foreignField: "id",
  justOne: true
});


export default Point;
