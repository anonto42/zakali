import { z } from "zod"


const sendMessage = z.object({
    body: z.object({
        chatRoom: z.string({ required_error: "Chat room is required" }),
        content: z.string().optional(),
        image: z.string().optional(),
    })
})


export const communicationValidation = {
    sendMessage
}