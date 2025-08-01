import { model, Schema, Types } from "mongoose";

export enum SUPPORT_STATUS {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
}

export interface ISupport {
    user: Types.ObjectId;
    status: SUPPORT_STATUS;    
    message: string;
    replay: string;
}

const supportSchema = new Schema<ISupport>({
    message:{
        type: String,
        required: true,
    },
    replay:{
        type: String,
        default: "",
    },
    status:{
        type: String,
        enum: Object.values(SUPPORT_STATUS),
        default: SUPPORT_STATUS.PENDING,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

export const Support = model<ISupport>("Support", supportSchema);
