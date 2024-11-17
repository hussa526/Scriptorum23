import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";
import { validateTags } from "@/utils/template";
import { validateTemplates } from "@/utils/template";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // user must be authenticated before creating a blogpost

    // check auth, userId will come from authentication token
    const authHeader = req.headers.authorization;
    
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;
    const { title, content, tagsId = [], templatesId = [] } = req.body;

    // validate inputs
    if (!title) {
        return res.status(400).json({ error: "Missing title." });
    }

    if (!content) {
        return res.status(400).json({ error: "Missing content." });
    }

    try {
        // validate tags - tags must exist in order to link them to blogpost
        const invalidTagIds = await validateTags(tagsId);
        if (invalidTagIds.length > 0) {
            return res.status(400).json({ error: `Invalid tag IDs: ${invalidTagIds.join(', ')}` });
        }

        // validate templates - templates must exist in order to link them to blogpost
        const invalidTemplateIds = await validateTemplates(templatesId);
        if (invalidTemplateIds.length > 0) {
            return res.status(400).json({ error: `Invalid template IDs: ${invalidTemplateIds.join(', ')}` });
        }

        // create a blogpost
        const blogpost = await prisma.blogpost.create({
            data: {
                title: title,
                content: content,
                isHidden: false,
                tags: tagsId.length > 0 ? { connect: tagsId.map(tagId => ({ id: tagId })) } : undefined,
                templates: templatesId.length > 0 ? { connect: templatesId.map(templateId => ({ id: templateId })) } : undefined,
                userId: user.id
            },
            include: {
                tags: true,
                templates: true,
                votes: true,
                comments: true
            }
        });

        console.log(blogpost);
        return res.status(201).json(blogpost);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error creating blogpost."})
    }
}