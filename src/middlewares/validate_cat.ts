import validate_input from "./validate";
import { createCategorySchema } from "./validate_schemas/category";

const validate_create_cat = validate_input(createCategorySchema);

export {
    validate_create_cat,
}