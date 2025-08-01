import { Model } from "mongoose";


export interface IBoost {
    price: number;
    discription: string;
    duration: Date;
}

export interface BoostModel extends Model<IBoost> {
    
}
