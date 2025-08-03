import { Model, model, Schema, Types } from "mongoose";

export type IMessage = {
  sender: Schema.Types.ObjectId,
  content: string,
  chatRoom: string
};

export type MessageModel = {
  isArray(token: string): any;
} & Model<IMessage>;

const messageSchema = new Schema<IMessage>({
    chatRoom: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sender: {
        type: Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
})

export const Message = model<IMessage, MessageModel>("message", messageSchema);