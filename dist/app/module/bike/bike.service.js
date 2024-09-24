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
exports.BikeServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const bike_model_1 = __importDefault(require("./bike.model"));
const createBikeIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = yield bike_model_1.default.create(payLoad);
    return bike;
});
const getAllBikesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const bikes = yield bike_model_1.default.find();
    return bikes;
});
const getBikesByQueryFromDB = (name, brands, models, availabilty) => __awaiter(void 0, void 0, void 0, function* () {
    const brandList = brands.split(",");
    const modelList = models.split(",");
    const isAvailable = availabilty === "available" ? true : false;
    if (name) {
        const result = yield bike_model_1.default.find({ name: new RegExp(name, "i") });
        return result;
    }
    else if (brandList.length > 0 || modelList.length > 0 || availabilty !== "") {
        const result = yield bike_model_1.default.find({
            $or: [{ brand: { $in: brandList } }, { model: { $in: modelList } }, { isAvailable: isAvailable }],
        });
        return result;
    }
    else {
        const result = yield bike_model_1.default.find({});
        return result;
    }
});
const getBikesByTagFromDB = (tag) => __awaiter(void 0, void 0, void 0, function* () {
    const bikes = yield bike_model_1.default.find({ tag: tag, isAvailable: true });
    return bikes;
});
const getAllBrandsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield bike_model_1.default.distinct("brand");
    return brands;
});
const getAllModelsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const models = yield bike_model_1.default.distinct("model");
    return models;
});
const getBikeByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = yield bike_model_1.default.findById(id);
    return bike;
});
const updateBikeIntoDB = (id, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = yield bike_model_1.default.findByIdAndUpdate(id, payLoad, { new: true });
    if (!bike) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Bike not found");
    }
    return bike;
});
const deleteBikeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const bike = await Bike.findByIdAndUpdate(id, { isAvailable: false }, { new: true });
    const bike = yield bike_model_1.default.findByIdAndDelete(id);
    if (!bike) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Bike not found");
    }
    return bike;
});
exports.BikeServices = {
    createBikeIntoDB,
    getAllBikesFromDB,
    getBikesByQueryFromDB,
    getBikesByTagFromDB,
    getAllBrandsFromDB,
    getAllModelsFromDB,
    getBikeByIdFromDB,
    updateBikeIntoDB,
    deleteBikeFromDB,
};
