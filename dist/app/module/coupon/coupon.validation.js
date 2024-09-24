"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponValidations = void 0;
const zod_1 = require("zod");
const createCouponValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    code: zod_1.z.string(),
    discountType: zod_1.z.enum(["percentage", "fixed"]),
    discountValue: zod_1.z.number(),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    usageLimit: zod_1.z.number().default(1),
    usedCount: zod_1.z.number().default(0).optional(),
    isActive: zod_1.z.boolean().default(true).optional(),
});
const UpdateCoupunValidationSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    code: zod_1.z.string().optional(),
    discountType: zod_1.z.enum(["percentage", "fixed"]).optional(),
    discountValue: zod_1.z.number().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    usageLimit: zod_1.z.number().default(1).optional(),
    usedCount: zod_1.z.number().default(0).optional(),
    isActive: zod_1.z.boolean().default(true).optional(),
});
exports.couponValidations = {
    createCouponValidationSchema,
    UpdateCoupunValidationSchema,
};
