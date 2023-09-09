import Joi from "joi";

const searchProductSchema: Joi.ObjectSchema<any> = Joi.object({
    upperBoundPrice: Joi.number().default(Infinity),
    lowerBoundPrice: Joi.number().default(0),
    catIds: Joi.array().items(Joi.number()),
    page: Joi.number().min(1)
});

const createProductSchema: Joi.ObjectSchema<any> = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    catIds: Joi.array().items(Joi.number())
});

const updateProductSchema: Joi.ObjectSchema<any> = Joi.object({
    name: Joi.string(),
    price: Joi.number().min(0),
    description: Joi.string(),
    catIds: Joi.array().items(Joi.number())
});


export {searchProductSchema, createProductSchema, updateProductSchema}