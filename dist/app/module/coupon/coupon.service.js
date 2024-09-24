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
exports.CouponServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const coupon_model_1 = __importDefault(require("./coupon.model"));
const booking_model_1 = __importDefault(require("../booking/booking.model"));
const createCouponIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.default.create(payLoad);
    return coupon;
});
const getAllCouponsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const coupons = yield coupon_model_1.default.find({});
    return coupons;
});
const getCouponByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.default.findById(id);
    return coupon;
});
const updateCouponIntoDB = (id, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.default.findByIdAndUpdate(id, payLoad, { new: true });
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    return coupon;
});
const deleteCouponFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.default.findByIdAndDelete(id);
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    return coupon;
});
const appyCouponToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.default.findOne({ code: payload.couponCode });
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    const couponValidTime = new Date(coupon.endDate.split("T")[0]).getTime() - new Date().getTime();
    if (couponValidTime < 1 && coupon.usageLimit < coupon.usedCount) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Coupon expired");
    }
    const booking = yield booking_model_1.default.findById(payload.id);
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
    }
    let discount = 0;
    if (coupon.discountType === "percentage") {
        discount = booking.totalCost * (coupon.discountValue / 100);
    }
    else if (coupon.discountType === "fixed") {
        discount = booking.totalCost - coupon.discountValue;
    }
    const newTotalCost = Math.round(booking.totalCost - discount);
    const newUsedCount = coupon.usedCount + 1;
    const bookingUpdated = yield booking_model_1.default.findByIdAndUpdate(payload.id, { totalCost: newTotalCost, couponUsed: true });
    const couponUpdated = yield booking_model_1.default.findOneAndUpdate({ code: payload.couponCode }, { usedCount: newUsedCount });
    if (!bookingUpdated && !couponUpdated) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to apply coupon");
    }
});
exports.CouponServices = {
    createCouponIntoDB,
    getAllCouponsFromDB,
    getCouponByIdFromDB,
    updateCouponIntoDB,
    deleteCouponFromDB,
    appyCouponToDB,
};
