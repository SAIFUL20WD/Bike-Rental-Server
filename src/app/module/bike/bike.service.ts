import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TBike } from "./bike.interface";
import Bike from "./bike.model";

const createBikeIntoDB = async (payLoad: TBike) => {
    const bike = await Bike.create(payLoad);
    return bike;
};

const getAllBikesFromDB = async () => {
    const bikes = await Bike.find();
    return bikes;
};

const getBikesByQueryFromDB = async (name: string, brands: string, models: string, availabilty: string) => {
    const brandList = brands.split(",");
    const modelList = models.split(",");
    const isAvailable = availabilty === "available" ? true : false;

    if (name) {
        const result = await Bike.find({ name: new RegExp(name, "i") });
        return result;
    } else if (brandList.length > 0 || modelList.length > 0 || availabilty !== "") {
        const result = await Bike.find({
            $or: [{ brand: { $in: brandList } }, { model: { $in: modelList } }, { isAvailable: isAvailable }],
        });
        return result;
    } else {
        const result = await Bike.find({});
        return result;
    }
};

const getBikesByTagFromDB = async (tag: string) => {
    const bikes = await Bike.find({ tag: tag, isAvailable: true });
    return bikes;
};

const getAllBrandsFromDB = async () => {
    const brands = await Bike.distinct("brand");
    return brands;
};

const getAllModelsFromDB = async () => {
    const models = await Bike.distinct("model");
    return models;
};

const getBikeByIdFromDB = async (id: string) => {
    const bike = await Bike.findById(id);
    return bike;
};

const updateBikeIntoDB = async (id: string, payLoad: Partial<TBike>) => {
    const bike = await Bike.findByIdAndUpdate(id, payLoad, { new: true });

    if (!bike) {
        throw new AppError(httpStatus.NOT_FOUND, "Bike not found");
    }
    return bike;
};

const deleteBikeFromDB = async (id: string) => {
    // const bike = await Bike.findByIdAndUpdate(id, { isAvailable: false }, { new: true });
    const bike = await Bike.findByIdAndDelete(id);

    if (!bike) {
        throw new AppError(httpStatus.NOT_FOUND, "Bike not found");
    }
    return bike;
};

export const BikeServices = {
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
