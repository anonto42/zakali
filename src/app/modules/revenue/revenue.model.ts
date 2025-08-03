import { model, Schema, Types } from "mongoose";
import { SUBSCRIPTION_TYPE } from "../subscription/subscription.interface";

interface IRevenue {
    amount: number;
    type: string;
    user: Types.ObjectId;
};

const RevenueSchema = new Schema<IRevenue>({
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

export const Revenue = model<IRevenue>("Revenue", RevenueSchema);