"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bikeValidations = void 0;
const zod_1 = require("zod");
const createBikeValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    image: zod_1.z.string(),
    pricePerHour: zod_1.z.number(),
    isAvailable: zod_1.z.boolean().optional(),
    cc: zod_1.z.number(),
    year: zod_1.z.number(),
    model: zod_1.z.string(),
    brand: zod_1.z.string(),
    tag: zod_1.z.string().default("new").optional(),
});
const updateBikeValidationSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    pricePerHour: zod_1.z.number().optional(),
    isAvailable: zod_1.z.boolean().optional(),
    cc: zod_1.z.number().optional(),
    year: zod_1.z.number().optional(),
    model: zod_1.z.string().optional(),
    brand: zod_1.z.string().optional(),
    tag: zod_1.z.string().optional(),
});
exports.bikeValidations = {
    createBikeValidationSchema,
    updateBikeValidationSchema,
};
