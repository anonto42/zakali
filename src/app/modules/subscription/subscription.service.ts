import { Types } from "mongoose"
import { ISubscription } from "./subscription.interface"
import { Subscription } from "./subscription.model"

const getSubscriptionPlans = async () => {
    return await Subscription.find().lean().exec();
}

const createSubscriptionPlan = async (
    data: ISubscription
) => {
    return await Subscription.create(data);
}

const updateSubscriptionPlan = async (
    data: ISubscription & { id: string }
) => {
    const objID = new Types.ObjectId(data.id);
    return await Subscription.findOneAndUpdate({ _id: objID }, data).lean().exec();
}

const deleteSubscriptionPlan = async (
    data: ISubscription & { id: string }
) => {
    const objID = new Types.ObjectId(data.id);
    return await Subscription.findOneAndDelete({ _id: objID }).lean().exec();
}

export const SubscriptionService = {
    getSubscriptionPlans,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
};
