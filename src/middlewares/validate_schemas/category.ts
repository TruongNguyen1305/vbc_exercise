import Joi from "joi";

const createCategorySchema: Joi.ObjectSchema<any> = Joi.object({
    name: Joi.string().required(),
});

export {createCategorySchema}