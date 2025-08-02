import { Model } from "mongoose";


export interface IBoost {
    price: number;
    discription: string;
    duration: number;
}

export interface BoostModel extends Model<IBoost> {
    
}
