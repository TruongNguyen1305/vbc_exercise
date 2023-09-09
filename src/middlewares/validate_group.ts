import validate_input from "./validate";
import { createGroupSchema, updateGroupSchema, addUserToGroupSchema } from "./validate_schemas/group";

const validate_create_group = validate_input(createGroupSchema);
const validate_update_group = validate_input(updateGroupSchema);
const validate_addUserToGroup = validate_input(addUserToGroupSchema);

export {
    validate_create_group,
    validate_update_group,
    validate_addUserToGroup
}