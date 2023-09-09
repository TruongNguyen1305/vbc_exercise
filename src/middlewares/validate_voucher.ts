import validate_input from "./validate";
import { createVoucherSchema, updateVoucherSchema } from "./validate_schemas/voucher";

const validate_create_voucher= validate_input(createVoucherSchema);
const validate_update_voucher= validate_input(updateVoucherSchema);

export {
    validate_create_voucher,
    validate_update_voucher
}