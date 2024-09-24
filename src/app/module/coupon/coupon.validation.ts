import { z } from "zod";

const createCouponValidationSchema = z.object({
    name: z.string(),
    code: z.string(),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.number(),
    startDate: z.string(),
    endDate: z.string(),
    usageLimit: z.number().default(1),
    usedCount: z.number().default(0).optional(),
    isActive: z.boolean().default(true).optional(),
});

const UpdateCoupunValidationSchema = z.object({
    name: z.string().optional(),
    code: z.string().optional(),
    discountType: z.enum(["percentage", "fixed"]).optional(),
    discountValue: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    usageLimit: z.number().default(1).optional(),
    usedCount: z.number().default(0).optional(),
    isActive: z.boolean().default(true).optional(),
});

export const couponValidations = {
    createCouponValidationSchema,
    UpdateCoupunValidationSchema,
};
