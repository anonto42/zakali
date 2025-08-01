import { Boost } from "./boost.model";

const getBoostPlans = async () => {
    const result = await Boost.find().sort({ createdAt: -1 });
    return result;
};

const createBoostPlan = async (payload: any) => {
    const result = await Boost.create(payload);
    return result;
};

const updateBoostPlan = async (id: string, payload: any) => {
    const result = await Boost.findByIdAndUpdate(id, payload, { new: true });
    return result;
};


export const BoostService = {
    createBoostPlan,
    getBoostPlans,
    updateBoostPlan,
};
