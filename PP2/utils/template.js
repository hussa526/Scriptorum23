import prisma from "./prismaclient"

import { verifyToken } from "./auth"

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

export async function authUser(authHeader) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { success: false, status: 401, error: "Unauthorized" };
    }
    
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
        return { success: false, status: 401, error: "Unauthorized Token" };
    }

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.userId,
        }
    });

    if (!user) {
        return { success: false, status: 400, error: "User does not exist." };
    }

    return { success: true, user: user };
}