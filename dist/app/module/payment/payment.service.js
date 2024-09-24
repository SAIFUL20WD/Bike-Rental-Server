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
exports.paymentServices = void 0;
const booking_model_1 = __importDefault(require("../booking/booking.model"));
const payment_utils_1 = require("./payment.utils");
const fs_1 = require("fs");
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const bike_model_1 = __importDefault(require("../bike/bike.model"));
dotenv_1.default.config();
const confirmationServiceForCreateBooking = (transactionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(transactionId);
    let message = "";
    const link = process.env.CLIENT_URL;
    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        const booking = yield booking_model_1.default.findOneAndUpdate({ "advancePayment.transactionId": transactionId }, {
            "advancePayment.status": true,
            status: "pass",
        });
        if (!booking) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create booking");
        }
        const updatedBike = yield bike_model_1.default.findByIdAndUpdate(booking.bikeId, { isAvailable: false });
        if (!updatedBike) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create booking");
        }
        message = "Your Payment is Successful!";
    }
    else {
        message = "Payment Failed!";
    }
    const filePath = (0, path_1.join)(__dirname, "../../../../public/confirmation.html");
    let template = (0, fs_1.readFileSync)(filePath, "utf-8");
    template = template.replace("{{message}}", message);
    template = template.replace("{{link}}", `${link}`);
    return template;
});
const confirmationServiceForUpdateBooking = (transactionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(transactionId);
    let message = "";
    const link = process.env.CLIENT_URL;
    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        const booking = yield booking_model_1.default.findOneAndUpdate({ transactionId: transactionId }, { paymentStatus: "paid" });
        if (!booking) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update booking");
        }
        message = "Your Payment is Successful!";
    }
    else {
        message = "Payment Failed!";
    }
    const filePath = (0, path_1.join)(__dirname, "../../../../public/confirmation.html");
    let template = (0, fs_1.readFileSync)(filePath, "utf-8");
    template = template.replace("{{message}}", message);
    template = template.replace("{{link}}", `${link}`);
    return template;
});
exports.paymentServices = {
    confirmationServiceForCreateBooking,
    confirmationServiceForUpdateBooking,
};
