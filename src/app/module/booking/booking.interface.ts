import { Types } from "mongoose";

export type TAdvancePayment = {
    amount: number;
    status: boolean;
    transactionId: string;
};

export type TBooking = {
    userId: Types.ObjectId;
    bikeId: Types.ObjectId;
    startTime: string;
    returnTime: string;
    advancePayment: TAdvancePayment;
    paymentStatus: "paid" | "unpaid";
    totalCost: number;
    transactionId: string;
    status: "pass" | "fail";
    isReturned: boolean;
    couponUsed: boolean;
};
