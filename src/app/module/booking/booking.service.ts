import Booking from "./booking.model";
import { TBooking } from "./booking.interface";
import Bike from "../bike/bike.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { initiatePayment } from "../payment/payment.utils";
import User from "../user/user.model";

const createBookingWithAdvancePayment = async (userId: string, payLoad: Partial<TBooking>) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "No user found");
    }

    const bike = await Bike.findById(payLoad.bikeId);
    if (!bike) {
        throw new AppError(httpStatus.NOT_FOUND, "No bike found");
    } else if (!bike.isAvailable) {
        throw new AppError(httpStatus.NOT_FOUND, "Bike is currently unavailable");
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

    const booking = await Booking.create(bookingData);
    if (!booking) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create booking");
    }

    const paymentData = {
        transactionId: transactionId,
        totalPrice: advancePrice,
        custormerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerAddress: user.address,
    };

    const paymentSession = await initiatePayment(paymentData, "create-booking");

    // console.log(paymentSession);

    return paymentSession;
};

const updateBookingWithPayment = async (userId: string, bookingId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "No user found");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new AppError(httpStatus.BAD_REQUEST, "No booking found");
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

    const paymentSession = await initiatePayment(paymentData, "update-booking");

    const updateBooking = await Booking.findByIdAndUpdate(bookingId, { transactionId: transactionId });
    if (!updateBooking) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create booking");
    }

    return paymentSession;
};

const createBikeRentalIntoDB = async (userId: string, payLoad: Partial<TBooking>) => {
    const bike = await Bike.findById(payLoad.bikeId);
    if (!bike) {
        throw new AppError(httpStatus.NOT_FOUND, "No Bike found");
    } else if (!bike.isAvailable) {
        throw new AppError(httpStatus.NOT_FOUND, "Bike is currently unavailable");
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const updatedBike = await Bike.findByIdAndUpdate(
            bike._id,
            { isAvailable: false },
            { new: true, session: session },
        );

        if (!updatedBike) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to create rental");
        }

        const bookingData = {
            userId: userId,
            bikeId: payLoad.bikeId,
            startTime: payLoad.startTime,
        };
        const booking = await Booking.create([bookingData], { session: session });
        if (!booking) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to create rental");
        }

        await session.commitTransaction();
        await session.endSession();

        return booking;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create rental");
    }
};

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

const returnBikeIntoDB = async (id: string, payload: { id: string; endTime: string }) => {
    const booking = await Booking.findById(id);
    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, "No Booking found");
    }

    const bike = await Bike.findById(booking.bikeId);
    if (!bike) {
        throw new AppError(httpStatus.BAD_REQUEST, "Bike not found");
    }

    const costPerMinute = bike?.pricePerHour / 60;

    // Calculate Cost Per Minute From Rent Time
    const returnTime = new Date(payload.endTime);
    const startTime = new Date(booking.startTime);

    const differenceMs = returnTime.getTime() - startTime.getTime();
    const minutes = differenceMs / (1000 * 60);

    if (minutes < 1) {
        throw new AppError(httpStatus.BAD_REQUEST, "End time should be ahead of Start time");
    }

    const rentTime = Math.floor(minutes);
    const totalCost = Math.round(rentTime * costPerMinute);

    const updatedBookingData = {
        returnTime: payload.endTime,
        totalCost: totalCost,
        isReturned: true,
    };

    const updatedBooking = await Booking.findByIdAndUpdate(booking._id, updatedBookingData, {
        new: true,
    });
    if (!updatedBooking) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update rental");
    }

    const updatedBike = await Bike.findByIdAndUpdate(booking.bikeId, { isAvailable: true });
    if (!updatedBike) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update rental");
    }

    return updatedBooking;
};

const getAllRentalsFromDB = async (userId: string, status: string) => {
    const rentals = await Booking.find({ userId, paymentStatus: status, status: "pass" }).populate("bikeId");
    return rentals;
};

const getAllUserRentalsFromDB = async () => {
    const rentals = await Booking.find({}).populate("bikeId").populate("userId");
    return rentals;
};

export const BookingServices = {
    createBookingWithAdvancePayment,
    updateBookingWithPayment,
    createBikeRentalIntoDB,
    returnBikeIntoDB,
    getAllRentalsFromDB,
    getAllUserRentalsFromDB,
};
