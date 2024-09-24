import { Request, Response } from "express";
import { paymentServices } from "./payment.service";

const confirmationControllerForCreateBooking = async (req: Request, res: Response) => {
    const { transactionId, status } = req.query;

    const result = await paymentServices.confirmationServiceForCreateBooking(transactionId as string, status as string);
    res.send(result);
};

const confirmationControllerForUpdateBooking = async (req: Request, res: Response) => {
    const { transactionId, status } = req.query;

    const result = await paymentServices.confirmationServiceForUpdateBooking(transactionId as string, status as string);
    res.send(result);
};

export const paymentControler = {
    confirmationControllerForCreateBooking,
    confirmationControllerForUpdateBooking,
};
