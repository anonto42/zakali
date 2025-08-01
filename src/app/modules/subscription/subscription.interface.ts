import { Model, Types } from "mongoose";

export enum SUBSCRIPTION_TYPE {
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY',
}

export interface ISubscription {
    price: number;
    subscriptionType: SUBSCRIPTION_TYPE;
    features: string[]; 
}

export interface SubscriptionModel extends Model<ISubscription> {
    
}
