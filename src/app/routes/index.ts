import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { BikeRoutes } from "../module/bike/bike.route";
import { BookingRoutes } from "../module/booking/booking.route";
import { paymentRoutes } from "../module/payment/payment.route";
import { CouponRoutes } from "../module/coupon/coupon.route";

const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/users",
        route: UserRoutes,
    },
    {
        path: "/bikes",
        route: BikeRoutes,
    },
    {
        path: "/rentals",
        route: BookingRoutes,
    },
    {
        path: "/coupons",
        route: CouponRoutes,
    },
    {
        path: "/payments",
        route: paymentRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
