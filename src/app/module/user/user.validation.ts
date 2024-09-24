import { z } from "zod";

const createUserValidationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, { message: "Name must must be minimum 3 characters" })
        .max(50, { message: "Name can not be more than 20 characters" }),
    email: z.string().email(),
    password: z
        .string()
        .min(8, { message: "Password must be minimum 8 characters" })
        .max(32, { message: "Password can not be more than 20 characters" }),
    phone: z
        .string()
        .trim()
        .min(1, { message: "Phone number must be minimum 10 characters" })
        .max(15, { message: "Phone number not be more than 15 characters" }),
    address: z.string(),
    role: z.enum(["admin", "user"]).optional(),
});

const updateUserValidationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, { message: "Name must must be minimum 3 characters" })
        .max(50, { message: "Name can not be more than 20 characters" })
        .optional(),
    password: z
        .string()
        .min(8, { message: "Password must be minimum 8 characters" })
        .max(32, { message: "Password can not be more than 20 characters" })
        .optional(),
    phone: z
        .string()
        .trim()
        .min(1, { message: "Phone number must be minimum 10 characters" })
        .max(15, { message: "Phone number not be more than 15 characters" })
        .optional(),
    address: z.string().optional(),
    role: z.enum(["admin", "user"]).optional(),
});

export const userValidations = {
    createUserValidationSchema,
    updateUserValidationSchema,
};
