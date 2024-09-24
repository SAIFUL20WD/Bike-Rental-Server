import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { CouponServices } from "./coupon.service";

const createCoupon = catchAsync(async (req, res) => {
    const result = await CouponServices.createCouponIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupon added successfully",
        data: result,
    });
});

const getAllCoupons = catchAsync(async (req, res) => {
    const result = await CouponServices.getAllCouponsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupons retrieved successfully",
        data: result,
    });
});

const getCouponById = catchAsync(async (req, res) => {
    const result = await CouponServices.getCouponByIdFromDB(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single Coupon retrieved successfully",
        data: result,
    });
});

const updateCoupon = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CouponServices.updateCouponIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupon updated successfully",
        data: result,
    });
});

const deleteCoupon = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CouponServices.deleteCouponFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupon deleted successfully",
        data: result,
    });
});

const applyCoupon = catchAsync(async (req, res) => {
    const result = await CouponServices.appyCouponToDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupon applied successfully",
        data: result,
    });
});

export const CouponControllers = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    applyCoupon,
};
