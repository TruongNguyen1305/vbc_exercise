import Joi from "joi";

const createVoucherSchema: Joi.ObjectSchema<any> = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    quantity: Joi.number().required().min(1),
    startDate: Joi.date().required().min('now'),
    endDate: Joi.date().required().min(Joi.ref('startDate')),
    lowerBoundDeal: Joi.number().default(0),
    type: Joi.string().required().valid('percentage', 'value'),
    value: Joi.number().required().min(1),
    maxValue: Joi.number().min(1),
    applyFor: Joi.string().valid('all', 'users', 'groups', 'products', 'categories').default('all'),
    appliedIds: Joi.array().items(Joi.number())
});

const updateVoucherSchema: Joi.ObjectSchema<any> = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    quantity: Joi.number().min(1),
    startDate: Joi.date().min('now'),
    endDate: Joi.date().min('now'),
    lowerBoundDeal: Joi.number(),
    type: Joi.string().valid('percentage', 'value'),
    value: Joi.number().min(1),
    maxValue: Joi.number().min(1),
    applyFor: Joi.string().valid('all', 'users', 'groups', 'products', 'categories'),
    appliedIds: Joi.array().items(Joi.number())
});
export {createVoucherSchema, updateVoucherSchema}