import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TCoupon } from "./coupon.interface";
import Coupon from "./coupon.model";
import Booking from "../booking/booking.model";

const createCouponIntoDB = async (payLoad: TCoupon) => {
    const coupon = await Coupon.create(payLoad);
    return coupon;
};

const getAllCouponsFromDB = async () => {
    const coupons = await Coupon.find({});
    return coupons;
};

const getCouponByIdFromDB = async (id: string) => {
    const coupon = await Coupon.findById(id);
    return coupon;
};

const updateCouponIntoDB = async (id: string, payLoad: Partial<TCoupon>) => {
    const coupon = await Coupon.findByIdAndUpdate(id, payLoad, { new: true });

    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
    }
    return coupon;
};

const deleteCouponFromDB = async (id: string) => {
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
    }
    return coupon;
};

const appyCouponToDB = async (payload: { couponCode: string; id: string }) => {
    const coupon = await Coupon.findOne({ code: payload.couponCode });
    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
    }
    const couponValidTime = new Date(coupon.endDate.split("T")[0]).getTime() - new Date().getTime();
    if (couponValidTime < 1 && coupon.usageLimit < coupon.usedCount) {
        throw new AppError(httpStatus.BAD_REQUEST, "Coupon expired");
    }

    const booking = await Booking.findById(payload.id);
    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
        discount = booking.totalCost * (coupon.discountValue / 100);
    } else if (coupon.discountType === "fixed") {
        discount = booking.totalCost - coupon.discountValue;
    }

    const newTotalCost = Math.round(booking.totalCost - discount);
    const newUsedCount = coupon.usedCount + 1;
    const bookingUpdated = await Booking.findByIdAndUpdate(payload.id, { totalCost: newTotalCost, couponUsed: true });
    const couponUpdated = await Coupon.findOneAndUpdate({ code: payload.couponCode }, { usedCount: newUsedCount });
    if (!bookingUpdated && !couponUpdated) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to apply coupon");
    }
};

export const CouponServices = {
    createCouponIntoDB,
    getAllCouponsFromDB,
    getCouponByIdFromDB,
    updateCouponIntoDB,
    deleteCouponFromDB,
    appyCouponToDB,
};
