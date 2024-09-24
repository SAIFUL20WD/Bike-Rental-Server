export type TCoupon = {
    name: string;
    code: string;
    discountType: string;
    discountValue: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
};
