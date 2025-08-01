import { z } from "zod";
import { SUPPORT_STATUS } from "./support.model";

const createSupportZodSchema = z.object({
    body: z.object({
        message: z.string({ required_error: "Message is required" }),
    })
});

const giveASupportZodSchema = z.object({
    body: z.object({
        id: z.string({ required_error: "Id is required" }),
        replay: z.string({ required_error: "Replay is required" }),
        status: z.enum(Object.values(SUPPORT_STATUS) as [string, ...string[]]),
    })
});


export const SupportValidation = {
    createSupportZodSchema,
    giveASupportZodSchema
}