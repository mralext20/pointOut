import mongoose from "mongoose";
import ValueSchema from "../models/Value";
import ProfileSchema from "../models/Profile";
import PointSchema from "../models/Point";

class DbContext {
  Values = mongoose.model("Value", ValueSchema);
  Profile = mongoose.model("Profile", ProfileSchema);
  Point = mongoose.model("Point", PointSchema)
}

export const dbContext = new DbContext();
