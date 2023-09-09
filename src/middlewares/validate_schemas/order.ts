import Joi from "joi";

const createOrderSchema: Joi.ObjectSchema<any> = Joi.object({
    totalCost: Joi.number().required().min(0),
    items: Joi.array().items(
        Joi.object({
            productId: Joi.number().required(),
            quantity: Joi.number().required().min(1),
            voucherIds: Joi.array().items(Joi.number()).unique() 
        })
    ).required().min(1),
    voucherIds: Joi.array().items(Joi.number()).unique()
});

const updateOrderSchema: Joi.ObjectSchema<any> = Joi.object({
    status: Joi.string().required().valid('confirmed', 'delivering', 'delivered', 'completed', 'cancelled')
});

export {createOrderSchema, updateOrderSchema}