"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const coupon_validation_1 = require("./coupon.validation");
const coupon_controller_1 = require("./coupon.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(true), (0, validateRequest_1.default)(coupon_validation_1.couponValidations.createCouponValidationSchema), coupon_controller_1.CouponControllers.createCoupon);
router.get("/", coupon_controller_1.CouponControllers.getAllCoupons);
router.get("/:id", coupon_controller_1.CouponControllers.getCouponById);
router.put("/:id", (0, auth_1.default)(true), (0, validateRequest_1.default)(coupon_validation_1.couponValidations.UpdateCoupunValidationSchema), coupon_controller_1.CouponControllers.updateCoupon);
router.delete("/:id", (0, auth_1.default)(true), coupon_controller_1.CouponControllers.deleteCoupon);
router.post("/apply-coupon", (0, auth_1.default)(false), coupon_controller_1.CouponControllers.applyCoupon);
exports.CouponRoutes = router;
