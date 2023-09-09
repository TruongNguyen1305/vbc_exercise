import Joi from "joi";

const createGroupSchema: Joi.ObjectSchema<any> = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
});

const updateGroupSchema: Joi.ObjectSchema<any> = createGroupSchema.keys({
    name: Joi.string(),
});

const addUserToGroupSchema: Joi.ObjectSchema<any> = Joi.object({
    userIds: Joi.array().items(Joi.number()).min(1).required()
});

export {createGroupSchema, updateGroupSchema, addUserToGroupSchema}