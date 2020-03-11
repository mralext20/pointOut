import mongoose from "mongoose";
import ValueSchema from "../models/Value";
import ProfileSchema from "../models/Profile";
import PointSchema from "../models/Point";
import VisitSchema from "../models/Visit"

class DbContext {
  Values = mongoose.model("Value", ValueSchema);
  Profile = mongoose.model("Profile", ProfileSchema);
  Point = mongoose.model("Point", PointSchema);
  visit = mongoose.model("Visit", VisitSchema);
}

export const dbContext = new DbContext();
