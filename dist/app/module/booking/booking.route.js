"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.post("/create-booking", (0, auth_1.default)(false), booking_controller_1.BookingControllers.createBooking);
router.post("/update-booking/:bookingId", (0, auth_1.default)(false), booking_controller_1.BookingControllers.updateBooking);
router.post("/", (0, auth_1.default)(false), booking_controller_1.BookingControllers.createBikeRental);
router.put("/:id/return", (0, auth_1.default)(true), booking_controller_1.BookingControllers.returnBike);
router.get("/", (0, auth_1.default)(false), booking_controller_1.BookingControllers.getAllRentals);
router.get("/get-all-user-rentals", (0, auth_1.default)(true), booking_controller_1.BookingControllers.getAllUserRentals);
exports.BookingRoutes = router;
