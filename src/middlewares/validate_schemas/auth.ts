import Joi from "joi";

const loginSchema: Joi.ObjectSchema<any> = Joi.object({
    username: Joi.string().required().min(3).pattern(new RegExp('^[0-9|a-z|A-Z]+$')),
    password: Joi.string().required().min(6).pattern(new RegExp('^[0-9|a-z|A-Z]+$')),
});

export {loginSchema}