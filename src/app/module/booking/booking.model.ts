import { Schema, model } from "mongoose";
import { TAdvancePayment, TBooking } from "./booking.interface";

const advancePaymentSchema = new Schema<TAdvancePayment>({
    amount: { type: Number, default: 100 },
    status: { type: Boolean, default: false },
    transactionId: { type: String, default: null },
});

const bookingSchema = new Schema<TBooking>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "user" },
        bikeId: { type: Schema.Types.ObjectId, required: true, ref: "bike" },
        startTime: { type: String, required: true },
        returnTime: { type: String, default: null },
        advancePayment: advancePaymentSchema,
        paymentStatus: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
        totalCost: { type: Number, default: 0 },
        transactionId: { type: String, default: null },
        status: { type: String, enum: ["pass", "fail"], default: "fail" },
        isReturned: { type: Boolean, default: false },
        couponUsed: { type: Boolean, default: false },
    },
    { versionKey: false },
);

const Booking = model("booking", bookingSchema);

export default Booking;
