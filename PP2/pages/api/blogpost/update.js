import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";
import { validateTags } from "@/utils/template";
import { validateTemplates } from "@/utils/template";

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    // user must be authenticated before modifying any blogposts

    const authHeader = req.headers.authorization;
    
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;
    const { blogpostId, title, content, tagsAdded = [], tagsRemoved = [], templatesAdded = [], templatesRemoved = [] } = req.body;

    if (typeof(blogpostId) !== "number") {
        return res.status(400).json({ error: "Id must be a number." });
    }

    // validate inputs, title and content can't be empty
    if (!title) {
        return res.status(400).json({ error: "Missing title."});
    }

    if (!content) {
        return res.status(400).json({ error: "Missing content." });
    }

    if (!blogpostId) {
        return res.status(400).json({ error: "Missing blogpostId."});
    }
    
    // first check if user can modify blogpost, no validation should be done yet
    // even if they input an empty title, it doesn't matter since they will be unauthorized

    try {
        // find the blogpost we are to modify
        const userBlogpostId = await prisma.blogpost.findUnique({
            where: {
                id: blogpostId,
            },
            select: {
                userId: true,
            }
        });

        if (!userBlogpostId) {
            return res.status(404).json({ error: "Blogpost not found." })
        }

        // if user is not the same as the blogpost's user, then its an unauthorized request
        if (user.id != userBlogpostId.userId) {
            return res.status(403).json({ error: "Unauthorized, must be blogpost's author to modify." })
        }

        // validate tags that are added and tags that are removed
        const invalidTagIds = validateTags(tagsAdded);
        if (invalidTagIds.length > 0) {
            return res.status(400).json({ error: `Invalid tag IDs: ${invalidTagIds.join(', ')}` });
        }

        const invalidRemovedTagIds = await validateTags(tagsRemoved);
        if (invalidRemovedTagIds.length > 0) {
            return res.status(400).json({ error: `Invalid tag IDs: ${invalidRemovedTagIds.join(', ')}` });
        }

        // validate templates - templates must exist in order to link them to blogpost
        const invalidTemplateIds = await validateTemplates(templatesAdded);
        if (invalidTemplateIds.length > 0) {
            return res.status(400).json({ error: `Invalid template IDs: ${invalidTemplateIds.join(', ')}` });
        }

        // validate templates - templates must exist in order to unlink them to blogpost
        const invalidRemovedTemplateIds = await validateTemplates(templatesRemoved);
        if (invalidRemovedTemplateIds.length > 0) {
            return res.status(400).json({ error: `Invalid template IDs: ${invalidRemovedTemplateIds.join(', ')}` });
        }

        const tagsToConnect = tagsAdded.map(tagId => ({ id: tagId }));
        const tagsToDisconnect = tagsRemoved.map(tagId => ({ id: tagId }));

        const templatesToConnect = templatesAdded.map(templateId => ({ id: templateId }));
        const templatesToDisconnect = templatesAdded.map(templateId => ({ id: templateId }));

        // update the blogpost, title, explanation, code, extension, and tags
        const updBlogpost = await prisma.blogpost.update({
            where: { id: blogpostId },
            data: {
                title: title,
                content: content,
                isHidden: false,
                templates: {
                    connect: templatesToConnect.length > 0 ? templatesToConnect : undefined,
                    disconnect: templatesToDisconnect.length > 0 ? templatesToDisconnect : undefined
                },
                tags: {
                    connect: tagsToConnect.length > 0 ? tagsToConnect : undefined,
                    disconnect: tagsToDisconnect.length > 0 ? tagsToDisconnect : undefined
                },
            },
            include: {
                tags: true,
                templates: true,
                votes: true,
                comments: true
            }
        });

        return res.status(200).json(updBlogpost);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error updating blogpost." });
    }
}