import { User } from "../models";
import { getAll } from "../repositories/crud";

async function getAllUser() {
    const users: User[] = await getAll(User, {
        attributes: ['id', 'username']
    });
    return users;
}

export {getAllUser}