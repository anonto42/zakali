import { model, Schema } from "mongoose";

export enum INFORMATION_TYPE {
    ABOUT_US = 'ABOUT_US',
    PRIVACY_POLICY = 'PRIVACY_POLICY',
    TERMS_OF_SERVICE = 'TERMS_OF_SERVICE',
}

interface Information {
    type: INFORMATION_TYPE;
    title: string;
    content: string;
}

export const InformationModal = model<Information>('Information', new Schema<Information>({
    type: {
        type: String,
        enum: Object.values(INFORMATION_TYPE),
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}));
