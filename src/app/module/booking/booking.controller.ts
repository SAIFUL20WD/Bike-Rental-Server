import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";

const createBooking = catchAsync(async (req, res) => {
    const { _id: userId } = req.user;
    const result = await BookingServices.createBookingWithAdvancePayment(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rental created successfully",
        data: result,
    });
});

const updateBooking = catchAsync(async (req, res) => {
    const { _id: userId } = req.user;
    const bookingId = req.params?.bookingId;
    const result = await BookingServices.updateBookingWithPayment(userId, bookingId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rental updated successfully",
        data: result,
    });
});

const createBikeRental = catchAsync(async (req, res) => {
    const { _id: userId } = req.user;
    const result = await BookingServices.createBikeRentalIntoDB(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rental created successfully",
        data: result,
    });
});

const returnBike = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BookingServices.returnBikeIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bike returned successfully",
        data: result,
    });
});

const getAllRentals = catchAsync(async (req, res) => {
    const { _id: userId } = req.user;
    const status = req.query?.status;
    const result = await BookingServices.getAllRentalsFromDB(userId, status as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rentals retrieved successfully",
        data: result,
    });
});

const getAllUserRentals = catchAsync(async (req, res) => {
    const result = await BookingServices.getAllUserRentalsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All User Rentals retrieved successfully",
        data: result,
    });
});

export const BookingControllers = {
    createBooking,
    updateBooking,
    createBikeRental,
    returnBike,
    getAllRentals,
    getAllUserRentals,
};
