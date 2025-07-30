import { model, Schema, Types } from "mongoose";
import { VALIDATION_STATUS } from "../../../enums/user";


interface IValidation {
    user: Types.ObjectId;
    image: string[];
    doc: string;
    status: VALIDATION_STATUS;
}

const validationSchema = new Schema<IValidation>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    image: {
        type: [String],
        default: []
    },
    doc: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(VALIDATION_STATUS),
        default: VALIDATION_STATUS.PENDING,
    },
})

const Validation = model<IValidation>('Validation', validationSchema);

export default Validation;
