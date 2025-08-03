import { Model, model, Schema } from "mongoose";

export type IChat = {
  name: string;
  participants: Schema.Types.ObjectId[];
};

export type ChatModel = {
  isArray(token: string): any;
} & Model<IChat>;

const chatRoom = new Schema<IChat, ChatModel>({
    name: {
        type: String
    },
    participants:{
        type: [Schema.Types.ObjectId],
        ref: "User"
    }
},{
    timestamps: true
});

export const ChatRoom = model<IChat, ChatModel>("chat", chatRoom);