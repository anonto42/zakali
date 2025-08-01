import { z } from "zod";


export const createBoostPlanZodSchema = z.object({
    body: z.object({
        price: z.number({ required_error: "Price is required" }),
        discription: z.string({ required_error: "Discription is required" }),
        duration: z.number().optional(),
    })
});

export const updateBoostPlanZodSchema = z.object({
    body: z.object({
        id: z.string({ required_error: "Id is required" }),
        price: z.number().optional(),
        discription: z.string().optional(),
        duration: z.number().optional(),
    })
});
