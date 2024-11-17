import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";
import { findTags } from "@/utils/tags";
import { deleteTags } from "@/utils/tags";

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

        const tagsToConnect = await findTags(tagsAdded);
        const tagsToDisconnect = await findTags(tagsRemoved);

        // update the template, title, explanation, code, extension, and tags
        const updTemplate = await prisma.template.update({
            where: { id: tempId },
            data: {
                title: title,
                explanation: explanation,
                code: code,
                extension: extension,
                tags: {
                    connect: tagsToConnect.length > 0 ? tagsToConnect.map(id => ({ id })) : undefined,
                    disconnect: tagsToDisconnect.length > 0 ? tagsToDisconnect.map(id => ({ id })) : undefined,
                },
            },
            include: {
                blogposts: {
                    include: {
                        user: true,
                    }
                },
                tags: true,
                forks: {
                    include: {
                        user: true,
                        tags: true,
                    }
                },
                user: true,
            }
        });

        // formal delete of tags that might be "orphaned"
        await deleteTags(tagsToDisconnect);

        return res.status(200).json(updTemplate);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error fetching template." });
    }
}