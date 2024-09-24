"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../module/auth/auth.route");
const user_route_1 = require("../module/user/user.route");
const bike_route_1 = require("../module/bike/bike.route");
const booking_route_1 = require("../module/booking/booking.route");
const payment_route_1 = require("../module/payment/payment.route");
const coupon_route_1 = require("../module/coupon/coupon.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/bikes",
        route: bike_route_1.BikeRoutes,
    },
    {
        path: "/rentals",
        route: booking_route_1.BookingRoutes,
    },
    {
        path: "/coupons",
        route: coupon_route_1.CouponRoutes,
    },
    {
        path: "/payments",
        route: payment_route_1.paymentRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
