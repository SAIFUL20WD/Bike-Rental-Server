import express from "express";
import auth from "../../middleware/auth";
import { BookingControllers } from "./booking.controller";

const router = express.Router();

router.post("/create-booking", auth(false), BookingControllers.createBooking);

router.post("/update-booking/:bookingId", auth(false), BookingControllers.updateBooking);

router.post("/", auth(false), BookingControllers.createBikeRental);

router.put("/:id/return", auth(true), BookingControllers.returnBike);

router.get("/", auth(false), BookingControllers.getAllRentals);

router.get("/get-all-user-rentals", auth(true), BookingControllers.getAllUserRentals);

export const BookingRoutes = router;
