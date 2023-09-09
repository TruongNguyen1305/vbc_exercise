import { Group, User } from "../models";
import { getAll, getById, create, updateEntryById, deleteEntryById } from "../repositories/crud";
import { CreateGroupDto } from "../types";

async function getAllGroups() {
    const groups: Group[] = await getAll(Group, {
        attributes: ['id', 'name', 'description']
    });
    return groups;
}

async function getGroup(id: number) {
    const group: any = await Group.findByPk(id, {
        attributes: ['id', 'name', 'description'],
    });

    if(!group) throw new Error(`Id not found`);

    const users = await group.getUsers({attributes: ['id', 'username', 'isAdmin'], joinTableAttributes: []});
    
    return {
        users,
        ...group.dataValues
    };
}

async function createGroup(dto: CreateGroupDto) {
    const group: Group = await create(Group, {
        name: dto.name,
        description: dto.description
    });
    return group;
}

async function updateGroup(groupId: number, dto: CreateGroupDto) {
    const group: Group = await updateEntryById(Group, groupId, dto);
    return group;
}

async function removeGroup(groupId: number) {
    const group: Group = await deleteEntryById(Group, groupId);
    return group;
}

async function addUserToGroup(groupId: number, userIds: number[]) {
    const group = await getById(Group, groupId, ['id', 'name', 'description']);
    await group.addUsers(userIds);
    return await Group.findByPk(groupId, {
        include: [{
            model: User,
            attributes: ['id', 'username', 'isAdmin']
        }],
        attributes: ['id', 'name', 'description']
    });
}

async function removeUserFromGroup(groupId: number, userIds: number[]) {
    const group = await getById(Group, groupId, ['id', 'name', 'description']);
    await group.removeUsers(userIds);
    return await Group.findByPk(groupId, {
        include: [{
            model: User,
            attributes: ['id', 'username', 'isAdmin']
        }],
        attributes: ['id', 'name', 'description']
    });
}

export {getAllGroups, getGroup, createGroup, updateGroup, removeGroup, addUserToGroup, removeUserFromGroup}