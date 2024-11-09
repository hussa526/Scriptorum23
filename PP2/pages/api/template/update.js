import prisma from "@/utils/prismaclient"

import { validateTags } from "@/utils/template"
import { authUser } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    // user must be authenticated before modifying any templates

    const authHeader = req.headers.authorization;
    
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;

    // update user template
    const { tempId, title, explanation, code, extension, tagsAdded = [], tagsRemoved = [] } = req.body;

    // first check if user can modify template, no validation should be done yet
    // even if they input an empty title, it doesn't matter since they will be unauthorized

    try {
        // find the template we are to modify
        const userTemplateId = await prisma.template.findUnique({
            where: {
                id: tempId,
            },
            select: {
                userId: true,
            }
        });

        // if user is not the same as the template's user, then its an unauthorized request
        if (user.id != userTemplateId.userId) {
            return res.status(403).json({ error: "Unauthorized, must be template's author to modify." })
        }

        // validate inputs, title and extension can't be empty
        if (title !== undefined && typeof title !== "string") {
            return res.status(400).json({ error: "Missing title."});
        }
    
        if (extension !== undefined && typeof extension !== "string") {
            return res.status(400).json({ error: "Missing template code language."});
        }
    
        if (code !== undefined && typeof code !== "string") {
            return res.status(400).json({ error: "Code must be a string."});
        }

        // validate tags that are added and tags that are removed
        const invalidTagIds = await validateTags(tagsAdded);
        if (invalidTagIds.length > 0) {
            return res.status(400).json({ error: `Invalid tag IDs: ${invalidTagIds.join(', ')}` });
        }

        const invalidRemovedTagIds = await validateTags(tagsRemoved);
        if (invalidRemovedTagIds.length > 0) {
            return res.status(400).json({ error: `Invalid tag IDs: ${invalidRemovedTagIds.join(', ')}` });
        }

        const tagsToConnect = tagsAdded.map(tagId => ({ id: tagId }));
        const tagsToDisconnect = tagsRemoved.map(tagId => ({ id: tagId }));

        // update the template, title, explanation, code, extension, and tags
        const updTemplate = await prisma.template.update({
            where: { id: tempId },
            data: {
                title: title,
                explanation: explanation,
                code: code,
                extension: extension,
                tags: {
                    connect: tagsToConnect.length > 0 ? tagsToConnect : undefined,
                    disconnect: tagsToDisconnect.length > 0 ? tagsToDisconnect : undefined
                },
            },
            include: {
                blogposts: true,
                tags: true,
                forks: true,
            }
        });

        return res.status(200).json(updTemplate);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error fetching template." });
    }
}