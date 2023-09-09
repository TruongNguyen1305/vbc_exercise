import validate_input from "./validate";
import { createProductSchema, updateProductSchema, searchProductSchema } from "./validate_schemas/product";

const validate_search_product= validate_input(searchProductSchema);
const validate_create_product= validate_input(createProductSchema);
const validate_update_product = validate_input(updateProductSchema);

export {
    validate_search_product,
    validate_create_product,
    validate_update_product,
}