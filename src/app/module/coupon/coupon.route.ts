import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { couponValidations } from "./coupon.validation";
import { CouponControllers } from "./coupon.controller";

const router = express.Router();

router.post(
    "/",
    auth(true),
    validateRequest(couponValidations.createCouponValidationSchema),
    CouponControllers.createCoupon,
);

router.get("/", CouponControllers.getAllCoupons);

router.get("/:id", CouponControllers.getCouponById);

router.put(
    "/:id",
    auth(true),
    validateRequest(couponValidations.UpdateCoupunValidationSchema),
    CouponControllers.updateCoupon,
);

router.delete("/:id", auth(true), CouponControllers.deleteCoupon);

router.post("/apply-coupon", auth(false), CouponControllers.applyCoupon);

export const CouponRoutes = router;
