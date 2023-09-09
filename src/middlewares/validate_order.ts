import validate_input from "./validate";
import { createOrderSchema, updateOrderSchema} from "./validate_schemas/order";

const validate_create_order = validate_input(createOrderSchema);
const validate_update_order = validate_input(updateOrderSchema);

export {
    validate_create_order,
    validate_update_order
}