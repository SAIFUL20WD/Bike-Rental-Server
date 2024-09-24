import { Schema, model } from "mongoose";
import { TCoupon } from "./coupon.interface";

const couponSchema = new Schema<TCoupon>(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        discountType: { type: String, enum: ["percentage", "fixed"], required: true },
        discountValue: { type: Number, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        usageLimit: { type: Number, default: 1 },
        usedCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { versionKey: false },
);

const Coupon = model("coupon", couponSchema);

export default Coupon;
