import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";
import { findTags } from "@/utils/tags"; 

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // user must be authenticated before creating any templates
    // check auth, userId will come from authentication token
    const authHeader = req.headers.authorization;
    
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;

    const { title, explanation, code = '', extension, tags } = req.body;

    // validate inputs
    if (!title || typeof title !== "string") {
        return res.status(400).json({ error: "Missing title."});
    }

    if (!extension || typeof title !== "string") {
        return res.status(400).json({ error: "Missing template code language."})
    }
    
    const tagList = tags.split(',').map(tag => tag.trim());

    try {
        let tagsId = await findTags(tagList);

        // create a template, 
        const template = await prisma.template.create({
            data: {
                title: title,
                explanation: explanation,
                userId: user.id,
                isForked: false,
                forkedId: null,
                code: code,
                extension: extension,
                tags: tagsId.length > 0 ? { connect: tagsId.map(tagId => ({ id: tagId })) } : undefined,
            },
        });

        return res.status(201).json(template);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error creating template."})
    }
}