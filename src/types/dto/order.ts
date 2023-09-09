export interface OrderItemDto  {
    productId: number;
    quantity: number;
    voucherIds?: number[]
}

export interface OrderItemWithTotalDto extends OrderItemDto {
    total: number;
    product: any,
    categories: any[]
}

export type createOrderDto = {
    items: OrderItemDto[],
    totalCost: number;
    voucherIds?: number[]
}