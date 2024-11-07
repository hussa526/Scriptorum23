import prisma from "./prismaclient"

export async function validateTags(tagsId) {
    if (tagsId.length === 0) {
        return [];
    }

    let existingTags = await prisma.tags.findMany({
        where: {
            id: {
                in: tagsId
            }
        },
        select: {
            id: true
        }
    });

    existingTags = existingTags.map(tag => tag.id);

    const invalidTagIds = tagsId.filter(tagId => !existingTags.includes(tagId));
    return invalidTagIds;
}

export async function validateTemplates(templateIds) {
    if (templateIds.length === 0) {
        return [];
    }

    let existingTemplates = await prisma.template.findMany({
        where: {
            id: { in: templateIds }
        },
        select: { id: true }
    });

    existingTemplates = existingTemplates.map(tag => tag.id);

    const invalidTemplateIds = templateIds.filter(tagId => !existingTemplates.includes(tagId));
    return invalidTemplateIds;
}
