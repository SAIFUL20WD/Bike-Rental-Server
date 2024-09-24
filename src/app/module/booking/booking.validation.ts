import { z } from "zod";

const createRentalValidationSchema = z.object({
    bikeId: z.string(),
    startTime: z.string(),
});

export const bookingValidations = {
    createRentalValidationSchema,
};
