import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BikeServices } from "./bike.service";

const createBike = catchAsync(async (req, res) => {
    const result = await BikeServices.createBikeIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bike added successfully",
        data: result,
    });
});

const getAllBikes = catchAsync(async (req, res) => {
    const name = req?.query?.name as string;
    const brands = req?.query?.brands as string;
    const models = req?.query?.models as string;
    const availabilty = req?.query?.availabilty as string;
    if (name || brands || models || availabilty) {
        const result = await BikeServices.getBikesByQueryFromDB(name, brands, models, availabilty);
        if (result.length === 0) {
            sendResponse(res, {
                statusCode: httpStatus.NOT_FOUND,
                success: false,
                message: "No product found!",
                data: result,
            });
        } else {
            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: `Bikes matching filter term fetched successfully!`,
                data: result,
            });
        }
    } else {
        const result = await BikeServices.getAllBikesFromDB();
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Bikes retrieved successfully",
            data: result,
        });
    }
});

const getBikesByTag = catchAsync(async (req, res) => {
    const tag = req?.query?.tag;
    const result = await BikeServices.getBikesByTagFromDB(tag as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `${tag} bikes retrieved successfully`,
        data: result,
    });
});

const getAllBrands = catchAsync(async (req, res) => {
    const result = await BikeServices.getAllBrandsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brands retrieved successfully",
        data: result,
    });
});

const getAllModels = catchAsync(async (req, res) => {
    const result = await BikeServices.getAllModelsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Models retrieved successfully",
        data: result,
    });
});

const getBikeById = catchAsync(async (req, res) => {
    const result = await BikeServices.getBikeByIdFromDB(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single Bike retrieved successfully",
        data: result,
    });
});

const updateBike = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BikeServices.updateBikeIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bike updated successfully",
        data: result,
    });
});

const deleteBike = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BikeServices.deleteBikeFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bike deleted successfully",
        data: result,
    });
});

export const BikeControllers = {
    createBike,
    getAllBikes,
    getBikesByTag,
    getAllBrands,
    getAllModels,
    getBikeById,
    updateBike,
    deleteBike,
};
