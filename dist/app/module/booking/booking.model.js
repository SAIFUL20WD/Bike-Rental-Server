"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const advancePaymentSchema = new mongoose_1.Schema({
    amount: { type: Number, default: 100 },
    status: { type: Boolean, default: false },
    transactionId: { type: String, default: null },
});
const bookingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "user" },
    bikeId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "bike" },
    startTime: { type: String, required: true },
    returnTime: { type: String, default: null },
    advancePayment: advancePaymentSchema,
    paymentStatus: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    totalCost: { type: Number, default: 0 },
    transactionId: { type: String, default: null },
    status: { type: String, enum: ["pass", "fail"], default: "fail" },
    isReturned: { type: Boolean, default: false },
    couponUsed: { type: Boolean, default: false },
}, { versionKey: false });
const Booking = (0, mongoose_1.model)("booking", bookingSchema);
exports.default = Booking;
