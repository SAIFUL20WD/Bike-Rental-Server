import Booking from "../booking/booking.model";
import { verifyPayment } from "./payment.utils";
import { readFileSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import Bike from "../bike/bike.model";

dotenv.config();

const confirmationServiceForCreateBooking = async (transactionId: string, status: string) => {
    const verifyResponse = await verifyPayment(transactionId);

    let message = "";
    const link = process.env.CLIENT_URL;

    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        const booking = await Booking.findOneAndUpdate(
            { "advancePayment.transactionId": transactionId },
            {
                "advancePayment.status": true,
                status: "pass",
            },
        );
        if (!booking) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create booking");
        }

        const updatedBike = await Bike.findByIdAndUpdate(booking.bikeId, { isAvailable: false });

        if (!updatedBike) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create booking");
        }
        message = "Your Payment is Successful!";
    } else {
        message = "Payment Failed!";
    }

    const filePath = join(__dirname, "../../../../public/confirmation.html");
    let template = readFileSync(filePath, "utf-8");

    template = template.replace("{{message}}", message);
    template = template.replace("{{link}}", `${link}`);

    return template;
};

const confirmationServiceForUpdateBooking = async (transactionId: string, status: string) => {
    const verifyResponse = await verifyPayment(transactionId);

    let message = "";
    const link = process.env.CLIENT_URL;

    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        const booking = await Booking.findOneAndUpdate({ transactionId: transactionId }, { paymentStatus: "paid" });
        if (!booking) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update booking");
        }

        message = "Your Payment is Successful!";
    } else {
        message = "Payment Failed!";
    }

    const filePath = join(__dirname, "../../../../public/confirmation.html");
    let template = readFileSync(filePath, "utf-8");

    template = template.replace("{{message}}", message);
    template = template.replace("{{link}}", `${link}`);

    return template;
};

export const paymentServices = {
    confirmationServiceForCreateBooking,
    confirmationServiceForUpdateBooking,
};
