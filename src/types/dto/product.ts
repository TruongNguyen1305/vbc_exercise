export type FilterProductDto = {
    upperBoundPrice?: number,
    lowerBoundPrice?: number,
    catIds?: number[],
    page?: number
}

export type CreateProductDto = {
    name: string,
    price: number,
    description: string,
    catIds?: number[]
}

export type UpdateProductDto = {
    name?: string,
    price?: number,
    description?: string,
    catIds?: number[]
}