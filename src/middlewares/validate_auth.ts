import validate_input from "./validate";
import { loginSchema } from "./validate_schemas/auth";

const validate_login = validate_input(loginSchema);

export {
    validate_login,
}