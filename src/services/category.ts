import { Category, Product } from "../models";
import { getAll, create, updateEntryById, deleteEntryById } from "../repositories/crud";

async function getAllCats() {
    const cats: Category[] = await getAll(Category, {
        attributes: ['id', 'name']
    });
    return cats;
}

async function getCat(id: number) {
    const cat: Category | null = await Category.findByPk(id, {
        attributes: ['id', 'name'],
        include: {
            model: Product,
            attributes: ['id', 'name', 'description']
        }
    });

    if(!cat) throw new Error(`Id not found`);
    return cat;
}

async function createCat(name: string) {
    const newCat: Category = await create(Category, {
        name
    });
    return newCat;
}

async function updateCat(id: number, name: string) {
    const updatedCat: Category = await updateEntryById(Category, id, {
        name
    });
    return updatedCat;
}

async function removeCat(id: number) {
    const deletedCat: Category = await deleteEntryById(Category, id);
    return deletedCat;
}

export {getAllCats, getCat, createCat, updateCat, removeCat};