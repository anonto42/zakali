import { model, Schema } from "mongoose";
import { BoostModel, IBoost } from "./boost.interface";

const boostSchema = new Schema<IBoost, BoostModel>(
  {
    price: {
      type: Number,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
); 

export const Boost = model<IBoost, BoostModel>("Boost", boostSchema);