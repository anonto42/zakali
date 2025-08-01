import { z } from "zod";
import { SUBSCRIPTION_TYPE } from "./subscription.interface";

export const createSubscriptionPlanZodSchema = z.object({
    body: z.object({
        price: z.number({ required_error: "Price is required" }),
        subscriptionType: z.enum(Object.values(SUBSCRIPTION_TYPE) as [string, ...string[]]),
        features: z.array(z.string({ required_error: "Features is required" })),
    })
});

export const updateSubscriptionPlanZodSchema = z.object({
    body: z.object({
        id: z.string({ required_error: "Id is required" }),
        price: z.number().optional(),
        subscriptionType: z.enum(Object.values(SUBSCRIPTION_TYPE) as [string, ...string[]]).optional(),
        features: z.array(z.string()).optional(),
    })
});

export const deleteSubscriptionPlanZodSchema = z.object({
    body: z.object({
        id: z.string({ required_error: "Id is required" }),
    })
});
