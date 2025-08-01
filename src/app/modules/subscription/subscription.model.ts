import { model, Schema } from "mongoose";
import { ISubscription, SUBSCRIPTION_TYPE, SubscriptionModel } from "./subscription.interface";

const subscriptionSchema = new Schema<ISubscription, SubscriptionModel>(
  {
    price:{
      type: Number,
      required: true,
    },
    subscriptionType:{
      type: String,
      enum: Object.values(SUBSCRIPTION_TYPE),
      required: true,
    },
    features:{
      type: [String],
      default: [],
    }
  },
  { timestamps: true }
); 

export const Subscription = model<ISubscription, SubscriptionModel>("Subscription", subscriptionSchema);