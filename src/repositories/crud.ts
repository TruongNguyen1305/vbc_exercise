async function create(model: any, instance: object) {
    const newInstance = await model.create(instance);
    return newInstance;
}

async function getOne(model: any, filterObj: object, attributes: string[] = ['id']) {
    const entry_found = await model.findOne({
        where: filterObj,
        attributes,
    });
    return entry_found;
}

async function getById(model: any, id: number, attributes: string[] = ['id']) {
    const entry_found = await model.findByPk(id, {attributes});
    if(!entry_found) throw new Error('Id not found');
    return entry_found;
}

async function getAll(model: any, options: object) {
    const allEntryFound = await model.findAll(options);
    return allEntryFound;
}

async function updateEntryById(model: any, id: number, updateObj: object, attributes: string[] = ['id']) {
    const entry_found = await model.findByPk(id);
    if(!entry_found) throw new Error('Id not found');
    await entry_found.update(updateObj);
    return entry_found;
}

async function deleteEntryById(model: any, id: number) {
    const entry_found = await model.findByPk(id);
    if(!entry_found) throw new Error('Id not found');
    await entry_found.destroy();
    return entry_found;
}

export {
    create, getOne, getById, getAll, updateEntryById, deleteEntryById
}