export type CreateVoucherDto = {
    name: string;
    description: string;
    quantity: number;
    startDate: Date,
    endDate: Date;
    lowerBoundDeal: number,
    type: string,
    value: number,
    maxValue?: number;
    applyFor: string;
    appliedIds?: number[];
}

export type UpdateVoucherDto = {
    name?: string;
    description?: string;
    quantity?: number;
    startDate?: Date,
    endDate?: Date;
    lowerBoundDeal?: number,
    type?: string,
    value?: number,
    maxValue?: number;
    applyFor?: string;
    appliedIds?: number[];
}
