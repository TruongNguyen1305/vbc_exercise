import { Op } from "sequelize";
import { Category, Product } from "../models";
import { getAll, create, updateEntryById, deleteEntryById } from "../repositories/crud";
import { CreateProductDto, UpdateProductDto, FilterProductDto } from "../types";

const PAGE_SIZE = 10;

async function getAllProducts(dto: FilterProductDto) {
    const filterObj: any = {
        where: {
            price: dto.upperBoundPrice === Infinity ? {
                [Op.gte]: dto.lowerBoundPrice
            } : {
                [Op.gte]: dto.lowerBoundPrice,
                [Op.lte]: dto.upperBoundPrice
            },
        },
        attributes: ['id', 'name', 'description', 'price'],
        include: dto.catIds ? {
            model: Category,
            where: {
                id: {
                    [Op.in]: dto.catIds
                }
            },
            attributes: ['id', 'name'],
        } : {
            model: Category,
            attributes: ['id', 'name'],
        },
    };

    if(dto.page) {
        filterObj.offset = (dto.page - 1) * PAGE_SIZE;
        filterObj.limit = PAGE_SIZE;
    }

    const products: any = await getAll(Product, filterObj);
    return products.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        categories: product.Categories.map((category: any) => ({
            id: category.id,
            name: category.name,
        }))
    }));
}

async function getProduct(id: number) {
    const product: any = await Product.findByPk(id, {
        attributes: ['id', 'name', 'description', 'price'],
    });

    
    if(!product) throw new Error(`Id not found`);
    
    const categories = await product.getCategories({attributes: ['id', 'name'], joinTableAttributes: []});
    
    return {
        ...product.dataValues,
        categories,
    };
}

async function createProduct(dto: CreateProductDto) {
    const newProduct = await create(Product, {
        name: dto.name,
        price: dto.price,
        description: dto.description
    });

    if(dto.catIds) {
        await newProduct.addCategories(dto.catIds)
    }

    return newProduct;
}

async function updateProduct(id: number, dto: UpdateProductDto) {
    const updateObj: any = {}

    if(dto.name) updateObj.name = dto.name;
    if(dto.price) updateObj.price = dto.price;
    if(dto.description) updateObj.description = dto.description;

    const updatedProduct = await updateEntryById(Product, id, updateObj);

    if(dto.catIds) await updatedProduct.setCategories(dto.catIds);

    return updatedProduct;
}

async function removeProduct(id: number) {
    const deletedProduct: Product = await deleteEntryById(Product, id);
    return deletedProduct;
}

export {getAllProducts, getProduct, createProduct, updateProduct, removeProduct};