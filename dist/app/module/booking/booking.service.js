"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingServices = void 0;
const booking_model_1 = __importDefault(require("./booking.model"));
const bike_model_1 = __importDefault(require("../bike/bike.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const payment_utils_1 = require("../payment/payment.utils");
const user_model_1 = __importDefault(require("../user/user.model"));
const createBookingWithAdvancePayment = (userId, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No user found");
    }
    const bike = yield bike_model_1.default.findById(payLoad.bikeId);
    if (!bike) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No bike found");
    }
    else if (!bike.isAvailable) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Bike is currently unavailable");
    }
    const advancePrice = 100;
    const transactionId = `TXN-${Date.now()}`;
    const bookingData = {
        userId: userId,
        bikeId: payLoad.bikeId,
        startTime: payLoad.startTime,
        advancePayment: {
            transactionId: transactionId,
        },
    };
    const booking = yield booking_model_1.default.create(bookingData);
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create booking");
    }
    const paymentData = {
        transactionId: transactionId,
        totalPrice: advancePrice,
        custormerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerAddress: user.address,
    };
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData, "create-booking");
    // console.log(paymentSession);
    return paymentSession;
});
const updateBookingWithPayment = (userId, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No user found");
    }
    const booking = yield booking_model_1.default.findById(bookingId);
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No booking found");
    }
    const transactionId = `TXN-${Date.now()}`;
    const paymentData = {
        transactionId: transactionId,
        totalPrice: booking.totalCost,
        custormerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerAddress: user.address,
    };
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData, "update-booking");
    const updateBooking = yield booking_model_1.default.findByIdAndUpdate(bookingId, { transactionId: transactionId });
    if (!updateBooking) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create booking");
    }
    return paymentSession;
});
const createBikeRentalIntoDB = (userId, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = yield bike_model_1.default.findById(payLoad.bikeId);
    if (!bike) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No Bike found");
    }
    else if (!bike.isAvailable) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Bike is currently unavailable");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const updatedBike = yield bike_model_1.default.findByIdAndUpdate(bike._id, { isAvailable: false }, { new: true, session: session });
        if (!updatedBike) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create rental");
        }
        const bookingData = {
            userId: userId,
            bikeId: payLoad.bikeId,
            startTime: payLoad.startTime,
        };
        const booking = yield booking_model_1.default.create([bookingData], { session: session });
        if (!booking) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create rental");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return booking;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create rental");
    }
});
// const returnBikeIntoDB = async (id: string, endTime: string) => {
//     const booking = await Booking.findById(id);
//     if (!booking) {
//         throw new AppError(httpStatus.NOT_FOUND, "No Booking found");
//     }
//     const session = await mongoose.startSession();
//     try {
//         session.startTransaction();
//         const bike = await Bike.findById(booking.bikeId);
//         if (!bike) {
//             throw new AppError(httpStatus.BAD_REQUEST, "Bike not found");
//         }
//         const costPerMinute = bike?.pricePerHour / 60;
//         // Calculate Cost Per Minute From Rent Time
//         const returnTime = new Date(endTime);
//         const startTime = new Date(booking.startTime);
//         const differenceMs = returnTime.getTime() - startTime.getTime();
//         const minutes = differenceMs / (1000 * 60);
//         const rentTime = Math.floor(minutes);
//         const totalCost = Math.round(rentTime * costPerMinute);
//         const updatedBookingData = {
//             returnTime: endTime,
//             totalCost: totalCost,
//             isReturned: true,
//         };
//         const updatedBooking = await Booking.findByIdAndUpdate(booking._id, updatedBookingData, {
//             new: true,
//             session: session,
//         });
//         if (!updatedBooking) {
//             throw new AppError(httpStatus.BAD_REQUEST, "Failed to update rental");
//         }
//         const updatedBike = await Bike.findByIdAndUpdate(
//             booking.bikeId,
//             { isAvailable: true },
//             { new: true, session: session },
//         );
//         if (!updatedBike) {
//             throw new AppError(httpStatus.BAD_REQUEST, "Failed to update rental");
//         }
//         await session.commitTransaction();
//         await session.endSession();
//         return updatedBooking;
//     } catch (err) {
//         await session.abortTransaction();
//         await session.endSession();
//         throw new AppError(httpStatus.BAD_REQUEST, "Failed to update rental");
//     }
// };
const returnBikeIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.default.findById(id);
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No Booking found");
    }
    const bike = yield bike_model_1.default.findById(booking.bikeId);
    if (!bike) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Bike not found");
    }
    const costPerMinute = (bike === null || bike === void 0 ? void 0 : bike.pricePerHour) / 60;
    // Calculate Cost Per Minute From Rent Time
    const returnTime = new Date(payload.endTime);
    const startTime = new Date(booking.startTime);
    const differenceMs = returnTime.getTime() - startTime.getTime();
    const minutes = differenceMs / (1000 * 60);
    if (minutes < 1) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "End time should be ahead of Start time");
    }
    const rentTime = Math.floor(minutes);
    const totalCost = Math.round(rentTime * costPerMinute);
    const updatedBookingData = {
        returnTime: payload.endTime,
        totalCost: totalCost,
        isReturned: true,
    };
    const updatedBooking = yield booking_model_1.default.findByIdAndUpdate(booking._id, updatedBookingData, {
        new: true,
    });
    if (!updatedBooking) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update rental");
    }
    const updatedBike = yield bike_model_1.default.findByIdAndUpdate(booking.bikeId, { isAvailable: true });
    if (!updatedBike) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update rental");
    }
    return updatedBooking;
});
const getAllRentalsFromDB = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const rentals = yield booking_model_1.default.find({ userId, paymentStatus: status, status: "pass" }).populate("bikeId");
    return rentals;
});
const getAllUserRentalsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const rentals = yield booking_model_1.default.find({}).populate("bikeId").populate("userId");
    return rentals;
});
exports.BookingServices = {
    createBookingWithAdvancePayment,
    updateBookingWithPayment,
    createBikeRentalIntoDB,
    returnBikeIntoDB,
    getAllRentalsFromDB,
    getAllUserRentalsFromDB,
};
