import express from "express";
import { paymentControler } from "./payment.controller";

const router = express.Router();

router.post("/create-booking/confirmation", paymentControler.confirmationControllerForCreateBooking);

router.post("/update-booking/confirmation", paymentControler.confirmationControllerForUpdateBooking);

export const paymentRoutes = router;
